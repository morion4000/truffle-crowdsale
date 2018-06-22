require('babel-register');
require('babel-polyfill');
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MNEMONIC = process.env.MNEMONIC;
const HDWalletProvider = require('truffle-hdwallet-provider');

const NETWORK_IDS = {
  ropsten: 2,
  rinkeby: 4,
  kovan: 42
};

module.exports = {
  module: {
    loaders: [
      { test: /\.(js|jsx|es6)$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.json$/i, loader: "json-loader"},
      { test: /\.sol/, loader: 'truffle-solidity' }
    ]
  },
  networks: {}
};

for (let networkName in NETWORK_IDS) {
  module.exports.networks[ networkName ] = {
    provider: new HDWalletProvider(MNEMONIC, 'https://' + networkName + '.infura.io/' + INFURA_API_KEY),
    network_id: NETWORK_IDS[ networkName ]
  };
}