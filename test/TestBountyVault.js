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
const CALLGToken = artifacts.require("./CALLGToken.sol");
const CALLToken = artifacts.require("./CALLToken.sol");
const BountyVault = artifacts.require("./BountyVault.sol");
const CapitalTechCrowdsale = artifacts.require("./CapitalTechCrowdsale.sol");
const parameters = require('./local_parameters.json');

contract("TestBountyVault", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.bounty = await BountyVault.deployed();
    //this.bounty = BountyVault.at(await this.crowdsale.bountyVault());
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());
  });

  beforeEach(async function() {
    await advanceBlock();
  });

  it("The contracts should be deployed", async function() {
    this.bounty.should.exist;
  });

  it("The crowdsale should distribute bounty", async function() {
    await this.crowdsale.distributeBounty({from: owner});

    const address = await this.crowdsale.bountyVault();
    const balance_call = await this.call_token.balanceOf.call(address);
    const balance_callg = await this.callg_token.balanceOf.call(address);

    balance_call.div(1e18).toNumber().should.be.equal(2625000);
    balance_callg.div(1e18).toNumber().should.be.equal(525000000);
  });

  it("The contract should allow funds to be withdrawn", async function() {
    const call = await this.bounty.withdrawBounty(investor, {
      from: owner
    });

    //const address = await this.crowdsale.bountyVault();
    //const balance = await this.call_token.balanceOf.call(investor);
    //balance.div(1e18).toNumber().should.be.equal(2625000);
  });
});
