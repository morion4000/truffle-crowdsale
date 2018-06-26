const FiatContract = artifacts.require("./FiatContract.sol");
const CALLGToken = artifacts.require("./CALLGToken.sol");
const CALLToken = artifacts.require("./CALLToken.sol");
const CapitalTechCrowdsale = artifacts.require("./CapitalTechCrowdsale.sol");
module.exports = function(deployer, network, accounts) {
  const wallet = accounts[1];
  return deployer
    .then(() => {
      return deployer.deploy(FiatContract);
    })
    .then(() => {
      return deployer.deploy(CALLGToken);
    })
    .then(() => {
      return deployer.deploy(CALLToken);
    })
    .then(() => {
      return deployer.deploy(CapitalTechCrowdsale, wallet, FiatContract.address, CALLToken.address, CALLGToken.address);
    })
    .catch(console.error);
};
