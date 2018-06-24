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

contract("TestCapitalTechCrowdsaleReferral", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();

    this.crowdsale.powerUpContract();
  });

  beforeEach(async function() {
    await advanceBlock();
  });

  it("Should get referrals", async function() {
    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(1).mul(1e18)
    });

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(1).mul(1e18)
    });

    await this.crowdsale.buyTokens(otherInvestor, {
      from: otherInvestor,
      value: new BigNumber(2).mul(1e18)
    });

    const referrals = await this.crowdsale.getReferrals([investor, otherInvestor, wallet]);
    const addresses = referrals[0];
    const histories = referrals[1];

    addresses[0].should.be.equal(investor);
    addresses[1].should.be.equal(otherInvestor);
    addresses[2].should.be.equal(wallet);
    histories[0].div(1e18).toNumber().should.be.equal(3396.58914518);
    histories[1].div(1e18).toNumber().should.be.equal(3396.58914518);
    histories[2].div(1e18).toNumber().should.be.equal(0);
  });
});
