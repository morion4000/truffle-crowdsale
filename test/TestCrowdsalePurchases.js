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

contract("TestCrowdsalePurchases", function([owner, wallet, investor, otherInvestor]) {
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

  it("The investor should be able to buy tokens in PRIVATE_SALE", async function() {
    let amount = new BigNumber(1).mul(1e18);
    let purchase = await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: amount
    });

    const callDistributed = await this.crowdsale.callDistributed();
    const callgDistributed = await this.crowdsale.callgDistributed();
    const weiRaised = await this.crowdsale.weiRaised();
    const userContribution = await this.crowdsale.getUserContribution(investor);
    const userHistory = await this.crowdsale.getUserHistory(investor);
    const refundVault = await this.crowdsale.vault();
    const refundVaultBalance = web3.eth.getBalance(refundVault);
    const stageAmount = parameters.STAGES.PRIVATE_SALE.CALL_PER_ETHER;

    callDistributed.div(1e18).toNumber().should.be.equal(parameters.INITIAL_DISTRIBUTION.CALL + stageAmount);
    callgDistributed.div(1e18).toNumber().should.be.equal(parameters.INITIAL_DISTRIBUTION.CALLG + stageAmount * 200);
    weiRaised.div(1e18).toNumber().should.be.equal(1);
    userContribution.div(1e18).toNumber().should.be.equal(1);
    userHistory.div(1e18).toNumber().should.be.equal(stageAmount);
    refundVaultBalance.div(1e18).toNumber().should.be.equal(1);
  });
});
