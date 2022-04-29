// SPDX-License-Identifier: NONE
pragma solidity ^0.8.9;

import "../interfaces/IERC721Receiver.sol";
import "../interfaces/IERC721.sol";
import "./ERC165.sol";

contract ERC721 is IERC721, ERC165 {
    mapping(address => uint256) internal _balances;
    mapping(uint256 => address) internal _owners;
    mapping(address => mapping(address => bool)) private _approvalsForAll;

    mapping(uint256 => address) private _singleApproval;

    

    function balanceOf(address _owner) public view returns (uint256) {
        require(_owner != address(0), "Monuments::balanceOf:Invalid address");
        return _balances[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        address owner = _owners[_tokenId];
        require(owner != address(0), "Monuments::ownerOf:Token doesn't exist");
        return owner;
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        _approvalsForAll[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        return _approvalsForAll[_owner][_operator];
    }

    function approve(address _to, uint256 _tokenId) public {
        address owner = ownerOf(_tokenId);

        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721::approve:Neither owner, nor approved"
        );
        require(_to != address(0), "Monuments::approve:Invalid address");

        _singleApproval[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        require(
            _owners[_tokenId] != address(0),
            "ERC721::getApproved:Token doesn't exist"
        );
        return _singleApproval[_tokenId];
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        address owner = ownerOf(_tokenId);
        require(
            msg.sender == owner ||
                msg.sender == getApproved(_tokenId) ||
                isApprovedForAll(owner, msg.sender),
            "ERC721::transferFrom:You're not authorized"
        );
        require(_from == owner, "ERC721::transferFrom:Invalid source");
        require(_to != address(0), "ERC721::transferFrom:Invalid recipient");

        delete _singleApproval[_tokenId];

        _balances[_to] += 1;
        _balances[_from] -= 1;
        _owners[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata _data
    ) public {
        this.transferFrom(_from, _to, _tokenId);
        require(
            _checkOnERC721Received(_from, _to, _tokenId, _data),
            "Monuments: Receiver not implemented"
        );
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        this.safeTransferFrom(_from, _to, _tokenId, "");
    }

    function _checkOnERC721Received(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata _data
    ) private returns (bool) {
        if (_to.code.length > 0) {
            try
                IERC721Receiver(_to).onERC721Received(
                    msg.sender,
                    _from,
                    _tokenId,
                    _data
                )
            returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0)
                    revert(
                        "Monuments: transfer to non ERC721Receiver implementer"
                    );
                else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        }
        return true;
    }

    function supportsInterface(bytes4 _interfaceId)
        public
        pure
        virtual
        override
        returns (bool)
    {
        return
            _interfaceId == type(IERC721).interfaceId ||
            super.supportsInterface(_interfaceId);
    }
}
