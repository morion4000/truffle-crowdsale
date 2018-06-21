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

contract("TestCrowdsaleStagesByTime", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    this.crowdsale.powerUpContract();
  });

  beforeEach(async function() {
    await advanceBlock();
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
