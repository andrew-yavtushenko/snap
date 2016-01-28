'use strict';

require.context('./worker/', true, /\.js$/);

var React = require('react');
var App = require('./containers/App');

React.render(
  <App />,
  document.getElementById('content')
);
