// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Tapp is ERC20 {
    uint256 private currentBalanceLimit = 2000 * 10**18;

    constructor() ERC20("TAPP", "TAP") {}

    function mint(uint256 _amount) external {
        require(
            balanceOf(msg.sender) + _amount <= currentBalanceLimit,
            "Tapp::balanceOf:Limit reached"
        );
        _mint(msg.sender, _amount);
    }
}
