// SPDX-License-Identifier: None

pragma solidity ^0.8.9;
import "./standards/ERC1155.sol";
import "./interfaces/IERC1155MetadataURI.sol";
import "./interfaces/IERC1155.sol";

contract GameItems is ERC1155, IERC1155MetadataURI, IERC1155TokenReceiver {
    string public name;
    string public symbol;

    uint256 public tokenCount;

    mapping(uint256 => string) private _tokenURIs;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function uri(uint256 _tokenId) external view returns (string memory) {
        return _tokenURIs[_tokenId];
    }

    function mint(uint256 _amount, string calldata _uri) external {
        tokenCount++;
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
