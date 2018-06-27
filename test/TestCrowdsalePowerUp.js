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

contract("TestCapitalTechCrowdsalePowerUp", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());
  });

  beforeEach(async function() {
    await advanceBlock();
  });

  it("The contracts should be deployed", async function() {
    this.crowdsale.should.exist;
    this.call_token.should.exist;
    this.callg_token.should.exist;
  });

  it("The crowdsale should be powered up", async function() {
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
    callDistributed.div(1e18).toNumber().should.be.equal(parameters.INITIAL_DISTRIBUTION.CALL);
    callgDistributed.div(1e18).toNumber().should.be.equal(parameters.INITIAL_DISTRIBUTION.CALLG);
    maxContributionPerAddress.div(1e18).toNumber().should.be.equal(parameters.CONTRIBUTION_PER_ADDRESS.MAX);
    minInvestment.div(1e18).toNumber().should.be.equal(parameters.CONTRIBUTION_PER_ADDRESS.MIN);
    walletCrowdsale.should.be.equal(owner);
    weiRaised.toNumber().should.be.equal(0);
    callSoftCap.div(1e18).toNumber().should.be.equal(parameters.SOFT_CAP.CALL);
    callgSoftCap.div(1e18).toNumber().should.be.equal(parameters.SOFT_CAP.CALLG);
  });

  it("Should resist multiple powerups", async function() {
    await this.crowdsale.powerUpContract().should.be.rejectedWith('VM Exception while processing transaction: revert');
  });
});
