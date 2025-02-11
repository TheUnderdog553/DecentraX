const hre = require("hardhat");

async function main() {
  // 1. Get the contract factory
  const IoTRegistry = await hre.ethers.getContractFactory("IoTRegistry");
  
  // 2. Deploy the contract (no need for .deployed() in newer versions)
  const contract = await IoTRegistry.deploy();
  
  // 3. Wait for deployment confirmation
  await contract.waitForDeployment();
  
  // 4. Get the deployment address
  const contractAddress = await contract.getAddress();
  
  console.log("Contract deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });