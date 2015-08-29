'use strict';

var React = require('react');
var NoBalance = React.createClass({
  displayName: 'NoBalance',

  render: function render() {
    var address = this.props.address;
    var intentMessage = this.props.intentMessage;
    var tweetUrlBase = 'https://twitter.com/intent/tweet';
    tweetUrlBase += '?text=' + encodeURIComponent('My wallet, ' + address + ', needs some funds ' + intentMessage + '!');
    tweetUrlBase += '&hashtags=needbitcoin';
    //tweetUrlBase += '&url=' + encodeURIComponent('https://www.blockai.com/address/' + address);
    return React.createElement(
      'div',
      { className: 'no-balance' },
      React.createElement(
        'h4',
        null,
        'Uh oh, you don\'t have any Bitcoin!'
      ),
      React.createElement(
        'p',
        null,
        'If you\'d like ',
        intentMessage,
        ' you\'re going need to get some Bitcoin.'
      ),
      React.createElement(
        'p',
        null,
        'If you or someone you know does have Bitcoin, send some to this address: ',
        React.createElement(
          'a',
          { href: 'bitcoin:' + address },
          address
        )
      ),
      React.createElement(
        'p',
        null,
        'If not, don\'t worry, there\'s a lot of people ready to give out a few cents worth to get new people involved!'
      ),
      React.createElement(
        'p',
        null,
        'Sometimes ',
        React.createElement(
          'strong',
          null,
          'it can take a few minutes'
        ),
        ' for the Bitcoin network to register a transaciton and update your balance. Please be patient!'
      ),
      React.createElement(
        'p',
        null,
        React.createElement(
          'a',
          { href: tweetUrlBase, className: 'btn btn-primary' },
          'Ask on Twitter for Bitcoin'
        )
      )
    );
  }
});
module.exports = NoBalance;