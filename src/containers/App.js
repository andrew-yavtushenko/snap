'use strict';

var React = require('react/addons');
var Context = require('components/Context');
var Buffers = require('components/Buffers');

require('normalize.css');
require('../styles/main.css');

module.exports = React.createClass({
  componentDidMount: function () {
    window.addEventListener('touchstart', this.unlockContext, false);
    this.loadBuffers();
  },
  loadBuffers: function () {
    return new Promise(function (resolve) {
      Buffers.loadAll(resolve);
    });
  },
  unlockContext: function () {
    Context.unlock(function () {
      window.removeEventListener('touchstart', this.unlockContext);
    }.bind(this));
  },
  render: function () {
    return (
      <div className="App">
      </div>
    );
  }
});
