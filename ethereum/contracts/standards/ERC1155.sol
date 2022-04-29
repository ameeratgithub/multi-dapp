// SPDX-License-Identifier: None

pragma solidity ^0.8.9;
import "../interfaces/IERC1155.sol";
import "../interfaces/IERC1155MetadataURI.sol";
import "./ERC165.sol";

contract ERC1155 is IERC1155, ERC165 {
    // TokenID -> Account -> TokensOwned
    mapping(uint256 => mapping(address => uint256)) internal _balances;

    // Owner -> Operator -> Approved
    mapping(address => mapping(address => bool)) internal _approvalsForAll;

    function balanceOf(address _owner, uint256 _id)
        external
        view
        returns (uint256)
    {
        require(_owner != address(0), "ERC1155: Invalid address");
        return _balances[_id][_owner];
    }

    function balanceOfBatch(address[] calldata _owners, uint256[] calldata _ids)
        external
        view
        returns (uint256[] memory)
    {
        require(_owners.length == _ids.length, "ERC1155: Invalid inputs");
        uint256[] memory balances = new uint256[](_owners.length);
        for (uint256 i; i < _owners.length; i++) {
            balances[i] = this.balanceOf(_owners[i], _ids[i]);
        }
        return balances;
    }

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool)
    {
        return _approvalsForAll[_owner][_operator];
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        require(_operator != address(0), "ERC1155: invalid operator");

        _approvalsForAll[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external {
        require(
            _from == msg.sender || this.isApprovedForAll(_from, msg.sender),
            "ERC1155: Neither owner, nor operator"
        );
        require(_to != address(0), "ERC1155:Invalid receipient");

        _transferFrom(_from, _to, _id, _value);
        emit TransferSingle(msg.sender, _from, _to, _id, _value);

        _doSafeTransferAcceptanceCheck(
            msg.sender,
            _from,
            _to,
            _id,
            _value,
            _data
        );
    }

    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external {
        require(
            _from == msg.sender || this.isApprovedForAll(_from, msg.sender),
            "ERC1155: Neither owner, nor operator"
        );
        require(_to != address(0), "ERC1155:Invalid receipient");
        require(_ids.length == _values.length, "ERC1155: Invalid inputs");

        for (uint256 i; i < _ids.length; i++) {
            _transferFrom(_from, _to, _ids[i], _values[i]);
        }

        emit TransferBatch(msg.sender, _from, _to, _ids, _values);

        _doSafeBatchTransferAcceptanceCheck(
            msg.sender,
            _from,
            _to,
            _ids,
            _values,
            _data
        );
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        pure
        virtual
        override
        returns (bool)
    {
        return
            _interfaceId == type(IERC1155).interfaceId || super.supportsInterface(_interfaceId);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value
    ) private {
        uint256 balanceFrom = _balances[_id][_from];
        require(balanceFrom >= _value, "ERC1155: Insufficient balance");

        _balances[_id][_from] -= _value;
        _balances[_id][_to] += _value;
    }

    function _doSafeTransferAcceptanceCheck(
        address _operator,
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) private {
        if (_to.code.length > 0) {
            try
                IERC1155TokenReceiver(_to).onERC1155Received(
                    _operator,
                    _from,
                    _id,
                    _value,
                    _data
                )
            returns (bytes4 response) {
                if (
                    response != IERC1155TokenReceiver.onERC1155Received.selector
                ) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _doSafeBatchTransferAcceptanceCheck(
        address _operator,
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) private {
        if (_to.code.length > 0) {
            try
                IERC1155TokenReceiver(_to).onERC1155BatchReceived(
                    _operator,
                    _from,
                    _ids,
                    _values,
                    _data
                )
            returns (bytes4 res) {
                if (
                    res != IERC1155TokenReceiver.onERC1155BatchReceived.selector
                ) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }
}
