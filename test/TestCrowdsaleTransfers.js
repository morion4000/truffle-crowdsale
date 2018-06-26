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
const FiatContract = artifacts.require("./FiatContract.sol")
const CALLGToken = artifacts.require("./CALLGToken.sol");
const CALLToken = artifacts.require("./CALLToken.sol");
const CapitalTechCrowdsale = artifacts.require("./CapitalTechCrowdsale.sol");
const parameters = require('./local_parameters.json');

let TestCallRaised = 0;
let TestCallDistributed = 0;
let TestCallgDistributed = 0;

let checkBalances = async function(_this, amount) {
  const _amount = amount.div(1e18).toNumber();
  const callDistributed = await _this.crowdsale.callDistributed();
  const callgDistributed = await _this.crowdsale.callgDistributed();
  const userHistory = await _this.crowdsale.getUserHistory(_this.investor);

  TestCallRaised += _amount;
  TestCallDistributed += _amount;
  TestCallgDistributed += _amount * 200;

  callDistributed.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallDistributed.toFixed(8));
  callgDistributed.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallgDistributed.toFixed(8));
  userHistory.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallRaised.toFixed(8));
};

contract("TestCrowdsaleTransfers", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.investor = investor;
    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    this.crowdsale.powerUpContract();

    TestCallDistributed += parameters.INITIAL_DISTRIBUTION.CALL;
    TestCallgDistributed += parameters.INITIAL_DISTRIBUTION.CALLG;
  });

  beforeEach(async function() {
    await this.crowdsale.updateStage();

    await advanceBlock();
  });

  it("The owner should be able to transfer tokens in PRIVATE_SALE", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.PRIVATE_SALE.DURATION * 3600 * 24);
  });

  it("The owner should be able to transfer tokens in PRE_SALE", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.PRE_SALE.DURATION * 3600 * 24);
  });

  it("The owner should be able to transfer tokens in MAIN_SALE_1", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.MAIN_SALE_1.DURATION * 3600 * 24);
  });

  it("The owner should be able to transfer tokens in MAIN_SALE_2", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.MAIN_SALE_2.DURATION * 3600 * 24);
  });

  it("The owner should be able to transfer tokens in MAIN_SALE_3", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.MAIN_SALE_3.DURATION * 3600 * 24);
  });

  it("The owner should be able to transfer tokens in MAIN_SALE_4", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await checkBalances(this, amount);

    increaseTime(parameters.STAGES.MAIN_SALE_4.DURATION * 3600 * 24);
  });

  it("The owner should not be able to transfer tokens after sale", async function() {
    const amount = new BigNumber(10000).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    }).should.be.rejectedWith('VM Exception while processing transaction: revert');
  });
});
