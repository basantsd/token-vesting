// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VestingToken.sol";

contract VestingVault is Ownable, ReentrancyGuard {

    // ============================================
    // STRUCT
    // ============================================

    struct VestingSchedule {
        uint256 totalAmount;      // Total tokens vest 
        uint256 claimedAmount;    // Total claimed
        uint256 startTime;        // Vesting start time
        uint256 cliffDuration;    // Cliff seconds
        uint256 vestingDuration;  // Total vesting seconds
        bool revoked;             // Admin cancel
        bool exists;              // Schedule exist or not
    }

    // ============================================
    // STATE VARIABLES
    // ============================================

    VestingToken public token;

    // beneficiary address → schedule
    mapping(address => VestingSchedule) public vestingSchedules;

    // Total locked tokens by vault
    uint256 public totalLockedTokens;

    // ============================================
    // ERRORS
    // ============================================

    error ScheduleAlreadyExists(address beneficiary);
    error ScheduleNotFound(address beneficiary);
    error ScheduleRevokedCheck(address beneficiary);
    error CliffNotReached(uint256 cliffEndsAt, uint256 currentTime);
    error NothingToClaim();
    error InsufficientVaultBalance(uint256 requested, uint256 available);
    error ZeroAmount();
    error ZeroAddress();

    // ============================================
    // EVENTS
    // ============================================

    event ScheduleCreated(
        address indexed beneficiary,
        uint256 totalAmount,
        uint256 cliffDuration,
        uint256 vestingDuration,
        uint256 startTime
    );

    event TokensClaimed(
        address indexed beneficiary,
        uint256 amount,
        uint256 remainingAmount
    );

    event ScheduleRevoked(
        address indexed beneficiary,
        uint256 unclaimedAmount
    );

    // ============================================
    // CONSTRUCTOR
    // ============================================

    constructor(address _token) Ownable(msg.sender) {
        if (_token == address(0)) revert ZeroAddress();
        token = VestingToken(_token);
    }

    // ============================================
    // MAIN FUNCTIONS
    // ============================================

    // Admin → create vesting schedule
    function createVestingSchedule(
        address beneficiary,
        uint256 totalAmount,
        uint256 cliffDuration,
        uint256 vestingDuration
    ) external onlyOwner {

        // Basic checks
        if (beneficiary == address(0)) revert ZeroAddress();
        if (totalAmount == 0) revert ZeroAmount();
        if (vestingSchedules[beneficiary].exists) {
            revert ScheduleAlreadyExists(beneficiary);
        }

        // Vault enough tokens exists
        uint256 vaultBalance = token.balanceOf(address(this));
        if (vaultBalance < totalLockedTokens + totalAmount) {
            revert InsufficientVaultBalance(
                totalAmount,
                vaultBalance - totalLockedTokens
            );
        }

        // Schedule
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: totalAmount,
            claimedAmount: 0,
            startTime: block.timestamp,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            revoked: false,
            exists: true
        });

        totalLockedTokens += totalAmount;

        emit ScheduleCreated(
            beneficiary,
            totalAmount,
            cliffDuration,
            vestingDuration,
            block.timestamp
        );
    }

    // User →  unlocked tokens claim
    function claim() external nonReentrant {
        address beneficiary = msg.sender;
        VestingSchedule storage schedule = vestingSchedules[beneficiary];

        // Checks
        if (!schedule.exists) revert ScheduleNotFound(beneficiary);
        if (schedule.revoked) revert ScheduleRevokedCheck(beneficiary);

        // Cliff check
        uint256 cliffEnd = schedule.startTime + schedule.cliffDuration;
        if (block.timestamp < cliffEnd) {
            revert CliffNotReached(cliffEnd, block.timestamp);
        }

        // How much tokens claim
        uint256 claimable = getClaimableAmount(beneficiary);
        if (claimable == 0) revert NothingToClaim();

        // First State update — Then transfer (Reentrancy protection)
        schedule.claimedAmount += claimable;
        totalLockedTokens -= claimable;

        // Transfer
        token.transfer(beneficiary, claimable);

        emit TokensClaimed(
            beneficiary,
            claimable,
            schedule.totalAmount - schedule.claimedAmount
        );
    }

    // Admin → Schedule cancel
    function revokeSchedule(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];

        if (!schedule.exists) revert ScheduleNotFound(beneficiary);
        if (schedule.revoked) revert ScheduleRevokedCheck(beneficiary);

        // Not claim re-count
        uint256 unvestedAmount = schedule.totalAmount - schedule.claimedAmount;

        schedule.revoked = true;
        totalLockedTokens -= unvestedAmount;

        emit ScheduleRevoked(beneficiary, unvestedAmount);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================

    // How much tokens already claimed?
    function getClaimableAmount(
        address beneficiary
    ) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        if (!schedule.exists) return 0;
        if (schedule.revoked) return 0;

        uint256 vested = getVestedAmount(beneficiary);
        return vested - schedule.claimedAmount;
    }

    // Total tokens vest?
    function getVestedAmount(
        address beneficiary
    ) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        if (!schedule.exists) return 0;

        uint256 cliffEnd = schedule.startTime + schedule.cliffDuration;

        // Cliff → 0
        if (block.timestamp < cliffEnd) return 0;

        uint256 vestingEnd = schedule.startTime + schedule.vestingDuration;

        // Fully vested → all
        if (block.timestamp >= vestingEnd) return schedule.totalAmount;

        // Linear calculation:
        uint256 timeElapsed = block.timestamp - schedule.startTime;

        // Formula: (totalAmount * timeElapsed) / vestingDuration
        return (schedule.totalAmount * timeElapsed) / schedule.vestingDuration;
    }

    // Schedule all details
    function getScheduleDetails(
        address beneficiary
    ) external view returns (
        uint256 totalAmount,
        uint256 claimedAmount,
        uint256 claimableNow,
        uint256 vestedSoFar,
        uint256 cliffEndsAt,
        uint256 vestingEndsAt,
        bool isRevoked
    ) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        return (
            schedule.totalAmount,
            schedule.claimedAmount,
            getClaimableAmount(beneficiary),
            getVestedAmount(beneficiary),
            schedule.startTime + schedule.cliffDuration,
            schedule.startTime + schedule.vestingDuration,
            schedule.revoked
        );
    }
}