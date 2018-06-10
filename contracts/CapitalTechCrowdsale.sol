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
contract CapitalTechCrowdsale is Ownable {
  using SafeMath for uint256;
  ERC20 public token_call;
  ERC20 public token_callg;
  FiatContract public fiat_contract;
  RefundVault public vault;
  enum stages { PRIVATE_SALE, PRE_SALE, MAIN_SALE_1, MAIN_SALE_2, MAIN_SALE_3, MAIN_SALE_4 }
  address public wallet;
  uint256 public maxContributionPerAddress;
  uint256 public stageStartTime;
  uint256 public weiRaised;
  uint256 public minInvestment;
  stages public stage;
  bool public is_finalized;
  mapping(address => uint256) public contributions;
  mapping(uint => uint) public stages_duration;
  uint256 public callSoftCap;
  uint256 public callgSoftCap;
  uint256 public callDistributed;
  uint256 public callgDistributed;
  uint256 public constant decimals = 18;
  event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount_call, uint256 amount_callg);
  event TokenTransfer(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount_call, uint256 amount_callg);
  event StageChanged(stages stage, stages next_stage, uint stageStartTime);
  event GoalReached(uint callDistributed, uint callgDistributed);
  event Finalized();
  function () external payable {
    buyTokens(msg.sender);
  }
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
  function powerUpContract() public onlyOwner{
    require(!is_finalized);
    stageStartTime = block.timestamp;
    stage = stages.PRIVATE_SALE;
    callDistributed = 0;
    callgDistributed = 0;
    weiRaised = 0;
    callSoftCap = 10710000 * 10 ** decimals;
    callgSoftCap = 2142000000 * 10 ** decimals;
    maxContributionPerAddress = 1500 ether;
    minInvestment = 0.01 ether;
    is_finalized = false;
    stages_duration[uint(stages.PRIVATE_SALE)] = 7 days;
    stages_duration[uint(stages.PRE_SALE)] = 7 days;
    stages_duration[uint(stages.MAIN_SALE_1)] = 7 days;
    stages_duration[uint(stages.MAIN_SALE_2)] = 7 days;
    stages_duration[uint(stages.MAIN_SALE_3)] = 7 days;
    stages_duration[uint(stages.MAIN_SALE_4)] = 7 days;
  }
  function getUserContribution(address _beneficiary) public view returns (uint256) {
    return contributions[_beneficiary];
  }
  function getAmountForCurrentStage(uint256 _amount) public view returns(uint256) {
    uint256 tokenPrice = fiat_contract.USD(0);
    if(stage == stages.PRIVATE_SALE) {
      tokenPrice = tokenPrice.mul(35).div(10 ** 8);
    } else if(stage == stages.PRE_SALE) {
      tokenPrice = tokenPrice.mul(50).div(10 ** 8);
    } else if(stage == stages.MAIN_SALE_1) {
      tokenPrice = tokenPrice.mul(70).div(10 ** 8);
    } else if(stage == stages.MAIN_SALE_2) {
      tokenPrice = tokenPrice.mul(80).div(10 ** 8);
    } else if(stage == stages.MAIN_SALE_3) {
      tokenPrice = tokenPrice.mul(90).div(10 ** 8);
    } else if(stage == stages.MAIN_SALE_4) {
      tokenPrice = tokenPrice.mul(100).div(10 ** 8);
    }
    return _amount.div(tokenPrice).mul(10 ** 10);
  }
  function _getNextStage() internal view returns (stages) {
    stages next_stage;
    if (stage == stages.PRIVATE_SALE) {
      next_stage = stages.PRE_SALE;
    } else if (stage == stages.PRE_SALE) {
      next_stage = stages.MAIN_SALE_1;
    } else if (stage == stages.MAIN_SALE_1) {
      next_stage = stages.MAIN_SALE_2;
    } else if (stage == stages.MAIN_SALE_2) {
      next_stage = stages.MAIN_SALE_3;
    } else {
      next_stage = stages.MAIN_SALE_4;
    }
    return next_stage;
  }
  function getHardCap() public view returns (uint, uint) {
    uint hardcap_call;
    uint hardcap_callg;
    if (stage == stages.PRIVATE_SALE) {
      hardcap_call = 3123750;
      hardcap_callg = 62475000;
    } else if (stage == stages.PRE_SALE) {
      hardcap_call = 7586250;
      hardcap_callg = 1517250000;
    } else if (stage == stages.MAIN_SALE_1) {
      hardcap_call = 13566000;
      hardcap_callg = 2713200000;
    } else if (stage == stages.MAIN_SALE_2) {
      hardcap_call = 10714500;
      hardcap_callg = 2034900000;
    } else if (stage == stages.MAIN_SALE_3) {
      hardcap_call = 6783000;
      hardcap_callg = 1356600000;
    } else if (stage == stages.MAIN_SALE_4) {
      hardcap_call = 3391500;
      hardcap_callg = 678300000;
    }
    // TODO: Should there by a default hardcap?

    return (hardcap_call.mul(10 ** decimals), hardcap_callg.mul(10 ** decimals));
  }
  function updateStage() public {
    uint _duration = stages_duration[uint(stage)];
    (uint _hardcapCall, uint _hardcapCallg) = getHardCap();
    if(stageStartTime.add(_duration) >= block.timestamp || callDistributed >= _hardcapCall || callgDistributed >= _hardcapCallg) {
      stages next_stage = _getNextStage();
      if (next_stage != stages.MAIN_SALE_4) {
        emit StageChanged(stage, next_stage, stageStartTime);
        stage = next_stage;
        stageStartTime = block.timestamp;
      } else {
        finalization();
      }
    }
  }
  function buyTokens(address _beneficiary) public payable {
    updateStage();
    require(!is_finalized);
    if (_beneficiary == address(0)) {
      _beneficiary = msg.sender;
    }
    uint256 weiAmount = msg.value;
    require(weiAmount > 0);
    require(_beneficiary != address(0));
    require(weiAmount >= minInvestment);
    require(contributions[_beneficiary].add(weiAmount) <= maxContributionPerAddress);
    uint256 call_tokens = getAmountForCurrentStage(weiAmount);
    uint256 callg_tokens = call_tokens.mul(200);
    //require(callDistributed.add(call_tokens) <= callHardCap);
    //require(callgDistributed.add(callg_tokens) <= callgHardCap);
    weiRaised = weiRaised.add(weiAmount);
    callDistributed = callDistributed.add(call_tokens);
    callgDistributed = callDistributed.add(callg_tokens);
    MintableToken(token_call).mint(_beneficiary, call_tokens);
    MintableToken(token_callg).mint(_beneficiary, callg_tokens);
    emit TokenPurchase(msg.sender, _beneficiary, weiAmount, call_tokens, callg_tokens);
    contributions[_beneficiary] = contributions[_beneficiary].add(weiAmount);
    vault.deposit.value(msg.value)(msg.sender);
  }
  function finalize() onlyOwner public {
    finalization();
  }
  // TODO: Allow extensions for any stage or just current?
  // TODO: Allow extensions or updates
  function extendPeriodForStage(uint date, stages _stage) public onlyOwner {
    stages_duration[uint(_stage)] = stages_duration[uint(_stage)].add(date);
  }
  /* TODO: refactor function */
  function transferTokens(address _to, uint256 _amount) public onlyOwner {
    updateStage();
    require(!is_finalized);
    require(_to != address(0));
    require(_amount > 0);
    // TODO: Can the owner create tokens even after the sale is over, or even over the hardcap is reached
    //require(callDistributed.add(_amount) <= callHardCap);
    //require(callgDistributed.add(_amount.mul(200)) <= callgHardCap);
    callDistributed = callDistributed.add(_amount);
    callgDistributed = callgDistributed.add(_amount.mul(200));
    MintableToken(token_call).mint(_to, _amount);
    MintableToken(token_callg).mint(_to, _amount.mul(200));
    emit TokenTransfer(msg.sender, _to, _amount, _amount, _amount.mul(200));
  }
  function claimRefund() public {
    require(is_finalized);
    require(!goalReached());
    vault.refund(msg.sender);
  }
  function goalReached() public returns (bool) {
    require(callDistributed >= callSoftCap);
    require(callgDistributed >= callgSoftCap);
    emit GoalReached(callDistributed, callgDistributed);
  }
  function finalization() internal {
    require(!is_finalized);
    is_finalized = true;
    emit Finalized();
    if (goalReached()) {
      vault.close();
    } else {
      vault.enableRefunds();
    }
  }
}
