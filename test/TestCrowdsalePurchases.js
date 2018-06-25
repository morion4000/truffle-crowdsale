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

let TestEtherRaised = 0;
let TestCallRaised = 0;
let TestCallDistributed = 0;
let TestCallgDistributed = 0;

let checkBalances = async function(_this, stage) {
  const callDistributed = await _this.crowdsale.callDistributed();
  const callgDistributed = await _this.crowdsale.callgDistributed();
  const weiRaised = await _this.crowdsale.weiRaised();
  const userContribution = await _this.crowdsale.getUserContribution(_this.investor);
  const userHistory = await _this.crowdsale.getUserHistory(_this.investor);
  const refundVault = await _this.crowdsale.vault();
  const refundVaultBalance = web3.eth.getBalance(refundVault);
  const stageAmount = parameters.STAGES[stage].CALL_PER_ETHER;

  TestEtherRaised += 1;
  TestCallRaised += stageAmount;
  TestCallDistributed += stageAmount;
  TestCallgDistributed += stageAmount * 200;

  callDistributed.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallDistributed.toFixed(8));
  callgDistributed.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallgDistributed.toFixed(8));
  weiRaised.div(1e18).toNumber().should.be.equal(TestEtherRaised);
  userContribution.div(1e18).toNumber().should.be.equal(TestEtherRaised);
  userHistory.div(1e18).toNumber().toFixed(8).should.be.equal(TestCallRaised.toFixed(8));
  refundVaultBalance.div(1e18).toNumber().should.be.equal(TestEtherRaised);
};

contract("TestCrowdsalePurchases", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.owner = owner;
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

  it("The investor should be able to buy tokens in PRIVATE_SALE", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'PRIVATE_SALE');

    increaseTime(parameters.STAGES.PRIVATE_SALE.DURATION * 3600 * 24);
  });

  it("The investor should be able to buy tokens in PRE_SALE", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'PRE_SALE');

    increaseTime(parameters.STAGES.PRE_SALE.DURATION * 3600 * 24);
  });

  it("The investor should be able to buy tokens in MAIN_SALE_1", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'MAIN_SALE_1');

    increaseTime(parameters.STAGES.MAIN_SALE_1.DURATION * 3600 * 24);
  });

  it("The investor should be able to buy tokens in MAIN_SALE_2", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'MAIN_SALE_2');

    increaseTime(parameters.STAGES.MAIN_SALE_2.DURATION * 3600 * 24);
  });

  it("The investor should be able to buy tokens in MAIN_SALE_3", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'MAIN_SALE_3');

    increaseTime(parameters.STAGES.MAIN_SALE_3.DURATION * 3600 * 24);
  });

  it("The investor should be able to buy tokens in MAIN_SALE_4", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    await checkBalances(this, 'MAIN_SALE_4');

    increaseTime(parameters.STAGES.MAIN_SALE_4.DURATION * 3600 * 24);
  });

  it("The investor should not be able to buy tokens after sale", async function() {
    let amount = new BigNumber(1).mul(1e18);
    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    }).should.be.rejectedWith('VM Exception while processing transaction: revert');
  });
});
