const { expect } = require("chai").use(require('chai-as-promised'));
const { ethers } = require("hardhat");

xdescribe("TAPP", function () {

  let tapp, signer;
  beforeEach(async () => {
    signer = await ethers.getSigner()
    const TAPP = await ethers.getContractFactory("Tapp");
    tapp = await TAPP.deploy();
    await tapp.deployed();

    console.log(`Tapp deployed at ${tapp.address}`);
  });
  it("Should mint some tokens", async function () {
    const mintingAmount = ethers.utils.parseEther("2000");
    const tx = await tapp.mint(mintingAmount);
    await tx.wait(1)

    const totalSupply = await tapp.totalSupply();
    const balance = await tapp.balanceOf(signer.address)
    console.log(balance.toString())
    
    expect(totalSupply.toString()).to.be.eq(mintingAmount.toString())
    expect(balance.toString()).to.be.eq(mintingAmount.toString())
  });
  it("Should not mint more tokens than limit", async function () {
    const instance = tapp.mint(ethers.utils.parseEther("2100"));
    await expect(instance).to.eventually.be.rejectedWith("Limit reached")
  });
});
