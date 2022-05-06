// SPDX-License-Identifier: None
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tapp is ERC20, Ownable {
    uint256 public currentBalanceLimit = 4000 * 10**18;

    address private _monuments;
    address private _gameItems;
    address private _marketPlace;

    constructor() ERC20("TAPP", "TAP") {}

    function setMonuments(address monuments_) external onlyOwner {
        _monuments = monuments_;
    }

    function setGameItems(address gameItems_) external onlyOwner {
        _gameItems = gameItems_;
    }

    function setMarketPlace(address marketPlace_) external onlyOwner {
        _marketPlace = marketPlace_;
    }

    function mint(uint256 _amount) external {
        require(
            balanceOf(msg.sender) + _amount <= currentBalanceLimit,
            "Tapp::balanceOf:Limit reached"
        );

        _mint(msg.sender, _amount);

        if (_monuments != address(0)) _approve(msg.sender, _monuments, _amount);
        if (_gameItems != address(0)) _approve(msg.sender, _gameItems, _amount);
        if (_marketPlace != address(0))
            _approve(msg.sender, _marketPlace, _amount);
    }
}
