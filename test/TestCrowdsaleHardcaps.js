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
const parameters = require('local_parameters.json');

contract("TestCrowdsaleHardcaps", function([owner, wallet, investor, otherInvestor]) {
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

  it("The hardcap should be right for PRIVATE_SALE", async function() {
    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(10842563);
    hardcap[1].div(1e18).toNumber().should.be.equal(2168512500);
  });

  it("The hardcap should be right for PRE_SALE", async function() {
    increaseTime(parameters.STAGES_TIME.PRIVATE_SALE * 3600 * 24);

    await this.crowdsale.updateStage();

    const hardcap = await this.crowdsale.getHardCap();

    hardcap[0].div(1e18).toNumber().should.be.equal(18049500);
    hardcap[1].div(1e18).toNumber().should.be.equal(3609900000);
  });
});
