// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

interface IERC165 {
    function supportsInterface(bytes4 _interfaceId)
        external
        pure
        returns (bool);
}
