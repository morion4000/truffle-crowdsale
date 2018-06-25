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

contract("TestCrowdsaleLimitPurchase", function([owner, wallet, investor, otherInvestor]) {
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

  it("The investor should get next stage price if over hardcap", async function() {
    const amount = parameters.STAGES.PRIVATE_SALE.HARDCAP.ETHER;

    // Buy at the hardcap
    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });

    const stage1 = await this.crowdsale.stage();
    stage1.toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.ID);

    // Buy over the hardcap, advance stage and get prices for the new stage
    await this.crowdsale.buyTokens(otherInvestor, {
      from: otherInvestor,
      value: new BigNumber(1).mul(1e18)
    });

    const stage2 = await this.crowdsale.stage();
    stage2.toNumber().should.be.equal(parameters.STAGES.PRE_SALE.ID);

    const balance_call = await this.call_token.balanceOf.call(otherInvestor);
    const balance_callg = await this.callg_token.balanceOf.call(otherInvestor);

    balance_call.div(1e18).toNumber().should.be.equal(parameters.STAGES.PRE_SALE.CALL_PER_ETHER);
    balance_callg.div(1e18).toNumber().should.be.equal(parameters.STAGES.PRE_SALE.CALL_PER_ETHER * 200);
  });
});
