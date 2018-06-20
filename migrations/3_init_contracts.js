const CALLGToken = artifacts.require("./CALLGToken.sol");
const CALLToken = artifacts.require("./CALLToken.sol");
const CapitalTechCrowdsale = artifacts.require("./CapitalTechCrowdsale.sol");
module.exports = function(deployer, network, accounts) {
  CapitalTechCrowdsale.deployed().then(inst => {
    inst.token_call()
      .then(addr => {
        CALLToken.at(addr).transferOwnership(inst.address);
      })
      .catch(console.error);

    inst.token_callg()
      .then(addr => {
        CALLGToken.at(addr).transferOwnership(inst.address);
      })
      .catch(console.error);
  });
};
