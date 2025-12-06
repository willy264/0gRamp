// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ReceiptRegistry {
    mapping(bytes32 => string) private cids;

    event ReceiptRegistered(bytes32 indexed txHash, string cid);

    function registerReceipt(bytes32 txHash, string memory cid) external {
        cids[txHash] = cid;
        emit ReceiptRegistered(txHash, cid);
    }

    function getReceipt(bytes32 txHash) external view returns (string memory) {
        return cids[txHash];
    }
}