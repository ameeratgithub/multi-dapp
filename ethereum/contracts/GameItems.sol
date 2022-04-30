// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./standards/ERC1155.sol";
import "./interfaces/IERC1155MetadataURI.sol";
import "./interfaces/IERC1155.sol";

contract GameItems is ERC1155, IERC1155MetadataURI, IERC1155TokenReceiver {
    struct GameItem {
        string name;
        string uri;
        uint256 price;
        uint32 allowedAmount;
        uint32 mintedAmount;
    }

    using Strings for uint256;

    string public name;
    string public symbol;

    uint256 public tokenCount;

    mapping(uint256 => GameItem) private _gameItems;

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
                ? string(
                    abi.encodePacked(_baseURI, _tokenId.toString(), ".json")
                )
                : "";
    }

    function getItem(uint _tokenId) external view returns(GameItem memory){
        return _gameItems[_tokenId];
    }

    function initialize(uint32 _allowedAmount, uint256 _price)
        external
        onlyOwner
    {
        tokenCount++;
        setAllowedAmount(tokenCount, _allowedAmount);
        setPrice(tokenCount, _price);
    }

    function initializeBatch(
        uint32[] calldata _allowedAmounts,
        uint256[] calldata _prices
    ) external onlyOwner {
        require(
            _allowedAmounts.length == _prices.length,
            "GameItems: Invalid arguments"
        );
        uint256[] memory _tokenIds = new uint256[](_allowedAmounts.length);
        for (uint256 i; i < _prices.length; i++) {
            _tokenIds[i] = ++tokenCount;
        }
        setBatchAllowedAmounts(_tokenIds, _allowedAmounts);
        setBatchPrices(_tokenIds, _prices);
    }

    function setAllowedAmount(uint256 _tokenId, uint32 _amount)
        public
        onlyOwner
    {
        require(_amount > 0, "GameItems: Invalid amount");
        _gameItems[_tokenId].allowedAmount = _amount;
    }

    function setBatchAllowedAmounts(
        uint256[] memory _tokenIds,
        uint32[] calldata _amounts
    ) public onlyOwner {
        require(
            _tokenIds.length == _amounts.length,
            "GameItems: invalid arguments"
        );

        for (uint256 i; i < _tokenIds.length; i++) {
            setAllowedAmount(_tokenIds[i], _amounts[i]);
        }
    }

    function getAllowedAmount(uint256 _tokenId)
        external
        view
        returns (uint256)
    {
        return _gameItems[_tokenId].allowedAmount;
    }

    function getBatchAllowedAmounts(uint256[] calldata _tokenIds)
        external
        view
        returns (uint32[] memory)
    {
        uint32[] memory allowedAmounts = new uint32[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            allowedAmounts[i] = _gameItems[_tokenIds[i]].allowedAmount;
        }

        return allowedAmounts;
    }

    function setPrice(uint256 _tokenId, uint256 _price) public onlyOwner {
        require(_price > 0, "GameItems: Invalid amount");
        _gameItems[_tokenId].price = _price;
    }

    function setBatchPrices(
        uint256[] memory _tokenIds,
        uint256[] calldata _prices
    ) public onlyOwner {
        require(
            _tokenIds.length == _prices.length,
            "GameItems: Invalid parameters"
        );

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(_prices[i] > 0, "GameItems: Invalid amount");
            _gameItems[_tokenIds[i]].price = _prices[i];
        }
    }

    function getPrice(uint256 _tokenId) external view returns (uint256) {
        return _gameItems[_tokenId].price;
    }

    function getBatchPrices(uint256[] calldata _tokenIds)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory prices = new uint256[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            prices[i] = _gameItems[_tokenIds[i]].price;
        }

        return prices;
    }

    function mint(uint32 _amount, uint256 _tokenId) external {
        GameItem storage item = _gameItems[_tokenId];
        
        uint256 price = item.price;
        require(item.price > 0, "GameItems: Invalid price");

        require(
            item.mintedAmount + _amount <= item.allowedAmount,
            "GameItems: Can't mint more than allowed "
        );

        price *= _amount;

        require(
            tapp.allowance(msg.sender, address(this)) >= price,
            "GameItems: Approve to spend your tokens"
        );

        tapp.transferFrom(msg.sender, address(this), price);

        _balances[_tokenId][msg.sender] += _amount;
        item.mintedAmount+=_amount;

        emit TransferSingle(
            msg.sender,
            address(0),
            msg.sender,
            _tokenId,
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
