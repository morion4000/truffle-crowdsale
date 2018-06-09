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

    stageStartTime.toNumber().should.be.greaterThan(0);
    stage.toNumber().should.be.equal(0);
    callDistributed.toNumber().should.be.equal(0);
    callgDistributed.toNumber().should.be.equal(0);
    maxContributionPerAddress.div(1e18).toNumber().should.be.equal(1500);
    minInvestment.div(1e18).toNumber().should.be.equal(0.01);
    walletCrowdsale.should.be.equal(owner);
    weiRaised.toNumber().should.be.equal(0);
  });

  it("The investor should be able to buy tokens in PRIVATE_SALE", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let amount = new BigNumber(0.1).mul(1e18);
    let purchase = await instance.buyTokens(investor, {from: investor, value: amount});

    // TODO: Check more information on the transaction
    purchase.logs.length.should.be.equal(1);

    const callDistributed = await instance.callDistributed();
    const callgDistributed = await instance.callgDistributed();
    const weiRaised = await instance.weiRaised();
    const userContribution = await instance.getUserContribution(investor);

    callDistributed.div(1e18).toNumber().should.be.equal(84.91472141);
    callgDistributed.div(1e18).toNumber().should.be.equal(17067.85900341);
    weiRaised.div(1e18).toNumber().should.be.equal(0.1);
    userContribution.div(1e18).toNumber().should.be.equal(0.1);
    // TODO: Check vault balance
  });

  it("It should increase time by 7 days", async function() {
    var duration = 7 * 60 * 60 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to PRE_SALE", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let call = await instance.updateStage()

    const stage = await instance.stage();

    stage.toNumber().should.be.equal(1);
  });

  it("It should increase time by 7 days", async function() {
    var duration = 7 * 60 * 60 * 24;

    increaseTime(duration);
  });

  it("The stage should advance to MAIN_SALE_1", async function() {
    // TODO: Use the contract instance created during beforeEach
    let instance = await CapitalTechCrowdsale.deployed();
    let call = await instance.updateStage()

    const stage = await instance.stage();

    stage.toNumber().should.be.equal(2);
  });
});
