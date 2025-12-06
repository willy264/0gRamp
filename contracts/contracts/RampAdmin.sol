// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract RampAdmin is AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant WORKER_ROLE = keccak256("WORKER_ROLE");

    uint256 public feeBps; // basis points

    event FeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(address admin, uint256 _feeBps) {
        _grantRole(ADMIN_ROLE, admin);
        _grantRole(WORKER_ROLE, admin);
        feeBps = _feeBps;
    }

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    function setFeeBps(uint256 _feeBps) external onlyRole(ADMIN_ROLE) {
        emit FeeUpdated(feeBps, _feeBps);
        feeBps = _feeBps;
    }
}