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

const INITIAL_CALL_DISTRIBUTED = 7875000;
const INITIAL_CALLG_DISTRIBUTED = 1575000000;
const CALL_SOFTCAP = 18049500;
const CALLG_SOFTCAP = 3609900000;

contract("CapitalTechCrowdsale", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());
  });

  beforeEach(async function() {
    await advanceBlock();
    /*
    this.crowdsale = await CapitalTechCrowdsale.new(owner, FiatContract.address, CALLToken.address, CALLGToken.address);

    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    await this.crowdsale.powerUpContract();
    */
  });

  it("The contracts should be deployed", async function() {
    this.crowdsale.should.exist;
    this.call_token.should.exist;
    this.callg_token.should.exist;
  });

  it("The crowdsale should be started with correct parameters", async function() {
    this.crowdsale.powerUpContract();

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
    callDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALL_DISTRIBUTED);
    callgDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALLG_DISTRIBUTED);
    maxContributionPerAddress.div(1e18).toNumber().should.be.equal(1500);
    minInvestment.div(1e18).toNumber().should.be.equal(0.01);
    walletCrowdsale.should.be.equal(owner);
    weiRaised.toNumber().should.be.equal(0);
    callSoftCap.div(1e18).toNumber().should.be.equal(CALL_SOFTCAP);
    callgSoftCap.div(1e18).toNumber().should.be.equal(CALLG_SOFTCAP);
  });

  it("Should resist multiple powerups", async function() {
    await this.crowdsale.powerUpContract().should.be.rejectedWith('VM Exception while processing transaction: revert');
  });

  it("The price should be right for PRIVATE_SALE", async function() {
    let amount = new BigNumber(1).mul(1e18);
    const result = await this.crowdsale.getAmountForCurrentStage(amount);

    result.div(1e18).toNumber().should.be.equal(1698.29457259);
  });

  it("The hardcap should be right for PRIVATE_SALE", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(10842563);
    hardcap[1].div(1e18).toNumber().should.be.equal(2168512500);
  });

  it("The investor should be able to buy tokens in PRIVATE_SALE", async function() {
    let amount = new BigNumber(0.1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });
    const callDistributed = await this.crowdsale.callDistributed();
    const callgDistributed = await this.crowdsale.callgDistributed();
    const amountForStage = await this.crowdsale.getAmountForCurrentStage(amount);
    const weiRaised = await this.crowdsale.weiRaised();
    const userContribution = await this.crowdsale.getUserContribution(investor);
    callDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALL_DISTRIBUTED + amountForStage.div(1e18).toNumber());
    callgDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALLG_DISTRIBUTED + amountForStage.div(1e18).toNumber() * 200);
    weiRaised.div(1e18).toNumber().should.be.equal(0.1);
    userContribution.div(1e18).toNumber().should.be.equal(0.1);
    // TODO: Check vault balance
    // TODO: Check user history as well
  });

  it("It should increase time by 30 days", async function() {
    const duration = 30 * 3600 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to PRE_SALE", async function() {
    await this.crowdsale.updateStage()

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(1);
  });

  it("The price should be right for PRE_SALE", async function() {
    let amount = new BigNumber(1).mul(1e18);
    const result = await this.crowdsale.getAmountForCurrentStage(amount);

    result.div(1e18).toNumber().should.be.equal(1188.80605948);
  });

  it("The hardcap should be right for PRE_SALE", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(18049500);
    hardcap[1].div(1e18).toNumber().should.be.equal(3609900000);
  });

  it("The investor should be able to buy tokens in PRE_SALE", async function() {
    let amount = new BigNumber(0.1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });
    const callDistributed = await this.crowdsale.callDistributed();
    const callgDistributed = await this.crowdsale.callgDistributed();
    const amountForStage = await this.crowdsale.getAmountForCurrentStage(amount);
    const weiRaised = await this.crowdsale.weiRaised();
    const userContribution = await this.crowdsale.getUserContribution(investor);
    //callDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALL_DISTRIBUTED + amountForStage.div(1e18).toNumber());
    //callgDistributed.div(1e18).toNumber().should.be.equal(INITIAL_CALLG_DISTRIBUTED + amountForStage.div(1e18).toNumber() * 200);
    weiRaised.div(1e18).toNumber().should.be.equal(0.2);
    userContribution.div(1e18).toNumber().should.be.equal(0.2);
    // TODO: Check vault balance
    // TODO: Check user history as well
  });

  it("It should increase time by 30 days", async function() {
    const duration = 30 * 3600* 24;

    increaseTime(duration);
  });

  it("The stage should advance to MAIN_SALE_1", async function() {
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(2);
  });

  it("It should increase time by 7 days", async function() {
    const duration = 7 * 3600 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to MAIN_SALE_2", async function() {
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(3);
  });

  it("It should increase time by 7 days", async function() {
    const duration = 7 * 3600 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to MAIN_SALE_3", async function() {
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(4);
  });

  it("It should increase time by 7 days", async function() {
    const duration = 7 * 3600 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to MAIN_SALE_4", async function() {
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(5);
  });

  it("It should increase time by 7 days", async function() {
    const duration = 7 * 3600 * 24;

    increaseTime(duration);
  });

  it("The sale should be finalized", async function() {
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(6);
  });
});
