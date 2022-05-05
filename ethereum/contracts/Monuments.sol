// SPDX-License-Identifier: NONE
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./standards/ERC721.sol";
import "./interfaces/IERC721MetaData.sol";
import "./interfaces/IERC721Receiver.sol";

contract Monuments is ERC721, IERC721MetaData, IERC721Receiver {
    using Strings for uint256;

    string public name;
    string public symbol;

    address public owner;

    uint256 public tokenCount;
    
    // Stores token/asset name with extension by ID
    // mapping(uint256 => string) private _tokenNames;
    string private _baseURI;

    IERC20 public tapp;

    constructor(
        string memory _name,
        string memory _symbol,
        address _tapp,
        string memory baseURI_
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        tapp = IERC20(_tapp);
        _baseURI = baseURI_;
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        require(
            _owners[_tokenId] != address(0),
            "Monuments: address doesn't exist"
        );
        return
            bytes(_baseURI).length > 0
                ? string(abi.encodePacked(_baseURI, _tokenId.toString(),".json"))
                : "";
    }

    // Need to approve tapp tokens first for this smart contract
    function mint(uint256 _tokenPrice) public {
        tokenCount++;

        uint256 tokenPrice = tokenCount * 100 * 10**18;

        require(
            _tokenPrice >= tokenPrice,
            "Monuments: Please provide more tokens"
        );
        require(
            tapp.allowance(msg.sender, address(this)) >= tokenPrice,
            "Monuments: Smart Contract not approved"
        );

        // _tokenNames[tokenCount] = _name;
        tapp.transferFrom(msg.sender, address(this), tokenPrice);

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
