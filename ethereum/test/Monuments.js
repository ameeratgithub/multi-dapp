const ERC721_INTERFACE_ID = '0x80ac58cd'
const ERC721_METADATA_INTERFACE_ID = '0x5b5e139f'
const ERC165_INTERFACE_ID = '0x01ffc9a7'


const { ethers } = require('hardhat')
const { expect } = require('chai')


describe("Monuments", () => {
    let monuments, signer

    beforeEach(async () => {
        signer = await ethers.getSigner()

        const Monuments = await ethers.getContractFactory('Monuments')
        monuments = await Monuments.deploy("Monument Valley", "GI")
        await monuments.deployed()
    })
    it('supports required interfaces', async () => {
        const supportsERC721 = await monuments.supportsInterface(ERC721_INTERFACE_ID)
        const supportsERC1155Metadata = await monuments.supportsInterface(ERC721_METADATA_INTERFACE_ID)
        const supportsERC165 = await monuments.supportsInterface(ERC165_INTERFACE_ID)

        expect(supportsERC1155).to.be.true
        expect(supportsERC1155Metadata).to.be.true
        expect(supportsERC165).to.be.true
    })
})
