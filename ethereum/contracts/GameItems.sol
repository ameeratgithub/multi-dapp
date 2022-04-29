// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./standards/ERC1155.sol";
import "./interfaces/IERC1155MetadataURI.sol";
import "./interfaces/IERC1155.sol";

contract GameItems is ERC1155, IERC1155MetadataURI, IERC1155TokenReceiver {
    string public name;
    string public symbol;

    uint256 public tokenCount;

    mapping(string => uint256) private _prices;

    mapping(uint256 => string) private _tokenURIs;

    IERC20 public tapp;

    constructor(
        string memory _name,
        string memory _symbol,
        address _tapp
    ) {
        name = _name;
        symbol = _symbol;
        tapp = IERC20(_tapp);
    }

    function uri(uint256 _tokenId) external view returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function setPrice(string calldata _uri, uint256 _amount) external {
        require(_amount > 0, "GameItems: Invalid amount");
        _prices[_uri] = _amount;
    }

    function setBatchPrices(
        string[] calldata _uris,
        uint256[] calldata _amounts
    ) external {
        require(
            _uris.length == _amounts.length,
            "GameItems: Invalid parameters"
        );

        for (uint256 i = 0; i < _uris.length; i++) {
            require(_amounts[i] > 0, "GameItems: Invalid amount");
            _prices[_uris[i]] = _amounts[i];
        }
    }

    function getPrice(string calldata _uri) external view returns (uint256) {
        return _prices[_uri];
    }

    function getBatchPrices(string[] calldata _uris)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory prices = new uint256[](_uris.length);

        for (uint256 i = 0; i < _uris.length; i++) {
            prices[i] = _prices[_uris[i]];
        }

        return prices;
    }

    function mint(uint256 _amount, string calldata _uri) external {
        tokenCount++;
        
        uint256 price = _prices[_uri];
        
        require(price > 0, "GameItems: Invalid price");

        require(
            tapp.allowance(msg.sender, address(this)) >= price,
            "GameItems: Approve to spend your tokens"
        );

        tapp.transferFrom(msg.sender, address(this), price);

        _balances[tokenCount][msg.sender] += _amount;
        _tokenURIs[tokenCount] = _uri;

        emit TransferSingle(
            msg.sender,
            address(0),
            msg.sender,
            tokenCount,
            _amount
        );
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        pure
        override
        returns (bool)
    {
        return
            _interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155TokenReceiver.onERC1155BatchReceived.selector;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC1155TokenReceiver.onERC1155Received.selector;
    }
}
