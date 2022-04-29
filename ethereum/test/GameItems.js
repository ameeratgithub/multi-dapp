const ERC1155_INTERFACE_ID = '0xd9b67a26'
const ERC1155_METADATA_URI_INTERFACE_ID = '0x0e89341c'
const ERC165_INTERFACE_ID = '0x01ffc9a7'

const { ethers } = require('hardhat')
const { expect } = require('chai')


describe("GameItems", () => {
    let gameItems, signer

    beforeEach(async () => {
        signer = await ethers.getSigner()

        const GameItems = await ethers.getContractFactory('GameItems')
        gameItems = await GameItems.deploy("Game Items", "GI")
        await gameItems.deployed()
    })
    
    it('supports required interfaces', async () => {
        const supportsERC1155 = await gameItems.supportsInterface(ERC1155_INTERFACE_ID)
        const supportsERC1155Metadata = await gameItems.supportsInterface(ERC1155_METADATA_URI_INTERFACE_ID)
        const supportsERC165 = await gameItems.supportsInterface(ERC165_INTERFACE_ID)
        const supportsFFFF = await gameItems.supportsInterface('0xffffffff')

        expect(supportsERC1155).to.be.true
        expect(supportsERC1155Metadata).to.be.true
        expect(supportsERC165).to.be.true
        expect(supportsFFFF).not.to.be.true
    })
})