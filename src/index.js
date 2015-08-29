var React = require('react');

var moment = require('moment');
var openpublish = require('openpublish');

var md5 = require('md5');

var OpenPublishIframe = React.createClass({
  displayName: 'OpenPublishIframe',
  propTypes: {
    commonBlockchain: React.PropTypes.object.isRequired,
    commonWallet: React.PropTypes.object.isRequired,
    openpublishState: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      openpublishDoc: false,
      registrationTx: false,
      tippingState: false,
      tipCount: 0
    };
  },
  tip: function() {
    var openpublishDoc = this.props.openpublishDoc;
    var component = this;
    var commonWallet = this.props.commonWallet;
    var commonBlockchain = this.props.commonBlockchain;
    if (!commonWallet || !commonWallet.address || !commonBlockchain) {
      return;
    }
    if (this.state.balance === 0) {
      this.setState({showNeedBitcoinModal: true});
      return;
    }
    var component = this;
    this.setState({
      tippingState: "tipping"
    });
    var destination = openpublishDoc.sourceAddresses[0];
    var sha1 = openpublishDoc.sha1;
    var amount = 10000;
    openpublish.tip({
      destination: destination,
      sha1: sha1,
      amount: amount,
      commonWallet: commonWallet,
      commonBlockchain: commonBlockchain
    }, function(error, tipTx) {
      component.setState({
        tippingState: "tipped",
        tipTx: tipTx,
        tipCount: component.state.tipCount + 1
      });
    });
  },
  render: function () {
    var openpublishDoc = this.props.openpublishDoc;
    var sourceAddress = openpublishDoc.sourceAddresses[0];

    var createdAt = moment(openpublishDoc.created_at);
    var createdAgo = createdAt.fromNow();

    var addressBook = this.props.addressBook;
    var avatarInfo = addressBook[sourceAddress] || false;
    var avatarImageUrl = avatarInfo ? avatarInfo.avatarImageUrl : "https://secure.gravatar.com/avatar/" + md5(sourceAddress) + "?d=retro&s=40";
    var avatarName = avatarInfo ? avatarInfo.avatarName : sourceAddress;

    var sha1 = openpublishDoc.sha1;
    var linkUrl = this.props.linkUrlTemplate.replace(":sha1", sha1);

    var media;
    if (openpublishDoc.type.indexOf("image") > -1) {
      media = <img src={openpublishDoc.uri} />
    }

    var tipCount = openpublishDoc.tipCount;

    var tippingState = this.state.tippingState;

    var tipState = <span><span className="tip-count">{tipCount}</span> tips</span>;
    if (tippingState == "tipping") {
      tipState = <span className="tipping">Tipping...</span>
    }
    if (tippingState == "tipped" && this.state.tipTx) {
      var type = this.props.blockchainType && this.props.blockchainType == "testnet" ? "tBTC" : "BTC";
      var receiptUrl = "https://www.blocktrail.com/" + type + "/tx/" + this.state.tipTx.txid;
      tipState = <span><span className="tip-count">{tipCount + this.state.tipCount}</span> tips <a className="receipt" href={receiptUrl}>Receipt</a></span>;
    }

    var modalBodyContent;
    if (this.state.balance === 0 && this.props.balance === 0 && this.props.NoBalance && this.props.commonWallet && this.props.commonWallet.address) {
      var NoBalance = this.props.NoBalance;
      modalBodyContent = <NoBalance address={this.props.commonWallet.address} intentMessage={"to tip Open Published images"} />;
    }
    else {
      modalBodyContent= (
        <div>
          <h4>Bitcoin Transaction Success</h4>
          <p>
            Great, your wallet now has funds.
          </p>
          <p>
            Feel free to tip any and all Open Published images and support what you like!
          </p>
        </div>
      );
    }

    return (
      <div className='react-openpublish-iframe panel panel-default'>
        <div className="top-bar">
          <div className="publish-info">
            <div className="avatarImage">
              <img src={avatarImageUrl} />
            </div>
            <div className="author-and-time">
              <h4>{avatarName}</h4>
              <div className="createdAgo">{createdAgo}</div>
            </div>
          </div>
          <div className="linkUrl">
            <a className="link" href={linkUrl}>Link</a>
          </div>
        </div>
        <div className="media">
          {media}
        </div>
        <div className="actions">
          <div className={"tips " + (tippingState ? tippingState : "")}>
            <button disabled={tippingState == "tipping"} onClick={this.tip}>Tip</button>{tipState}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = OpenPublishIframe;
