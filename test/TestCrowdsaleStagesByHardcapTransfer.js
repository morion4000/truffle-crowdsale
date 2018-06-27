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

contract("TestCrowdsaleStagesByHardcapTransfer", function([owner, wallet, investor, otherInvestor]) {
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

  it("The stage should be PRIVATE_SALE", async function() {
    const stage = await this.crowdsale.stage();
    const amount = new BigNumber(parameters.STAGES.PRE_SALE.HARDCAP.CALL).mul(1e18);

    stage.toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.ID);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });
  });

  it("The stage should be PRE_SALE", async function() {
    const stage = await this.crowdsale.stage();
    const amount = new BigNumber(parameters.STAGES.MAIN_SALE_1.HARDCAP.CALL).mul(1e18);

    stage.toNumber().should.be.equal(parameters.STAGES.PRE_SALE.ID);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });
  });

  it("The stage should be MAIN_SALE_1", async function() {
    const stage = await this.crowdsale.stage();
    const amount = new BigNumber(parameters.STAGES.MAIN_SALE_2.HARDCAP.CALL).mul(1e18);

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_1.ID);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });
  });

  it("The stage should be MAIN_SALE_2", async function() {
    const stage = await this.crowdsale.stage();
    const amount = new BigNumber(parameters.STAGES.MAIN_SALE_3.HARDCAP.CALL).mul(1e18);

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_2.ID);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });
  });

  it("The stage should be MAIN_SALE_3", async function() {
    const stage = await this.crowdsale.stage();
    const amount = new BigNumber(parameters.STAGES.MAIN_SALE_4.HARDCAP.CALL).mul(1e18);

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_3.ID);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });
  });

  it("The stage should be MAIN_SALE_4", async function() {
    const stage = await this.crowdsale.stage();
    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_4.ID);
  });

  it("The stage MAIN_SALE_4 should not allow overflow", async function() {
    const amount = new BigNumber(parameters.STAGES.MAIN_SALE_4.HARDCAP.CALL).mul(1e18);

    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    }).should.be.rejectedWith('VM Exception while processing transaction: revert');
  });

  it("The stage MAIN_SALE_4 should be advanced manually", async function() {
    const stage1 = await this.crowdsale.stage();
    stage1.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_4.ID);

    await this.crowdsale.finalize({
      from: owner
    });

    const stage2 = await this.crowdsale.stage();
    stage2.toNumber().should.be.equal(parameters.STAGES.FINALIZED.ID);
  });
});
