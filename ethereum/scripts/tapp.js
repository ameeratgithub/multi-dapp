
const hre = require("hardhat");

async function main() {
  const Tapp = await hre.ethers.getContractFactory("Tapp");
  const tapp = await Tapp.deploy();

  await tapp.deployed();

  console.log("Tapp deployed to:", tapp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
