# Ethereum Smart Contracts

[![Build Status](https://travis-ci.org/capital-technologies/truffle-crowdsale.svg?branch=master)](https://travis-ci.org/capital-technologies/truffle-crowdsale) [![solidity](https://img.shields.io/badge/code%20style-solidity-brightgreen.svg?style=flat-square)](https://github.com/ethereum/solidity) [![EIP20](https://img.shields.io/badge/TOKEN-ERC20-brightgreen.svg?style=flat-square)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT)

This repository contains Solidity smart contract codes. The repo currently implements [EIP20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) tokens

`truffle-flattener contracts/* > result.sol`
`solidity_flattener contracts/CapitalTechCrowdsale.sol --solc-paths=openzeppelin-solidity=$(pwd)/node_modules/openzeppelin-solidity/ > result.sol`
