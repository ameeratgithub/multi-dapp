const ERC1155_INTERFACE_ID = '0xd9b67a26'
const ERC1155_METADATA_URI_INTERFACE_ID = '0x0e89341c'
const ERC165_INTERFACE_ID = '0x01ffc9a7'

const { ethers } = require('hardhat')
const { expect } = require('chai')


const _e = (amount) => {
    return ethers.utils.parseEther(amount.toString())
}
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

        await gameItems.initializeBatch([1000, 200, 50, 10], [_e(1), _e(5), _e(20), _e(100)])


    })

    describe('Setting Constraints', () => {
        it('sets prices of tokens individually', async () => {
            await Promise.all([
                gameItems.setPrice(1, _e(1)),
                gameItems.setPrice(2, _e(5)),
                gameItems.setPrice(3, _e(20)),
                gameItems.setPrice(4, _e(100))
            ])

            const prices = await Promise.all([
                gameItems.getPrice(1),
                gameItems.getPrice(2),
                gameItems.getPrice(3),
                gameItems.getPrice(4)
            ])

            expect(prices[0].toString()).to.be.equal(_e(1))
            expect(prices[1].toString()).to.be.equal(_e(5))
            expect(prices[2].toString()).to.be.equal(_e(20))
            expect(prices[3].toString()).to.be.equal(_e(100))

        })
        it('sets batch prices of tokens', async () => {
            await gameItems.setBatchPrices(
                [1, 2, 3, 4], [_e(1), _e(5), _e(20), _e(100)]
            )
            const prices = await gameItems.getBatchPrices([1, 2, 3, 4])

            expect(prices[0].toString()).to.be.equal(_e(1))
            expect(prices[1].toString()).to.be.equal(_e(5))
            expect(prices[2].toString()).to.be.equal(_e(20))
            expect(prices[3].toString()).to.be.equal(_e(100))
        })
        it('sets allowed amounts of tokens individually', async () => {
            await Promise.all([
                gameItems.setAllowedAmount(1, 1000),
                gameItems.setAllowedAmount(2, 200),
                gameItems.setAllowedAmount(3, 25),
                gameItems.setAllowedAmount(4, 5)
            ])

            const allowedAmounts = await Promise.all([
                gameItems.getAllowedAmount(1),
                gameItems.getAllowedAmount(2),
                gameItems.getAllowedAmount(3),
                gameItems.getAllowedAmount(4)
            ])

            expect(allowedAmounts[0]).to.be.equal(1000)
            expect(allowedAmounts[1]).to.be.equal(200)
            expect(allowedAmounts[2]).to.be.equal(25)
            expect(allowedAmounts[3]).to.be.equal(5)

        })
        it('sets batch allowed amounts of tokens', async () => {
            await gameItems.setBatchAllowedAmounts(
                [1, 2, 3, 4],
                [
                    1000,
                    200,
                    25,
                    5
                ]
            )

            const allowedAmounts = await gameItems.getBatchAllowedAmounts([1, 2, 3, 4])

            expect(allowedAmounts[0]).to.be.equal(1000)
            expect(allowedAmounts[1]).to.be.equal(200)
            expect(allowedAmounts[2]).to.be.equal(25)
            expect(allowedAmounts[3]).to.be.equal(5)
        })
    })

    describe('Minting and transfering', () => {
        beforeEach(async () => {
            await tapp.mint(_e(2000))
            await tapp.connect(signer2).mint(_e(2000))
            await tapp.connect(signer3).mint(_e(2000))

            await tapp.approve(gameItems.address, _e(2000));
            await tapp.connect(signer2).approve(gameItems.address, _e(2000));
            await tapp.connect(signer3).approve(gameItems.address, _e(2000));
        })

        it('mints some specified tokens', async () => {

            await gameItems.mint(20, 1)
            await gameItems.mint(10, 2)
            await gameItems.mint(5, 3)
            await gameItems.mint(1, 4)

            const uri1 = await gameItems.uri(1)
            const uri2 = await gameItems.uri(2)
            const uri3 = await gameItems.uri(3)
            const uri4 = await gameItems.uri(4)

            expect(uri1).to.be.equal(baseURI + '1.json')
            expect(uri2).to.be.equal(baseURI + '2.json')
            expect(uri3).to.be.equal(baseURI + '3.json')
            expect(uri4).to.be.equal(baseURI + '4.json')

            const balanceOf1 = await gameItems.balanceOf(signer.address, 1)
            const balanceOf2 = await gameItems.balanceOf(signer.address, 2)
            const balanceOf3 = await gameItems.balanceOf(signer.address, 3)
            const balanceOf4 = await gameItems.balanceOf(signer.address, 4)

            const tappBalance = await tapp.balanceOf(signer.address);

            expect(tappBalance.toString()).to.be.equal(_e(2000 - (20 + 50 + 100 + 100)))

            expect(balanceOf1.toString()).to.be.equal('20')
            expect(balanceOf2.toString()).to.be.equal('10')
            expect(balanceOf3.toString()).to.be.equal('5')
            expect(balanceOf4.toString()).to.be.equal('1')

        })
        it('checks balances of batch', async () => {
            await gameItems.mint(20, 1)
            await gameItems.connect(signer2).mint(10, 2)
            await gameItems.connect(signer3).mint(5, 3)
            await gameItems.mint(1, 4)
    
            const batchBalances = await gameItems.balanceOfBatch(
                [signer.address, signer2.address, signer3.address, signer.address]
                , [1, 2, 3, 4])
    
            expect(batchBalances[0].toString()).to.be.equal('20')
            expect(batchBalances[1].toString()).to.be.equal('10')
            expect(batchBalances[2].toString()).to.be.equal('5')
            expect(batchBalances[3].toString()).to.be.equal('1')
        })
    
        it('approves an operator', async () => {
            await gameItems.mint(20, 1)
            await gameItems.mint(1, 4)
    
            await gameItems.setApprovalForAll(signer2.address, true)
    
            const isApproved = await gameItems.isApprovedForAll(signer.address, signer2.address)
            const isApproved2 = await gameItems.isApprovedForAll(signer.address, signer3.address)
    
            expect(isApproved).to.be.true
            expect(isApproved2).not.to.be.true
        })
    
    
        it('transfer some items', async () => {
            await gameItems.mint(20, 1)
            await gameItems.connect(signer2).mint(10, 2)
            await gameItems.connect(signer3).mint(5, 3)
            await gameItems.connect(signer3).mint(1, 4)
    
    
            await gameItems.connect(signer3).setApprovalForAll(signer.address, true)
    
            let token1Of2 = await gameItems.balanceOf(signer2.address, 1)
            let token3Of2 = await gameItems.balanceOf(signer2.address, 3)
    
            expect(token1Of2.toString()).to.be.equal('0')
            expect(token3Of2.toString()).to.be.equal('0')
    
            await gameItems.safeTransferFrom(signer.address, signer2.address, 1, 10, [])
            await gameItems.safeTransferFrom(signer3.address, signer2.address, 3, 3, [])
    
            token1Of2 = await gameItems.balanceOf(signer2.address, 1)
            token3Of2 = await gameItems.balanceOf(signer2.address, 3)
    
            expect(token1Of2.toString()).to.be.equal('10')
            expect(token3Of2.toString()).to.be.equal('3')
    
    
            const balanceOf1 = await gameItems.balanceOf(signer.address, 1)
            const balanceOf3 = await gameItems.balanceOf(signer3.address, 3)
    
            expect(balanceOf1.toString()).to.be.equal('10')
            expect(balanceOf3.toString()).to.be.equal('2')
    
        })
        it('transfer some batch items', async () => {
            await gameItems.mint(20, 1)
            await gameItems.connect(signer2).mint(10, 2)
            await gameItems.connect(signer3).mint(5, 3)
            await gameItems.connect(signer3).mint(1, 4)
    
    
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
    
            expect(balanceOf3.toString()).to.be.equal('0')
            expect(balanceOf4.toString()).to.be.equal('0')
    
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

   
})