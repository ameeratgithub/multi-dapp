// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

import "../interfaces/IERC165.sol";

contract ERC165 {
    function supportsInterface(bytes4 _interfaceId)
        public
        pure
        virtual
        returns (bool)
    {
        return _interfaceId == type(IERC165).interfaceId;
    }
}
