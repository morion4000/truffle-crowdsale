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

contract("TestCrowdsaleFinalizedRefund", function([owner, wallet, investor, otherInvestor]) {
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

  it("The stage should be FINALIZED", async function() {
    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(1000).mul(1e18)
    });

    increaseTime(parameters.STAGES.PRIVATE_SALE.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    increaseTime(parameters.STAGES.PRE_SALE.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    increaseTime(parameters.STAGES.MAIN_SALE_1.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    increaseTime(parameters.STAGES.MAIN_SALE_2.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    increaseTime(parameters.STAGES.MAIN_SALE_3.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    increaseTime(parameters.STAGES.MAIN_SALE_4.DURATION * 3600 * 24);
    await this.crowdsale.updateStage();

    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(parameters.STAGES.FINALIZED.ID);
  });

  it("The funds should be retained", async function() {
    const vault = await this.crowdsale.vault();
    const vaultBalance = web3.eth.getBalance(vault);

    vaultBalance.div(1e18).toNumber().should.be.equal(1000);
  });

  it("The funds should be sent back", async function() {
    const vault = await this.crowdsale.vault();
    const investorInitialBalance = 200000;

    await this.crowdsale.claimRefund({
      from: investor
    });

    const vaultBalance = web3.eth.getBalance(vault);
    const investorBalance = web3.eth.getBalance(investor);

    vaultBalance.div(1e18).toNumber().should.be.equal(0);
    investorBalance.div(1e18).toNumber().toFixed(0).should.be.equal(investorInitialBalance.toFixed(0));
  });
});
