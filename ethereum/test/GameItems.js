const ERC1155_INTERFACE_ID = '0xd9b67a26'
const ERC1155_METADATA_URI_INTERFACE_ID = '0x0e89341c'
const ERC165_INTERFACE_ID = '0x01ffc9a7'

const { ethers } = require('hardhat')
const { expect } = require('chai')


describe.only("GameItems", () => {
    let gameItems, signer, signer2, signer3, tapp
    const baseURI = 'https://gameitems.com/'

    beforeEach(async () => {

        [signer, signer2, signer3] = await ethers.getSigners()

        const Tapp = await ethers.getContractFactory('Tapp')
        tapp = await Tapp.deploy()

        const GameItems = await ethers.getContractFactory('GameItems')
        gameItems = await GameItems.deploy("Game Items", "GI", baseURI, tapp.address)

        await gameItems.deployed()




    })

    xdescribe('Setting Constraints', () => {
        it('sets prices of tokens individually', async () => {
            await Promise.all([
                gameItems.setPrice('bronze.png', ethers.utils.parseEther('1')),
                gameItems.setPrice('silver.png', ethers.utils.parseEther('5')),
                gameItems.setPrice('gold.webp', ethers.utils.parseEther('25')),
                gameItems.setPrice('diamond.webp', ethers.utils.parseEther('125'))
            ])

            const prices = await Promise.all([
                gameItems.getPrice('bronze.png'),
                gameItems.getPrice('silver.png'),
                gameItems.getPrice('gold.webp'),
                gameItems.getPrice('diamond.webp')
            ])

            expect(prices[0].toString()).to.be.equal(ethers.utils.parseEther('1'))
            expect(prices[1].toString()).to.be.equal(ethers.utils.parseEther('5'))
            expect(prices[2].toString()).to.be.equal(ethers.utils.parseEther('25'))
            expect(prices[3].toString()).to.be.equal(ethers.utils.parseEther('125'))

        })
        it('sets batch prices of tokens', async () => {
            await gameItems.setBatchPrices(
                ['bronze.png', 'silver.png', 'gold.webp', 'diamond.webp'],
                [
                    ethers.utils.parseEther('1'),
                    ethers.utils.parseEther('5'),
                    ethers.utils.parseEther('25'),
                    ethers.utils.parseEther('125')
                ]
            )
            const prices = await gameItems.getBatchPrices(['bronze.png', 'silver.png', 'gold.webp', 'diamond.webp'])

            expect(prices[0].toString()).to.be.equal(ethers.utils.parseEther('1'))
            expect(prices[1].toString()).to.be.equal(ethers.utils.parseEther('5'))
            expect(prices[2].toString()).to.be.equal(ethers.utils.parseEther('25'))
            expect(prices[3].toString()).to.be.equal(ethers.utils.parseEther('125'))
        })
        it('sets allowed amounts of tokens individually', async () => {
            await Promise.all([
                gameItems.setAllowedAmount('bronze.png', 1000),
                gameItems.setAllowedAmount('silver.png', 200),
                gameItems.setAllowedAmount('gold.webp', 25),
                gameItems.setAllowedAmount('diamond.webp', 5)
            ])

            const allowedAmounts = await Promise.all([
                gameItems.getAllowedAmount('bronze.png'),
                gameItems.getAllowedAmount('silver.png'),
                gameItems.getAllowedAmount('gold.webp'),
                gameItems.getAllowedAmount('diamond.webp')
            ])

            expect(allowedAmounts[0]).to.be.equal(1000)
            expect(allowedAmounts[1]).to.be.equal(200)
            expect(allowedAmounts[2]).to.be.equal(25)
            expect(allowedAmounts[3]).to.be.equal(5)

        })
        it('sets batch allowed amounts of tokens', async () => {
            await gameItems.setBatchAllowedAmounts(
                ['bronze.png', 'silver.png', 'gold.webp', 'diamond.webp'],
                [
                    1000,
                    200,
                    25,
                    5
                ]
            )
            const allowedAmounts = await gameItems.getBatchAllowedAmounts(['bronze.png', 'silver.png', 'gold.webp', 'diamond.webp'])

            expect(allowedAmounts[0]).to.be.equal(1000)
            expect(allowedAmounts[1]).to.be.equal(200)
            expect(allowedAmounts[2]).to.be.equal(25)
            expect(allowedAmounts[3]).to.be.equal(5)
        })
    })

    describe('Minting and transfering', () => {
        beforeEach(async () => {
            await tapp.mint(ethers.utils.parseEther('2000'))
            await tapp.connect(signer2).mint(ethers.utils.parseEther('2000'))
            await tapp.connect(signer3).mint(ethers.utils.parseEther('2000'))

            await tapp.approve(gameItems.address, ethers.utils.parseEther('156'));
            await tapp.connect(signer2).approve(gameItems.address, ethers.utils.parseEther('156'));
            await tapp.connect(signer3).approve(gameItems.address, ethers.utils.parseEther('156'));
        })

        it('mints some specified tokens', async () => {

            await gameItems.mint(1, 'bronze.png')
            await gameItems.mint(1, 'silver.png')
            await gameItems.mint(1, 'gold.webp')
            await gameItems.mint(1, 'diamond.webp')

            const uri1 = await gameItems.uri(1)
            const uri2 = await gameItems.uri(2)
            const uri3 = await gameItems.uri(3)
            const uri4 = await gameItems.uri(4)

            expect(uri1).to.be.equal(baseURI + 'bronze.png')
            expect(uri2).to.be.equal(baseURI + 'silver.png')
            expect(uri3).to.be.equal(baseURI + 'gold.webp')
            expect(uri4).to.be.equal(baseURI + 'diamond.webp')

            const balanceOf1 = await gameItems.balanceOf(signer.address, 1)
            const balanceOf2 = await gameItems.balanceOf(signer.address, 2)
            const balanceOf3 = await gameItems.balanceOf(signer.address, 3)
            const balanceOf4 = await gameItems.balanceOf(signer.address, 4)

            const tappBalance = await tapp.balanceOf(signer.address);

            expect(tappBalance.toString()).to.be.equal(ethers.utils.parseEther((2000 - 156).toString()))

            expect(balanceOf1.toString()).to.be.equal('1000')
            expect(balanceOf2.toString()).to.be.equal('100')
            expect(balanceOf3.toString()).to.be.equal('10')
            expect(balanceOf4.toString()).to.be.equal('1')

        })
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
    xit('transfer some batch items', async () => {
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