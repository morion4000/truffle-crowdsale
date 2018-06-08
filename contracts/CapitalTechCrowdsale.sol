/*
Capital Technologies & Research - Capital (CALL) & CapitalGAS (CALLG) - Crowdsale Smart Contract
https://www.mycapitalco.in
*/
pragma solidity ^0.4.18;
import './CALLGToken.sol';
import './CALLToken.sol';
import 'openzeppelin-solidity/contracts/crowdsale/distribution/utils/RefundVault.sol';
contract FiatContract {
    function USD(uint _id) public constant returns (uint256);
}
contract CapitalTechCrowdsale is Ownable{
  using SafeMath for uint256;
  ERC20 public token_call;
  ERC20 public token_callg;
  FiatContract public fiat_contract;
  RefundVault public vault;
  address public wallet;
  uint256 public maxContributionPerAddress;
  uint256 public startTime;
  uint256 public endTime;
  uint256 public weiRaised;
  uint256 public sale_period;
  uint256 public minInvestment;
  bool public sale_state = false;
  string public stage;
  mapping(address => uint256) public contributions;
  uint256 public callSoftCap;
  uint256 public callgSoftCap;
  uint256 public callHardCap;
  uint256 public callgHardCap;
  uint256 public callDistributed;
  uint256 public callgDistributed;
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount_call, uint256 amount_callg);
  event Finalized();
  constructor(address _wallet, address _fiatcontract, ERC20 _token_call, ERC20 _token_callg) public {
    require(_token_call != address(0));
    require(_token_callg != address(0));
    require(_wallet != address(0));
    require(_fiatcontract != address(0));
    token_call = _token_call;
    token_callg = _token_callg;
    wallet = _wallet;
    fiat_contract = FiatContract(_fiatcontract);
    vault = new RefundVault(_wallet);
  }
  function getUserContribution(address _beneficiary) public view returns (uint256) {
    return contributions[_beneficiary];
  }
  function calculateRate(uint256 _amount) public view returns(uint256) {
    uint256 tokenPrice = fiat_contract.USD(0);
    if(startTime.add(15 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(50).div(10 ** 8);
    } else if(startTime.add(45 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(70).div(10 ** 8);
    } else if(startTime.add(52 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(80).div(10 ** 8);
    } else if(startTime.add(59 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(90).div(10 ** 8);
    } else if(startTime.add(66 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(100).div(10 ** 8);
    } else {
        tokenPrice = tokenPrice.mul(35).div(10 ** 8);
    }
    return _amount.div(tokenPrice).mul(10 ** 10);
  }
  function () external payable {
    buyTokens(msg.sender);
  }
  function compareStages (string a, string b) internal pure returns (bool){
       return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
  }
  function buyTokens(address _beneficiary) public payable {
    uint256 weiAmount = msg.value;
    _preValidatePurchase(_beneficiary, weiAmount);
    uint256 call_tokens = _getTokenAmount(weiAmount);
    uint256 callg_tokens = call_tokens.mul(200);
    _postValidatePurchase(call_tokens, callg_tokens);
    weiRaised = weiRaised.add(weiAmount);
    callDistributed = callDistributed.add(call_tokens);
    callgDistributed = callDistributed.add(callg_tokens);
    _processPurchase(_beneficiary, call_tokens, callg_tokens);
    emit TokenPurchase(msg.sender, _beneficiary, weiAmount, call_tokens, callg_tokens);
    _updatePurchasingState(_beneficiary, weiAmount);
    _forwardFunds();
  }
  function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
    uint256 tokenPrice = fiat_contract.USD(0);
    if(startTime.add(15 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(50).div(10 ** 8);
    } else if(startTime.add(45 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(70).div(10 ** 8);
    } else if(startTime.add(52 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(80).div(10 ** 8);
    } else if(startTime.add(59 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(90).div(10 ** 8);
    } else if(startTime.add(66 days) >= block.timestamp) {
        tokenPrice = tokenPrice.mul(100).div(10 ** 8);
    } else {
        tokenPrice = tokenPrice.mul(35).div(10 ** 8);
    }
    return _weiAmount.div(tokenPrice).mul(10 ** 10);
  }
  function hasEnded() public view returns (bool) {
    require(sale_state);
    return block.timestamp > endTime;
  }
  function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
    require(!hasEnded());
    require(_beneficiary != address(0));
    require(_weiAmount >= minInvestment);
    require(contributions[_beneficiary].add(_weiAmount) <= maxContributionPerAddress);
  }
  function _postValidatePurchase(uint256 _call, uint256 _callg) internal {
    require(callDistributed.add(_call) <= callHardCap);
    require(callgDistributed.add(_callg) <= callgHardCap);
  }
  function _processPurchase(address _beneficiary, uint256 _callAmount, uint256 _callgAmount) internal {
    _deliverTokens(_beneficiary, _callAmount, _callgAmount);
  }
  function _deliverTokens(address _beneficiary, uint256 _callAmount, uint256 _callgAmount) internal {
    require(MintableToken(token_call).mint(_beneficiary, _callAmount));
    require(MintableToken(token_callg).mint(_beneficiary, _callgAmount));
  }
  function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
    contributions[_beneficiary] = contributions[_beneficiary].add(_weiAmount);
  }
  function _forwardFunds() internal {
    vault.deposit.value(msg.value)(msg.sender);
  }
  function finalize() onlyOwner public {
    emit Finalized();
    stage = "ended";
    sale_state = false;
    finalization();
  }
  function powerUpContract() public onlyOwner{
    require(!sale_state);
    startTime = block.timestamp;
    sale_period = 75 days;
    endTime = block.timestamp.add(sale_period);
    sale_state = true;
    stage = "private";
    callDistributed = 0;
    callgDistributed = 0;
    weiRaised = 0;
    callSoftCap = 10710000000000000000000000;
    callgSoftCap = 2142000000000000000000000000;
    callHardCap = 52500000000000000000000000;
    callgHardCap = 10500000000000000000000000000;
    maxContributionPerAddress = 1500 ether;
    minInvestment = 0.01 ether;
  }
  function extendCrowdsale(uint date) public onlyOwner {
    endTime = endTime.add(date);
  }
  function transferTokens(address _to, uint256 _amount) public onlyOwner {
    require(_to != address(0));
    require(_amount > 0);
    require(callDistributed.add(_amount) <= callHardCap);
    require(callgDistributed.add(_amount.mul(200)) <= callgHardCap);
    require(MintableToken(token_call).mint(_to, _amount));
    require(MintableToken(token_callg).mint(_to, _amount.mul(200)));
  }
  function claimRefund() public {
    require(!sale_state);
    require(!goalReached());
    vault.refund(msg.sender);
  }
  function goalReached() public returns (bool) {
    require(callDistributed >= callSoftCap);
    require(callgDistributed >= callgSoftCap);
  }
  function hardcapReached() public returns (bool) {
    require(callDistributed >= callHardCap);
    require(callgDistributed >= callgHardCap);
  }
  function finalization() internal {
    if (goalReached()) {
      vault.close();
    } else {
      vault.enableRefunds();
    }
  }
}
