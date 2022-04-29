// SPDX-License-Identifier: NONE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./standards/ERC721.sol";
import "./interfaces/IERC721MetaData.sol";
import "./interfaces/IERC721Receiver.sol";

contract Monuments is ERC721, IERC721MetaData, IERC721Receiver {
    string public name;
    string public symbol;

    address public owner;

    uint256 public tokenCount;
    mapping(uint256 => string) private _tokenURIs;

    IERC20 public tapp;

    constructor(
        string memory _name,
        string memory _symbol,
        address _tapp
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        tapp = IERC20(_tapp);
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        require(
            _owners[_tokenId] != address(0),
            "Monuments: address doesn't exist"
        );
        return _tokenURIs[_tokenId];
    }

    // Need to approve tapp tokens first for this smart contract
    function mint(string calldata _tokenURI, uint256 _amount) public {
        tokenCount++;

        uint256 tokenPrice = tokenCount * 100;
        
        require(_amount >= tokenPrice, "Monuments: Please provide more tokens");
        require(
            tapp.allowance(msg.sender, address(this)) >= tokenPrice,
            "Monuments: Smart Contract not approved"
        );

        tapp.transferFrom(msg.sender, address(this), tokenPrice);

        _tokenURIs[tokenCount] = _tokenURI;
        _balances[msg.sender]++;
        _owners[tokenCount] = msg.sender;

        emit Transfer(address(0), msg.sender, tokenCount);
    }

    function internalTransferTo(address _to, uint256 _tokenId) external {
        require(msg.sender == owner, "Monuments: You're not the owner");
        require(_to != address(0), "Monuments: Invalid receipient");

        transferFrom(address(this), _to, _tokenId);
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        pure
        override
        returns (bool)
    {
        return
            _interfaceId == type(IERC721MetaData).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
