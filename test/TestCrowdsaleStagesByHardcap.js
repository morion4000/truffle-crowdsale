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

contract("TestCrowdsaleStagesByHardcap", function([owner, wallet, investor, otherInvestor]) {
  before(async function() {
    await advanceBlock();

    this.crowdsale = await CapitalTechCrowdsale.deployed();
    this.call_token = CALLToken.at(await this.crowdsale.token_call());
    this.callg_token = CALLGToken.at(await this.crowdsale.token_callg());

    this.crowdsale.powerUpContract();
  });

  beforeEach(async function() {
    await this.crowdsale.updateStage()

    await advanceBlock();
  });

  it("The stage should be PRIVATE_SALE", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.PRIVATE_SALE.HARDCAP.ETHER + 1;
    /*
    const amount = parseInt(parameters.STAGES.PRIVATE_SALE.HARDCAP.CALL / parameters.STAGES.PRIVATE_SALE.CALL_PER_ETHER) - 200;
    const callDistributed = await this.crowdsale.callDistributed();
    const callgDistributed = await this.crowdsale.callgDistributed();
    const hardcap = await this.crowdsale.getHardCap();
    */

    stage.toNumber().should.be.equal(parameters.STAGES.PRIVATE_SALE.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });

    /*
    console.log('hardcap', hardcap[0]);
    console.log('distributed', callDistributed);

    console.log('hardcap g', hardcap[1]);
    console.log('distributed g', callgDistributed);

    console.log('--------');

    const _callDistributed = await this.crowdsale.callDistributed();
    const _callgDistributed = await this.crowdsale.callgDistributed();
    const _hardcap = await this.crowdsale.getHardCap();

    console.log('hardcap', _hardcap[0]);
    console.log('distributed', _callDistributed);

    console.log('hardcap g', _hardcap[1]);
    console.log('distributed g', _callgDistributed);
    */
    /*
    for (var i=0; i<20; i++) {
      await this.crowdsale.buyTokens(investor, {
        from: investor,
        value: new BigNumber(100).mul(1e18)
      }).catch((function(i) {
        return function(err) {
          console.log('Transaction no', i);
          console.error(err);
        };
      })(i));

      await advanceBlock();
    }
    */
  });

  it("The stage should be PRE_SALE", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.PRE_SALE.HARDCAP.ETHER + 1;

    stage.toNumber().should.be.equal(parameters.STAGES.PRE_SALE.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });
  });

  it("The stage should be MAIN_SALE_1", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.MAIN_SALE_1.HARDCAP.ETHER + 1;

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_1.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });
  });

  it("The stage should be MAIN_SALE_2", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.MAIN_SALE_2.HARDCAP.ETHER + 1;

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_2.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });
  });

  it("The stage should be MAIN_SALE_3", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.MAIN_SALE_3.HARDCAP.ETHER + 1;

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_3.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });
  });

  it("The stage should be MAIN_SALE_4", async function() {
    const stage = await this.crowdsale.stage();
    const amount = parameters.STAGES.MAIN_SALE_4.HARDCAP.ETHER + 1;

    stage.toNumber().should.be.equal(parameters.STAGES.MAIN_SALE_4.ID);

    await this.crowdsale.buyTokens(investor, {
      from: investor,
      value: new BigNumber(amount).mul(1e18)
    });
  });

  it("The stage should be FINALIZED", async function() {
    const stage = await this.crowdsale.stage();

    stage.toNumber().should.be.equal(parameters.STAGES.FINALIZED.ID);
  });
});
