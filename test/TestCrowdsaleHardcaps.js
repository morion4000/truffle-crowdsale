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

contract("TestCrowdsaleHardcaps", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    this.crowdsale.powerUpContract();
  });

  beforeEach(async function() {
    await this.crowdsale.updateStage();

    await advanceBlock();
  });

  it("The hardcap should be right for PRIVATE_SALE", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.PRIVATE_SALE.DURATION * 3600 * 24);
  });

  it("The hardcap should be right for PRE_SALE", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.PRE_SALE.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.PRE_SALE.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.PRE_SALE.DURATION * 3600 * 24);
  });

  it("The hardcap should be right for MAIN_SALE_1", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_1.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_1.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.MAIN_SALE_1.DURATION * 3600 * 24);
  });

  it("The hardcap should be right for MAIN_SALE_2", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_2.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_2.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.MAIN_SALE_2.DURATION * 3600 * 24);
  });

  it("The hardcap should be right for MAIN_SALE_3", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_3.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_3.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.MAIN_SALE_3.DURATION * 3600 * 24);
  });

  it("The hardcap should be right for MAIN_SALE_4", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_4.HARDCAP.CALL);
    hardcap[1].div(1e18).toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_4.HARDCAP.CALLG);

    increaseTime(parameters.STAGES.MAIN_SALE_4.DURATION * 3600 * 24);
  });
});
