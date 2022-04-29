const ERC1155_INTERFACE_ID = '0xd9b67a26'
const ERC1155_METADATA_URI_INTERFACE_ID = '0x0e89341c'
const ERC165_INTERFACE_ID = '0x01ffc9a7'

const { ethers } = require('hardhat')
const { expect } = require('chai')


describe.only("GameItems", () => {
    let gameItems, signer, signer2, signer3

    beforeEach(async () => {

        [signer, signer2, signer3] = await ethers.getSigners()

        const GameItems = await ethers.getContractFactory('GameItems')
        gameItems = await GameItems.deploy("Game Items", "GI")
        await gameItems.deployed()

    })

    xit('mints some specified tokens', async () => {
        await gameItems.mint(1000, 'bronze')
        await gameItems.mint(100, 'silver')
        await gameItems.mint(10, 'gold')
        await gameItems.mint(1, 'diamond')

        const uri1 = await gameItems.uri(1)
        const uri2 = await gameItems.uri(2)
        const uri3 = await gameItems.uri(3)
        const uri4 = await gameItems.uri(4)

        expect(uri1).to.be.equal('bronze')
        expect(uri2).to.be.equal('silver')
        expect(uri3).to.be.equal('gold')
        expect(uri4).to.be.equal('diamond')

        const balanceOf1 = await gameItems.balanceOf(signer.address, 1)
        const balanceOf2 = await gameItems.balanceOf(signer.address, 2)
        const balanceOf3 = await gameItems.balanceOf(signer.address, 3)
        const balanceOf4 = await gameItems.balanceOf(signer.address, 4)

        expect(balanceOf1.toString()).to.be.equal('1000')
        expect(balanceOf2.toString()).to.be.equal('100')
        expect(balanceOf3.toString()).to.be.equal('10')
        expect(balanceOf4.toString()).to.be.equal('1')

    })
    xit('checks balances of batch', async () => {
        await gameItems.mint(1000, 'bronze')
        await gameItems.connect(signer2).mint(100, 'silver')
        await gameItems.connect(signer3).mint(10, 'gold')
        await gameItems.mint(1, 'diamond')

        const batchBalances = await gameItems.balanceOfBatch(
            [signer.address, signer2.address, signer3.address, signer.address]
            , [1, 2, 3, 4])

        expect(batchBalances[0].toString()).to.be.equal('1000')
        expect(batchBalances[1].toString()).to.be.equal('100')
        expect(batchBalances[2].toString()).to.be.equal('10')
        expect(batchBalances[3].toString()).to.be.equal('1')
    })

    xit('approves an operator', async () => {
        await gameItems.mint(1000, 'bronze')
        await gameItems.mint(1, 'diamond')

        await gameItems.setApprovalForAll(signer2.address, true)

        const isApproved = await gameItems.isApprovedForAll(signer.address, signer2.address)
        const isApproved2 = await gameItems.isApprovedForAll(signer.address, signer3.address)

        expect(isApproved).to.be.true
        expect(isApproved2).not.to.be.true
    })


    xit('transfer some items', async () => {
        await gameItems.mint(1000, 'bronze')
        await gameItems.connect(signer2).mint(100, 'silver')
        await gameItems.connect(signer3).mint(10, 'gold')
        await gameItems.connect(signer3).mint(1, 'diamond')


        await gameItems.connect(signer3).setApprovalForAll(signer.address, true)

        let token1Of2 = await gameItems.balanceOf(signer2.address, 1)
        let token3Of2 = await gameItems.balanceOf(signer2.address, 3)
        expect(token1Of2.toString()).to.be.equal('0')
        expect(token3Of2.toString()).to.be.equal('0')

        await gameItems.safeTransferFrom(signer.address, signer2.address, 1, 100, [])
        await gameItems.safeTransferFrom(signer3.address, signer2.address, 3, 5, [])

        token1Of2 = await gameItems.balanceOf(signer2.address, 1)
        token3Of2 = await gameItems.balanceOf(signer2.address, 3)

        expect(token1Of2.toString()).to.be.equal('100')
        expect(token3Of2.toString()).to.be.equal('5')


        const balanceOf1 = await gameItems.balanceOf(signer.address, 1)
        const balanceOf3 = await gameItems.balanceOf(signer3.address, 3)

        expect(balanceOf1.toString()).to.be.equal('900')
        expect(balanceOf3.toString()).to.be.equal('5')

    })
    it('transfer some batch items', async () => {
        await gameItems.mint(1000, 'bronze')
        await gameItems.connect(signer2).mint(100, 'silver')
        await gameItems.connect(signer3).mint(10, 'gold')
        await gameItems.connect(signer3).mint(1, 'diamond')


        await gameItems.connect(signer3).setApprovalForAll(signer.address, true)

        let token3Of2 = await gameItems.balanceOf(signer2.address, 3)
        let token4Of2 = await gameItems.balanceOf(signer2.address, 4)
        expect(token3Of2.toString()).to.be.equal('0')
        expect(token4Of2.toString()).to.be.equal('0')

        await gameItems.connect(signer3).safeBatchTransferFrom(signer3.address, signer2.address, [3, 4], [5, 1], [])

        token3Of2 = await gameItems.balanceOf(signer2.address, 3)
        token4Of2 = await gameItems.balanceOf(signer2.address, 4)

        expect(token3Of2.toString()).to.be.equal('5')
        expect(token4Of2.toString()).to.be.equal('1')


        const balanceOf3 = await gameItems.balanceOf(signer3.address, 3)
        const balanceOf4 = await gameItems.balanceOf(signer3.address, 4)

        expect(balanceOf3.toString()).to.be.equal('5')
        expect(balanceOf4.toString()).to.be.equal('0')

    })

    xit('supports required interfaces', async () => {
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