'use strict';

var React = require('react/addons');
var Context = require('components/Context');
var Buffers = require('components/Buffers');
var playNote = require('components/playNote');


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
  audios: function () {
    return [
      'clap',
      'cowbell',
      'crash',
      'hat',
      'kick',
      'snap',
      'tom',
      'tom2',
      'snare',
      'triangle'
    ];
  },
  handleSnap: function (name, event) {
    event.preventDefault();
    event.stopPropagation();
    var buffer = Buffers.get(name);
    playNote(name, 1, 'null', 'null', 'null', 'null', buffer.duration);
  },
  renderSnap: function (name) {
    return (
      <li onClick={this.handleSnap.bind(this, name)}>{name}</li>
    );
  },
  renderList: function () {
    return (
      <ul className='snap'>{
        this.audios().map(this.renderSnap)
      }</ul>
    );
  },
  render: function () {
    return (
      <div className="App">{
        this.renderList()
      }</div>
    );
  }
});
