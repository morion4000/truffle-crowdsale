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

contract("CapitalTechCrowdsale", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();
  });

  beforeEach(async function() {
    this.crowdsale = await CapitalTechCrowdsale.new(owner, FiatContract.address, CALLToken.address, CALLGToken.address);

    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    await this.crowdsale.powerUpContract();
  });

  it("The crowdsale should be started with correct parameters", async function() {
    this.crowdsale.should.exist;
    this.call_token.should.exist;
    this.callg_token.should.exist;

    const stageStartTime = await this.crowdsale.stageStartTime();
    const stage = await this.crowdsale.stage();
    const callDistributed = await this.crowdsale.callDistributed();
    const callgDistributed = await this.crowdsale.callgDistributed();
    const maxContributionPerAddress = await this.crowdsale.maxContributionPerAddress();
    const minInvestment = await this.crowdsale.minInvestment();
    const walletCrowdsale = await this.crowdsale.wallet();
    const weiRaised = await this.crowdsale.weiRaised();
    const callSoftCap = await this.crowdsale.callSoftCap();
    const callgSoftCap = await this.crowdsale.callgSoftCap();

    stageStartTime.toNumber().should.be.greaterThan(0);
    stage.toNumber().should.be.equal(0);
    callDistributed.toNumber().should.be.equal(0);
    callgDistributed.toNumber().should.be.equal(0);
    maxContributionPerAddress.div(1e18).toNumber().should.be.equal(1500);
    minInvestment.div(1e18).toNumber().should.be.equal(0.01);
    walletCrowdsale.should.be.equal(owner);
    weiRaised.toNumber().should.be.equal(0);
    callSoftCap.div(1e18).toNumber().should.be.equal(10710000);
    callgSoftCap.div(1e18).toNumber().should.be.equal(2142000000);
  });

  it("The price should be right for PRIVATE_SALE", async function() {
    let instance = await CapitalTechCrowdsale.deployed();
    let amount = new BigNumber(1).mul(1e18);
    const result = await instance.getAmountForCurrentStage(amount);

    result.div(1e18).toNumber().should.be.equal(1698.29457259);
  });

  it("The hardcap should be right for PRIVATE_SALE", async function() {
    let instance = await CapitalTechCrowdsale.deployed();

    const hardcap = await instance.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(3123750);
    hardcap[1].div(1e18).toNumber().should.be.equal(62475000);
  });

  it("The investor should be able to buy tokens in PRIVATE_SALE", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let amount = new BigNumber(0.1).mul(1e18);
    let purchase = await instance.buyTokens(investor, {
      from: investor,
      value: amount
    });

    const callDistributed = await instance.callDistributed();
    const callgDistributed = await instance.callgDistributed();
    const weiRaised = await instance.weiRaised();
    const userContribution = await instance.getUserContribution(investor);

    callDistributed.div(1e18).toNumber().should.be.equal(118.88060594);
    callgDistributed.div(1e18).toNumber().should.be.equal(23895.00179394);
    weiRaised.div(1e18).toNumber().should.be.equal(0.1);
    userContribution.div(1e18).toNumber().should.be.equal(0.1);
    // TODO: Check vault balance
  });

  it("It should increase time by 8 days", async function() {
    var duration = 8 * 60 * 60 * 24;

    var before = await latestTime();

    increaseTime(duration);

    await advanceBlock();

    var after = await latestTime();

    after.should.be.greaterThan(before);
  });

  it("The stage should advance to PRE_SALE", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let call = await instance.updateStage()

    const stage = await instance.stage();

    stage.toNumber().should.be.equal(1);
  });

  it("The price should be right for PRE_SALE", async function() {
    let instance = await CapitalTechCrowdsale.deployed();
    let amount = new BigNumber(1).mul(1e18);
    const result = await instance.getAmountForCurrentStage(amount);

    result.div(1e18).toNumber().should.be.equal(1188.80605948);
  });

  it("The hardcap should be right for PRE_SALE", async function() {
    let instance = await CapitalTechCrowdsale.deployed();

    const hardcap = await instance.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(7586250);
    hardcap[1].div(1e18).toNumber().should.be.equal(1517250000);
  });

  it("The investor should be able to buy tokens in PRE_SALE", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let amount = new BigNumber(0.1).mul(1e18);
    let purchase = await instance.buyTokens(investor, {
      from: investor,
      value: amount
    });

    const callDistributed = await instance.callDistributed();
    const callgDistributed = await instance.callgDistributed();
    const weiRaised = await instance.weiRaised();
    const userContribution = await instance.getUserContribution(investor);

    callDistributed.div(1e18).toNumber().should.be.equal(237.76121188);
    callgDistributed.div(1e18).toNumber().should.be.equal(24013.88239988);
    weiRaised.div(1e18).toNumber().should.be.equal(0.2);
    userContribution.div(1e18).toNumber().should.be.equal(0.2);
    // TODO: Check vault balance
  });

  it("It should increase time by 8 days", async function() {
    var duration = 8 * 60 * 60 * 24;

    var before = await latestTime();

    increaseTime(duration);

    await advanceBlock();

    var after = await latestTime();

    after.should.be.greaterThan(before);
  });

  it("The stage should advance to MAIN_SALE_1", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let call = await instance.updateStage();

    const stage = await instance.stage();

    stage.toNumber().should.be.equal(2);
  });
});
