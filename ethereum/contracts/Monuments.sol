// SPDX-License-Identifier: NONE

import "./standards/ERC721.sol";
import "./interfaces/IERC721MetaData.sol";
pragma solidity ^0.8.9;

contract Monuments is ERC721, IERC721MetaData {
    string public name;
    string public symbol;

    uint256 public tokenCount;
    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {
        require(
            _owners[_tokenId] != address(0),
            "Monuments: address doesn't exist"
        );
        return _tokenURIs[_tokenId];
    }

    function mint(string calldata _tokenURI) public {
        tokenCount++;
        _tokenURIs[tokenCount] = _tokenURI;
        _balances[msg.sender]++;
        _owners[tokenCount] = msg.sender;

        emit Transfer(address(0), msg.sender, tokenCount);
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
}
