# Capital Technologies & Research's Crowdsale Smart Contracts
### Development Branch
[![Build Status](https://travis-ci.org/capital-technologies/truffle-crowdsale.svg?branch=master)](https://travis-ci.org/capital-technologies/truffle-crowdsale) [![solidity](https://img.shields.io/badge/code%20style-solidity-brightgreen.svg?style=flat-square)](https://github.com/ethereum/solidity) [![EIP20](https://img.shields.io/badge/TOKEN-ERC20-brightgreen.svg?style=flat-square)](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Capital (CALL)** and **Capital GAS (CALLG)** are **ERC-20** compliant cryptocurrencies built on the top of the **[Ethereum][ethereum] blockchain**.

#### [Ethereum's Main Network Details](https://github.com/capital-technologies/truffle-crowdsale/tree/mainnet)
*	**Crowdsale** Contract Address: **0x6992742729d11386f0efbf5fa5d195aa180b21b0**

*	**Capital (CALL)** Token Details
	*	**Token Address**: **0x0c5d6e276f1b6d51e802343c0eb60ec876964f10**
	*	**Token Name**: CAPITAL
	*	**Token Symbol**: CALL
	*	**Token Decimals**: 18

*	**Capital GAS (CALLG)** Token Details
	*	**Token Address**: **0x1cb3d8997bc39667e9cbb2aa70203f94ecda1422**
	*	**Token Name**: CAPITAL
	*	**Token Symbol**: CALL
	*	**Token Decimals**: 18

## Contracts
Contracts are available in [contracts/](contracts) directory
*	[CapitalTechCrowdsale.sol](contracts/CapitalTechCrowdsale.sol) - Crowdsale Smart Contract
	*	[BountyVault.sol](contracts/BountyVault.sol) - Bounty Vault
	*	[TeamVault.sol](contracts/TeamVault.sol) - Bounty Vault
		*	[CALLToken.sol](contracts/CALLToken.sol) - CAPITAL (CALL) Token
		*	[CALLGToken.sol](contracts/CALLGToken.sol) - CAPITAL GAS (CALLG) Token

## The Crowdsale Specifications
*	**Capital (CALL)** and **Capital GAS (CALLG)** are **ERC-20** compliant
*	**Capital (CALL)** and **Capital GAS (CALLG)** are **[Bancor][bancor]** compliant.
*	Crowdsale sale ratio: **1 CAPITAL (CALL) = 200 CAPITAL GAS (CALLG)**
*	**Token allocation**:
	*	**85%** of the total number of **Capital (CALL)** and **Capital GAS (CALLG)** tokens will be allocated to contributors during the token sale.
		*	**5%** of the token sale supply of **Capital (CALL)** and **Capital GAS (CALLG)** tokens will be allocated to the referral program.	
	*	**10%** of the total number of **Capital (CALL)** and **Capital GAS (CALLG)** tokens will be allocated to the team.
	*	**5%** of the total number of **Capital (CALL)** and **Capital GAS (CALLG)** tokens will be allocated to the bounty campaign.

## Pricing program
Crowdsale rates are calculated through [Fiat Contract](https://fiatcontract.com/) available at contract address: **0x8055d0504666e2B6942BeB8D6014c964658Ca591**

Prices are different for each stage as following:
*	Private Sale: **$0.35**
*	Pre Sale: **$0.5**
*	Main Sale
	*	First Week: **$0.70**
	*	Second Week: **$0.80**
	*	Third Week: **$0.90**
	*	Last Week: **$1.00**

## Develop
* Contracts are written in [Solidity][solidity] and tested using [Truffle][truffle]
* Our smart contracts are based on [Open Zeppelin][openzepplein-solidity] smart contracts [v1.10.0][openzepplein-solidity_v.1.10.0] (commit feb665136c0dae9912e08397c1a21c4af3651ef3)

## Audit
*	The contracts were audited by several blockchain experts.
*	**No potential vulnerabilities** have been identified in the crowdsale and tokens contracts.
If you are a blockchain expert, you can check the [test/](test) directory where you can find all tests that have been made on the contracts.

#### Setup for the test enviroment
###### Dependencies
*	Node.JS (>= 8.0)
*	NPM (>= 4.1.13)

###### Testing process
Installing the testing dependencies (libraries) can be realised through ```npm install``` command from the terminal.

After you install all npm dependencies you need to setup an isolated Ethereum blockchain. You can do this with the help of Ganache (former testrpc) through: 

```
ganache-cli -p 7545 -i 5777 -e 200000 > /dev/null &
```
After the enviroment is prepared you can run individual tests or you can run all of them through:```truffle test``` command.

###### Alternatively you can check [Travis-CI](https://travis-ci.org/capital-technologies/truffle-crowdsale/) build output to see the test results

## CapitalTechCrowdsale Contract Functions
**getUserContribution**
```js
function getUserContribution(address _beneficiary) public view returns (uint256)
```
Returns contribution's in wei (Ether) of an individual user that has used **buyTokens** function.

**getUserHistory**
```js
function getUserHistory(address _beneficiary) public view returns (uint256)
```
Returns user's **Capital (CALL)** purchase history in wei (non Ether) of an individual user.

**getReferrals**
```js
function getReferrals(address[] _beneficiaries) public view returns (address[], uint256[])
```
Returns array of users's **Capital (CALL)** purchase history in wei (non Ether).

**getAmountForCurrentStage**
```js
function getAmountForCurrentStage(uint256 _amount) public view returns(uint256)
```
Returns fiat rate (USD) of wei (Ether) for current stage.

**getAmountForCurrentStage**
```js
function getHardCap() public view returns (uint256, uint256)
```
Returns array of HardCaps (CALL and CALLG) in wei (non-Ether) for current stage.

**goalReached**
```js
function goalReached() public view returns (bool)
```
Returns boolean for SoftCap achievement.

**claimRefund**
```js
function claimRefund() public
```
Executes user's refund process only if the SoftCap is not reached.

**buyTokens**
```js
function buyTokens(address _beneficiary) public payable
```
Executes buy function 

## Collaborators

* **[Ionuț Moraru](https://github.com/morion4000/)**

[capital-tech]: https://www.mycapitalco.in/
[ethereum]: https://www.ethereum.org/
[solidity]: https://solidity.readthedocs.io/en/develop/
[truffle]: http://truffleframework.com/
[bancor]: https://github.com/bancorprotocol/contracts
[openzepplein-solidity_v.1.10.0]: https://github.com/OpenZeppelin/openzeppelin-solidity/releases/tag/v1.10.0
[openzepplein-solidity]: https://github.com/OpenZeppelin/openzeppelin-solidity