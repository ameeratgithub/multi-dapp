// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "./IERC1155.sol";

interface IERC1155MetadataURI is IERC1155 {
    function uri(uint256 id) external view returns (string memory);
}
