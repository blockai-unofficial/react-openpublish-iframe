var React = require('react');
var request = require('request');
var testCommonWallet = require('test-common-wallet');

var request = require("request");

var NoBalance = require('./no-balance');

var openpublishState = require('openpublish-state')({
  network: "testnet"
});

var DEV_HOST = "http://localhost:5051";

var coreHost = "https://core.quickcoin.co";
if (typeof(DEV_HOST) != "undefined") {
  coreHost = DEV_HOST;
}

var OpenPublishIframe = require('./');

var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet",
  inBrowser: true
});

var commonWallet = testCommonWallet({
  seed: "test",
  network: "testnet",
  commonBlockchain: commonBlockchain
});

var linkUrlTemplate = "http://localhost:5151/sha1/:sha1";

var getAddressBookFromBlockaiWithDocument = function(openpublishDocument, callback) {
  var onlyUnique = function(value, index, self) { 
    return self.indexOf(value) === index;
  }
  var address = openpublishDocument.sourceAddresses[0];
  request(coreHost + '/v0/batchPublicInfo/' + address, function(err, res, body) {
    var addressBook = {};
    if (res.statusCode >= 400) {
      return callback(false, addressBook);
    }
    var address = JSON.parse(body);
    addressBook[address.publicAddress] = {
      avatarImageUrl: address.profileImageUrl,
      avatarName: address.quickCode,
      avatarSource: 'blockai'
    };
    callback(false, addressBook);
  });
};

commonBlockchain.Addresses.Summary([commonWallet.address], function(err, adrs) { 
  var balance = adrs && adrs[0] ? adrs[0].balance : 0;
  openpublishState.findDoc({sha1:"2dd0b83677ac2271daab79782f0b9dcb4038d659", includeTips: true}, function(err, openpublishDoc) {
    getAddressBookFromBlockaiWithDocument(openpublishDoc, function(err, addressBook) {
      React.render(React.createElement(OpenPublishIframe, { 
        commonBlockchain: commonBlockchain, 
        commonWallet: commonWallet, 
        openpublishState:openpublishState, 
        openpublishDoc:openpublishDoc, 
        balance: balance,
        addressBook: addressBook,
        linkUrlTemplate: linkUrlTemplate,
        blockchainType: "testnet",
        NoBalance: NoBalance
      }), document.getElementById('example'));
    });
  });
});

