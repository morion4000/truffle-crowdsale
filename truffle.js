require('babel-register');
require('babel-polyfill');
module.exports = {
  module: {
    loaders: [
      { test: /\.(js|jsx|es6)$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.json$/i, loader: "json-loader"},
      { test: /\.sol/, loader: 'truffle-solidity' }
    ]
  },
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    }
  }
};
