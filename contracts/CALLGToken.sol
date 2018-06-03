/*
Capital Technologies & Research - Capital GAS (CALLG)
*/
pragma solidity ^0.4.21;
import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

/**
 * @title CAPITAL GAS (CALLG) Token
 * @dev Token representing CALLG.
 */
contract CALLGToken is MintableToken {
	string public name = "CAPITAL GAS";
	string public symbol = "CALLG";
	uint8 public decimals = 18;
}