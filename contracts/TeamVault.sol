contract TeamVault is Ownable {
    using SafeMath for uint256;
    ERC20 public token_call;
    ERC20 public token_callg;
    event TeamWithdrawn();
    constructor (ERC20 _token_call, ERC20 _token_callg) public {
        require(_token_call != address(0));
        require(_token_callg != address(0));
        token_call = _token_call;
        token_callg = _token_callg;
    }
    function () public payable {
    }
    function withdrawTeam(address teamWallet) onlyOwner public {
        require(teamWallet != address(0));
        emit TeamWithdrawn();
        token_call.transfer(teamWallet, token_call.balanceOf(this));
        token_callg.transfer(teamWallet, token_callg.balanceOf(this));
    }
}
