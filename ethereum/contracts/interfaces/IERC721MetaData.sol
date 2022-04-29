// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

interface IERC721MetaData {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function tokenURI(uint256 _tokenId) external view returns (string memory);
}
