const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("VestingVault", function () {

  // ============================================
  // SETUP
  // ============================================

  let token;
  let vault;
  let owner;
  let user1;
  let user2;

  // Time constants (seconds mein)
  const CLIFF     = 180 * 24 * 60 * 60; // 6 months
  const VESTING   = 360 * 24 * 60 * 60; // 12 months
  const MINT_AMT  = ethers.parseEther("100000");
  const VEST_AMT  = ethers.parseEther("1000");

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Token deploy karo
    const VestingToken = await ethers.getContractFactory("VestingToken");
    token = await VestingToken.deploy("VestingToken", "VTK", 1000000n);
    await token.waitForDeployment();

    // Vault deploy karo
    const VestingVault = await ethers.getContractFactory("VestingVault");
    vault = await VestingVault.deploy(await token.getAddress());
    await vault.waitForDeployment();

    // Vault ko tokens do
    await token.mint(await vault.getAddress(), MINT_AMT);
  });

  // ============================================
  // DEPLOYMENT TESTS
  // ============================================

  describe("Deployment", function () {

    it("Token address sahi set hona chahiye", async function () {
      expect(await vault.token()).to.equal(await token.getAddress());
    });

    it("Owner sahi set hona chahiye", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });

  });

  // ============================================
  // CREATE SCHEDULE TESTS
  // ============================================

  describe("Create Schedule", function () {

    it("Owner schedule bana sakta hai", async function () {
      await vault.createVestingSchedule(
        user1.address, VEST_AMT, CLIFF, VESTING
      );
      const schedule = await vault.vestingSchedules(user1.address);
      expect(schedule.totalAmount).to.equal(VEST_AMT);
      expect(schedule.exists).to.equal(true);
    });

    it("Sirf owner schedule bana sakta hai", async function () {
      await expect(
        vault.connect(user1).createVestingSchedule(
          user1.address, VEST_AMT, CLIFF, VESTING
        )
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("Same address ke liye 2 schedule nahi bana sakta", async function () {
      await vault.createVestingSchedule(
        user1.address, VEST_AMT, CLIFF, VESTING
      );
      await expect(
        vault.createVestingSchedule(
          user1.address, VEST_AMT, CLIFF, VESTING
        )
      ).to.be.revertedWithCustomError(vault, "ScheduleAlreadyExists");
    });

    it("Zero address ke liye schedule nahi banega", async function () {
      await expect(
        vault.createVestingSchedule(
          ethers.ZeroAddress, VEST_AMT, CLIFF, VESTING
        )
      ).to.be.revertedWithCustomError(vault, "ZeroAddress");
    });

    it("Zero amount ke liye schedule nahi banega", async function () {
      await expect(
        vault.createVestingSchedule(user1.address, 0, CLIFF, VESTING)
      ).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

  });

  // ============================================
  // CLAIM TESTS
  // ============================================

  describe("Claim", function () {

    beforeEach(async function () {
      await vault.createVestingSchedule(
        user1.address, VEST_AMT, CLIFF, VESTING
      );
    });

    it("Cliff se pehle claim nahi hoga", async function () {
      await expect(
        vault.connect(user1).claim()
      ).to.be.revertedWithCustomError(vault, "CliffNotReached");
    });

    it("Cliff ke baad claim hoga", async function () {
      // Time aage badao — cliff ke baad
      await time.increase(CLIFF + 1);

      const claimable = await vault.getClaimableAmount(user1.address);
      expect(claimable).to.be.gt(0);

      await vault.connect(user1).claim();
      expect(await token.balanceOf(user1.address)).to.be.gt(0);
    });

    it("Fully vested hone pe sab tokens milenge", async function () {
      // Vesting khatam hone ke baad time badao
      await time.increase(VESTING + 1);

      await vault.connect(user1).claim();
      expect(await token.balanceOf(user1.address)).to.equal(VEST_AMT);
    });

    it("Double claim nahi ho sakta", async function () {
      await time.increase(VESTING + 1);
      await vault.connect(user1).claim();

      // Dobara claim karo
      await expect(
        vault.connect(user1).claim()
      ).to.be.revertedWithCustomError(vault, "NothingToClaim");
    });

    it("Schedule nahi hai to claim fail ho", async function () {
      await expect(
        vault.connect(user2).claim()
      ).to.be.revertedWithCustomError(vault, "ScheduleNotFound");
    });

  });

  // ============================================
  // REVOKE TESTS
  // ============================================

  describe("Revoke", function () {

    beforeEach(async function () {
      await vault.createVestingSchedule(
        user1.address, VEST_AMT, CLIFF, VESTING
      );
    });

    it("Owner revoke kar sakta hai", async function () {
      await vault.revokeSchedule(user1.address);
      const schedule = await vault.vestingSchedules(user1.address);
      expect(schedule.revoked).to.equal(true);
    });

    it("Revoke ke baad claim nahi hoga", async function () {
      await vault.revokeSchedule(user1.address);
      await time.increase(VESTING + 1);
      await expect(
        vault.connect(user1).claim()
      ).to.be.revertedWithCustomError(vault, "ScheduleRevokedCheck");
    });

    it("Sirf owner revoke kar sakta hai", async function () {
      await expect(
        vault.connect(user1).revokeSchedule(user1.address)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("Already revoked schedule dobara revoke nahi hogi", async function () {
      await vault.revokeSchedule(user1.address);
      await expect(
        vault.revokeSchedule(user1.address)
      ).to.be.revertedWithCustomError(vault, "ScheduleRevokedCheck");
    });

  });

  // ============================================
  // VESTING CALCULATION TESTS
  // ============================================

  describe("Vesting Calculations", function () {

    beforeEach(async function () {
      await vault.createVestingSchedule(
        user1.address, VEST_AMT, CLIFF, VESTING
      );
    });

    it("Cliff se pehle vested amount 0 hona chahiye", async function () {
      expect(await vault.getVestedAmount(user1.address)).to.equal(0);
    });

    it("50% time pe 50% tokens vest hone chahiye", async function () {
      // Half vesting time guzro
      await time.increase(VESTING / 2);
      const vested = await vault.getVestedAmount(user1.address);
      const expected = VEST_AMT / 2n;
      // ~50% ke aaspaas hona chahiye
      expect(vested).to.be.closeTo(expected, ethers.parseEther("10"));
    });

    it("Vesting khatam hone pe 100% vest hona chahiye", async function () {
      await time.increase(VESTING + 1);
      expect(await vault.getVestedAmount(user1.address)).to.equal(VEST_AMT);
    });

  });

});