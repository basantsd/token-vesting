const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VestingToken", function () {
  
  // ============================================
  // SETUP — Har test se pehle fresh deploy
  // ============================================
  
  let token;
  let owner;
  let user1;
  let user2;

  const TOKEN_NAME = "VestingToken";
  const TOKEN_SYMBOL = "VTK";
  const MAX_SUPPLY = 1000000n; // 1 Million

  beforeEach(async function () {
    // Wallets lo
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy karo
    const VestingToken = await ethers.getContractFactory("VestingToken");
    token = await VestingToken.deploy(TOKEN_NAME, TOKEN_SYMBOL, MAX_SUPPLY);
    await token.waitForDeployment();
  });

  // ============================================
  // DEPLOYMENT TESTS
  // ============================================

  describe("Deployment", function () {

    it("Sahi name set hona chahiye", async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
    });

    it("Sahi symbol set hona chahiye", async function () {
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Owner sahi set hona chahiye", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Total supply shuru mein 0 honi chahiye", async function () {
      expect(await token.totalSupply()).to.equal(0);
    });

    it("Max supply sahi set honi chahiye", async function () {
      const expectedMaxSupply = MAX_SUPPLY * 10n ** 18n;
      expect(await token.maxSupply()).to.equal(expectedMaxSupply);
    });

  });

  // ============================================
  // MINT TESTS
  // ============================================

  describe("Mint", function () {

    it("Owner mint kar sakta hai", async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.mint(user1.address, mintAmount);
      expect(await token.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Sirf owner mint kar sakta hai", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        token.connect(user1).mint(user1.address, mintAmount)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Max supply se zyada mint nahi hoga", async function () {
      const tooMuch = ethers.parseEther("2000000"); // 2M > 1M max
      await expect(
        token.mint(user1.address, tooMuch)
      ).to.be.revertedWithCustomError(token, "MaxSupplyExceeded");
    });

    it("Zero address pe mint nahi hoga", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        token.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWithCustomError(token, "ERC20InvalidReceiver");
    });

    it("Mint ke baad totalSupply badha", async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.mint(user1.address, mintAmount);
      expect(await token.totalSupply()).to.equal(mintAmount);
    });

  });

  // ============================================
  // TRANSFER TESTS
  // ============================================

  describe("Transfer", function () {

    beforeEach(async function () {
      // User1 ko tokens do pehle
      await token.mint(user1.address, ethers.parseEther("1000"));
    });

    it("Transfer sahi kaam kare", async function () {
      const amount = ethers.parseEther("100");
      await token.connect(user1).transfer(user2.address, amount);
      expect(await token.balanceOf(user2.address)).to.equal(amount);
    });

    it("Sender ka balance kam hona chahiye", async function () {
      const amount = ethers.parseEther("100");
      await token.connect(user1).transfer(user2.address, amount);
      expect(await token.balanceOf(user1.address)).to.equal(
        ethers.parseEther("900")
      );
    });

    it("Insufficient balance pe fail ho", async function () {
      const tooMuch = ethers.parseEther("9999");
      await expect(
        token.connect(user1).transfer(user2.address, tooMuch)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

  });

  // ============================================
  // BURN TESTS
  // ============================================

  describe("Burn", function () {

    beforeEach(async function () {
      await token.mint(user1.address, ethers.parseEther("1000"));
    });

    it("Burn sahi kaam kare", async function () {
      const burnAmount = ethers.parseEther("500");
      await token.connect(user1).burn(burnAmount);
      expect(await token.balanceOf(user1.address)).to.equal(
        ethers.parseEther("500")
      );
    });

    it("Burn ke baad totalSupply kam ho", async function () {
      const burnAmount = ethers.parseEther("500");
      await token.connect(user1).burn(burnAmount);
      expect(await token.totalSupply()).to.equal(ethers.parseEther("500"));
    });

    it("Balance se zyada burn nahi hoga", async function () {
      const tooMuch = ethers.parseEther("9999");
      await expect(
        token.connect(user1).burn(tooMuch)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });

  });

  // ============================================
  // PAUSE TESTS
  // ============================================

  describe("Pause", function () {

    it("Owner pause kar sakta hai", async function () {
      await token.pause();
      expect(await token.paused()).to.equal(true);
    });

    it("Sirf owner pause kar sakta hai", async function () {
      await expect(
        token.connect(user1).pause()
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("Paused mein transfer nahi hoga", async function () {
      await token.mint(user1.address, ethers.parseEther("1000"));
      await token.pause();
      await expect(
        token.connect(user1).transfer(user2.address, ethers.parseEther("100"))
      ).to.be.revertedWithCustomError(token, "EnforcedPause");
    });

    it("Unpause ke baad transfer hoga", async function () {
      await token.mint(user1.address, ethers.parseEther("1000"));
      await token.pause();
      await token.unpause();
      await token.connect(user1).transfer(user2.address, ethers.parseEther("100"));
      expect(await token.balanceOf(user2.address)).to.equal(
        ethers.parseEther("100")
      );
    });

  });

});