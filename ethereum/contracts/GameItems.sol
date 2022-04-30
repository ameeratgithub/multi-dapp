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

    mapping(uint256 => string) private _tokenNames;
    mapping(string => uint256) private _allowedAmounts;

    string private _baseURI;

    IERC20 public tapp;

    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "GameItems: You're not the owner");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseURI_,
        address _tapp
    ) {
        name = _name;
        symbol = _symbol;
        tapp = IERC20(_tapp);
        _baseURI = baseURI_;
        owner = msg.sender;
    }

    function uri(uint256 _tokenId) external view returns (string memory) {
        return
            bytes(_baseURI).length > 0
                ? string(abi.encodePacked(_baseURI, _tokenNames[_tokenId]))
                : "";
    }

    function setAllowedAmount(string calldata _name, uint256 _amount)
        public
        onlyOwner
    {
        require(_amount > 0, "GameItems: Invalid amount");
        _allowedAmounts[_name] = _amount;
    }

    function setAllowedBatchAmounts(
        string[] calldata _names,
        uint256[] calldata _amounts
    ) public onlyOwner {
        require(
            _names.length == _amounts.length,
            "GameItems: invalid arguments"
        );

        for (uint256 i; i < _names.length; i++) {
            setAllowedAmount(_names[i], _amounts[i]);
        }
    }

    function getAllowedAmount(string calldata _name)
        external
        view
        returns (uint256)
    {
        return _allowedAmounts[_name];
    }

    function getBatchAllowedAmounts(string[] calldata _names)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory allowedAmounts = new uint256[](_names.length);

        for (uint256 i = 0; i < _names.length; i++) {
            allowedAmounts[i] = _allowedAmounts[_names[i]];
        }

        return allowedAmounts;
    }


    function setPrice(string calldata _name, uint256 _amount)
        external
        onlyOwner
    {
        require(_amount > 0, "GameItems: Invalid amount");
        _prices[_name] = _amount;
    }

    function setBatchPrices(
        string[] calldata _names,
        uint256[] calldata _amounts
    ) external onlyOwner {
        require(
            _names.length == _amounts.length,
            "GameItems: Invalid parameters"
        );

        for (uint256 i = 0; i < _names.length; i++) {
            require(_amounts[i] > 0, "GameItems: Invalid amount");
            _prices[_names[i]] = _amounts[i];
        }
    }

    function getPrice(string calldata _name) external view returns (uint256) {
        return _prices[_name];
    }

    function getBatchPrices(string[] calldata _names)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory prices = new uint256[](_names.length);

        for (uint256 i = 0; i < _names.length; i++) {
            prices[i] = _prices[_names[i]];
        }

        return prices;
    }

    function mint(uint256 _amount, string calldata _fullName) external {
        tokenCount++;

        uint256 price = _prices[_fullName];

        require(price > 0, "GameItems: Invalid price");

        price *= _amount;

        require(
            tapp.allowance(msg.sender, address(this)) >= price,
            "GameItems: Approve to spend your tokens"
        );

        tapp.transferFrom(msg.sender, address(this), price);

        _balances[tokenCount][msg.sender] += _amount;
        _tokenNames[tokenCount] = _fullName;

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
