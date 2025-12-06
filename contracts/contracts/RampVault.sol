// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RampVault is AccessControl, ReentrancyGuard {
    bytes32 public constant WORKER_ROLE = keccak256("WORKER_ROLE");

    event Deposited(address indexed token, address indexed from, uint256 amount);
    event Withdrawn(address indexed token, address indexed to, uint256 amount);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WORKER_ROLE, admin);
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "amount=0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposited(token, msg.sender, amount);
    }

    function withdraw(address token, uint256 amount, address to) external nonReentrant onlyRole(WORKER_ROLE) {
        require(amount > 0, "amount=0");
        IERC20(token).transfer(to, amount);
        emit Withdrawn(token, to, amount);
    }

    function getVaultBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}