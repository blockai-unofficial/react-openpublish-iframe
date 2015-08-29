'use strict';

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
  getInitialState: function getInitialState() {
    return {
      openpublishDoc: false,
      registrationTx: false,
      tippingState: false,
      tipCount: 0
    };
  },
  tip: function tip() {
    var openpublishDoc = this.props.openpublishDoc;
    var component = this;
    var commonWallet = this.props.commonWallet;
    var commonBlockchain = this.props.commonBlockchain;
    if (!commonWallet || !commonWallet.address || !commonBlockchain) {
      return;
    }
    if (this.state.balance === 0) {
      this.setState({ showNeedBitcoinModal: true });
      return;
    }
    var component = this;
    this.setState({
      tippingState: 'tipping'
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
    }, function (error, tipTx) {
      component.setState({
        tippingState: 'tipped',
        tipTx: tipTx,
        tipCount: component.state.tipCount + 1
      });
    });
  },
  render: function render() {
    var openpublishDoc = this.props.openpublishDoc;
    var sourceAddress = openpublishDoc.sourceAddresses[0];

    var createdAt = moment(openpublishDoc.created_at);
    var createdAgo = createdAt.fromNow();

    var addressBook = this.props.addressBook;
    var avatarInfo = addressBook[sourceAddress] || false;
    var avatarImageUrl = avatarInfo ? avatarInfo.avatarImageUrl : 'https://secure.gravatar.com/avatar/' + md5(sourceAddress) + '?d=retro&s=40';
    var avatarName = avatarInfo ? avatarInfo.avatarName : sourceAddress;

    var sha1 = openpublishDoc.sha1;
    var linkUrl = this.props.linkUrlTemplate.replace(':sha1', sha1);

    var media;
    if (openpublishDoc.type.indexOf('image') > -1) {
      media = React.createElement('img', { src: openpublishDoc.uri });
    }

    var tipCount = openpublishDoc.tipCount;

    var tippingState = this.state.tippingState;

    var tipState = React.createElement(
      'span',
      null,
      React.createElement(
        'span',
        { className: 'tip-count' },
        tipCount
      ),
      ' tips'
    );
    if (tippingState == 'tipping') {
      tipState = React.createElement(
        'span',
        { className: 'tipping' },
        'Tipping...'
      );
    }
    if (tippingState == 'tipped' && this.state.tipTx) {
      var type = this.props.blockchainType && this.props.blockchainType == 'testnet' ? 'tBTC' : 'BTC';
      var receiptUrl = 'https://www.blocktrail.com/' + type + '/tx/' + this.state.tipTx.txid;
      tipState = React.createElement(
        'span',
        null,
        React.createElement(
          'span',
          { className: 'tip-count' },
          tipCount + this.state.tipCount
        ),
        ' tips ',
        React.createElement(
          'a',
          { className: 'receipt', href: receiptUrl },
          'Receipt'
        )
      );
    }

    var modalBodyContent;
    if (this.state.balance === 0 && this.props.balance === 0 && this.props.NoBalance && this.props.commonWallet && this.props.commonWallet.address) {
      var NoBalance = this.props.NoBalance;
      modalBodyContent = React.createElement(NoBalance, { address: this.props.commonWallet.address, intentMessage: 'to tip Open Published images' });
    } else {
      modalBodyContent = React.createElement(
        'div',
        null,
        React.createElement(
          'h4',
          null,
          'Bitcoin Transaction Success'
        ),
        React.createElement(
          'p',
          null,
          'Great, your wallet now has funds.'
        ),
        React.createElement(
          'p',
          null,
          'Feel free to tip any and all Open Published images and support what you like!'
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'react-openpublish-iframe panel panel-default' },
      React.createElement(
        'div',
        { className: 'top-bar' },
        React.createElement(
          'div',
          { className: 'publish-info' },
          React.createElement(
            'div',
            { className: 'avatarImage' },
            React.createElement('img', { src: avatarImageUrl })
          ),
          React.createElement(
            'div',
            { className: 'author-and-time' },
            React.createElement(
              'h4',
              null,
              avatarName
            ),
            React.createElement(
              'div',
              { className: 'createdAgo' },
              createdAgo
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'linkUrl' },
          React.createElement(
            'a',
            { className: 'link', href: linkUrl },
            'Link'
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'media' },
        media
      ),
      React.createElement(
        'div',
        { className: 'actions' },
        React.createElement(
          'div',
          { className: 'tips ' + (tippingState ? tippingState : '') },
          React.createElement(
            'button',
            { disabled: tippingState == 'tipping', onClick: this.tip },
            'Tip'
          ),
          tipState
        )
      )
    );
  }
});

module.exports = OpenPublishIframe;