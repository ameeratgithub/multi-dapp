
const hre = require("hardhat");

async function main() {
  const Collections = await hre.ethers.getContractFactory("Collections");
  const collections = await Collections.deploy();

  await collections.deployed();

  console.log("Tapp deployed to:", tapp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
