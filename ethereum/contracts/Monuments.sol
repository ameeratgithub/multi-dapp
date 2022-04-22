// SPDX-License-Identifier: None

pragma solidity ^0.8.9;

contract Monuments {
    event Approval(
        address indexed owner,
        address indexed operator,
        uint256 tokenId
    );
    event ApprovalForAll(
        address indexed owner,
        address indexed operator,
        bool approved
    );

    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _owners;
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
            "Monuments::approve:Neither owner, nor approved"
        );
        require(_to != address(0), "Monuments::approve:Invalid address");

        _singleApproval[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }

    function getApproved(uint256 _tokenId) public view returns (address) {
        require(
            _owners[_tokenId] != address(0),
            "Monuments::getApproved:Token doesn't exist"
        );
        return _singleApproval[_tokenId];
    }
}
