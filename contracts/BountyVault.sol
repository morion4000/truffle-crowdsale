contract BountyVault is Ownable {
    using SafeMath for uint256;
    ERC20 public token_call;
    ERC20 public token_callg;
    event BountyWithdrawn();
    constructor (ERC20 _token_call, ERC20 _token_callg) public {
        require(_token_call != address(0));
        require(_token_callg != address(0));
        token_call = _token_call;
        token_callg = _token_callg;
    }
    function () public payable {
    }
    function withdrawBounty(address bountyWallet) onlyOwner public {
        require(bountyWallet != address(0));
        emit BountyWithdrawn();
        token_call.transfer(bountyWallet, token_call.balanceOf(this));
        token_callg.transfer(bountyWallet, token_callg.balanceOf(this));
    }
}
