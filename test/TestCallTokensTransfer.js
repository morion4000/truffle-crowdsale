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

contract("TestCallTokensTransfer", function([owner, wallet, investor, otherInvestor, otherInvestor2]) {
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

  it("The investor should be able to transfer tokens before the end of the crowdsale", async function() {
    const amount = new BigNumber(1000).mul(1e18);

    // Transfer 10000 CALL to investor
    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    // The investor transfers 10000 CALL to otherInvestor
    await this.call_token.transfer(otherInvestor, amount, {
      from: investor
    });

    const call_investor = await this.call_token.balanceOf.call(investor);
    const call_otherInvestor = await this.call_token.balanceOf.call(otherInvestor);

    call_investor.div(1e18).toNumber().should.be.equal(0);
    call_otherInvestor.div(1e18).toNumber().should.be.equal(1000);
  });

  it("The investor should be able to transfer tokens after the end of the crowdsale", async function() {
    const amount = new BigNumber(18049501).mul(1e18);

    // Transfer 18049501 CALL to investor
    await this.crowdsale.transferTokens(investor, amount, {
      from: owner
    });

    await this.crowdsale.finalize({
      from: owner
    });

    // The investor transfers 18049501 CALL to otherInvestor
    await this.call_token.transfer(otherInvestor, amount, {
      from: investor
    });

    const call_investor = await this.call_token.balanceOf.call(investor);
    const call_otherInvestor = await this.call_token.balanceOf.call(otherInvestor);

    call_investor.div(1e18).toNumber().should.be.equal(0);
    call_otherInvestor.div(1e18).toNumber().should.be.equal(18050501);
  });
});
