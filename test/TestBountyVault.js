import ether from './helpers/ether';
import {
  advanceBlock
} from './helpers/advanceToBlock.js';
import increaseTime from './helpers/increaseTime.js';
import latestTime from './helpers/latestTime.js';
import EVMRevert from './helpers/EVMRevert.js';

const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();
const BountyVault = artifacts.require("./FiatContract.sol");
const CapitalTechCrowdsale = artifacts.require("./CapitalTechCrowdsale.sol");
const parameters = require('./local_parameters.json');

contract("TestBountyVault", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.bounty = await BountyVault.deployed();
    this.crowdsale = await CapitalTechCrowdsale.deployed();
  });

  beforeEach(async function() {
    await advanceBlock();
  });

  it("The contracts should be deployed", async function() {
    this.bounty.should.exist;
  });

  it("The crowdsale should distribute bounty", async function() {
    await this.crowdsale.distributeBounty({from: owner});
  });
/*
  it("The crowdsale should distribute bounty", async function() {
    //const call = await this.bounty.token_call();

    console.log('a', this.bounty.token_call);
  });
*/
});
