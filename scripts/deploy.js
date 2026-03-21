const { ethers } = require("hardhat");

async function main() {

  console.log("Starting deployment...\n");

  // Get deployer wallet
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with wallet:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH\n");

  // ============================================
  // 1. Deploy VestingToken
  // ============================================

  console.log("Deploying VestingToken...");

  const VestingToken = await ethers.getContractFactory("VestingToken");
  const token = await VestingToken.deploy(
    "VestingToken",   // name
    "VTK",            // symbol
    1000000n          // max supply — 1 Million
  );
  await token.waitForDeployment();

  const tokenAddress = await token.getAddress();
  console.log("VestingToken deployed at:", tokenAddress);

  // ============================================
  // 2. Deploy VestingVault
  // ============================================

  console.log("\nDeploying VestingVault...");

  const VestingVault = await ethers.getContractFactory("VestingVault");
  const vault = await VestingVault.deploy(tokenAddress);
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("VestingVault deployed at:", vaultAddress);

  // ============================================
  // 3. Setup — Vault Ko Tokens Do
  // ============================================

  console.log("\nSetting up vault...");

  // Vault ke liye 500,000 tokens mint karo
  const mintAmount = ethers.parseEther("500000");
  const mintTx = await token.mint(vaultAddress, mintAmount);
  await mintTx.wait();
  console.log("Minted 500,000 VTK to vault");

  // ============================================
  // 4. Test Schedule Banao — Verify Karne Ko
  // ============================================

  console.log("\nCreating test vesting schedule...");

  const CLIFF_6_MONTHS   = 180 * 24 * 60 * 60;  // 6 months seconds
  const VESTING_12_MONTHS = 360 * 24 * 60 * 60; // 12 months seconds
  const vestAmount = ethers.parseEther("1000");

  const scheduleTx = await vault.createVestingSchedule(
    deployer.address,       // beneficiary — apna address
    vestAmount,             // 1000 tokens
    CLIFF_6_MONTHS,         // 6 month cliff
    VESTING_12_MONTHS       // 12 month vesting
  );
  await scheduleTx.wait();
  console.log("Test vesting schedule created for:", deployer.address);

  // ============================================
  // 5. Verify Deployment
  // ============================================

  console.log("\nVerifying deployment...");

  const vaultBalance = await token.balanceOf(vaultAddress);
  const schedule = await vault.vestingSchedules(deployer.address);

  console.log("Vault token balance:", ethers.formatEther(vaultBalance));
  console.log("Schedule total amount:", ethers.formatEther(schedule.totalAmount));
  console.log("Schedule exists:", schedule.exists);

  // ============================================
  // 6. Summary Print Karo
  // ============================================

  console.log("\n========================================");
  console.log("DEPLOYMENT SUMMARY");
  console.log("========================================");
  console.log("Network:        ", (await ethers.provider.getNetwork()).name);
  console.log("Deployer:       ", deployer.address);
  console.log("VestingToken:   ", tokenAddress);
  console.log("VestingVault:   ", vaultAddress);
  console.log("Vault Balance:  ", ethers.formatEther(vaultBalance), "VTK");
  console.log("========================================\n");

  // .env mein save karne ke liye print karo
  console.log("Save these in your .env file:");
  console.log("VESTING_TOKEN_ADDRESS=" + tokenAddress);
  console.log("VESTING_VAULT_ADDRESS=" + vaultAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });