/*
Capital Technologies & Research - Capital (CALL)
*/
pragma solidity 0.4.24;

import 'openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

/**
 * @title CAPITAL (CALL) Token
 * @dev Token representing CALL.
 */
contract CALLToken is MintableToken {
	string public name = "CAPITAL";
	string public symbol = "CALL";
	uint8 public decimals = 18;
}
