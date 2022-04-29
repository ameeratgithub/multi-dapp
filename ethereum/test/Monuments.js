const ERC721_INTERFACE_ID = '0x80ac58cd'
const ERC721_METADATA_INTERFACE_ID = '0x5b5e139f'
const ERC165_INTERFACE_ID = '0x01ffc9a7'


const { ethers } = require('hardhat')
const { expect } = require('chai')


xdescribe("Monuments", () => {
    let monuments, signer, signer2, signer3

    beforeEach(async () => {
        [signer, signer2, signer3] = await ethers.getSigners()

        const Monuments = await ethers.getContractFactory('Monuments')
        monuments = await Monuments.deploy("Monument Valley", "MV")
        await monuments.deployed()
    })
    xit("mints tokens to msg.sender", async () => {
        await monuments.mint("tokenuri1")
        await monuments.mint("tokenuri2")

        const ownerof1 = await monuments.ownerOf(1)
        const ownerof2 = await monuments.ownerOf(2)

        const balance = await monuments.balanceOf(signer.address)

        expect(ownerof1).to.be.equal(signer.address)
        expect(ownerof2).to.be.equal(signer.address)

        expect(balance.toString()).to.be.eq("2")

    })
    xit("approves an operator for all tokens", async () => {
        await monuments.mint("tokenuri1")
        await monuments.mint("tokenuri2")

        await monuments.setApprovalForAll(signer2.address, true)

        const isApproved = await monuments.isApprovedForAll(signer.address, signer2.address)

        expect(isApproved).to.be.true

    })
    it("gets token uris", async () => {
        await monuments.mint("tokenuri1")
        await monuments.mint("tokenuri2")

        

        const uri1 = await monuments.tokenURI(1)
        const uri2 = await monuments.tokenURI(2)

        expect(uri1).to.be.equal("tokenuri1")
        expect(uri2).to.be.equal("tokenuri2")

    })
    xit("approves an operator for specific token", async () => {
        await monuments.mint("tokenuri1")
        await monuments.mint("tokenuri2")

        await monuments.approve(signer2.address, 1)
        await monuments.approve(signer3.address, 2)

        const approved1 = await monuments.getApproved(1)
        const approved2 = await monuments.getApproved(2)

        expect(approved1).to.be.equal(signer2.address)
        expect(approved2).to.be.equal(signer3.address)

    })


    it("transfer tokens to specified address", async () => {
        await monuments.mint("tokenuri1")
        await monuments.mint("tokenuri2")

        await monuments.approve(signer2.address, 1)
        await monuments.approve(signer3.address, 2)



        await monuments.connect(signer2).transferFrom(signer.address, signer2.address, 1)
        await monuments.connect(signer3).transferFrom(signer.address, signer3.address, 2)

        const ownerof1 = await monuments.ownerOf(1)
        const ownerof2 = await monuments.ownerOf(2)

        expect(ownerof1).to.be.equal(signer2.address)
        expect(ownerof2).to.be.equal(signer3.address)

    })



    xit('supports required interfaces', async () => {
        const supportsERC721 = await monuments.supportsInterface(ERC721_INTERFACE_ID)
        const supportsERC721Metadata = await monuments.supportsInterface(ERC721_METADATA_INTERFACE_ID)
        const supportsERC165 = await monuments.supportsInterface(ERC165_INTERFACE_ID)
        const supportsFFFF = await monuments.supportsInterface('0xffffffff')

        expect(supportsERC721).to.be.true
        expect(supportsERC721Metadata).to.be.true
        expect(supportsERC165).to.be.true
        expect(supportsFFFF).not.to.be.true
    })
})
