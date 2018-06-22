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

contract("TestCrowdsaleExtendPeriod", function([owner, wallet, investor, otherInvestor]) {
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

  it("The stage PRIVATE_SALE should be extended by 30 days", async function() {
    const stage = await this.crowdsale.stage();
    const extension = 30 * 3600 * 24; // 30 days

    stage.toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.ID);

    await this.crowdsale.extendPeriod(extension, {
      from: owner
    });

    increaseTime(parameters.STAGES.PRIVATE_SALE.DURATION * 3600 * 24);
    increaseTime(29 * 3600 * 24);
  });

  it("The stage should remain PRIVATE_SALE", async function() {
    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.ID);

    increaseTime(1 * 3600 * 24);
  });

  it("The stage should advance to PRE_SALE", async function() {
    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(parameters.STAGES.PRE_SALE.ID);
  });
});
