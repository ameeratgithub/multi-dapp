const { ethers } = require('hardhat')
const { expect } = require('chai').use(require('chai-as-promised'))

const ERC721e = require('../artifacts/contracts/standards/ERC721e.sol/ERC721e.json')

const _e = (amount) => {
    return ethers.utils.parseEther(amount.toString())
}

describe.only("Collections", () => {
    let collections, signer, signer2, signer3, tapp

    beforeEach(async () => {

        [signer, signer2, signer3] = await ethers.getSigners()

        const Tapp = await ethers.getContractFactory('Tapp')
        tapp = await Tapp.deploy()

        const Collections = await ethers.getContractFactory('Collections')
        collections = await Collections.deploy(tapp.address)
        await collections.deployed()

        await tapp.mint(_e(4000))
        await tapp.connect(signer2).mint(_e(4000))
        await tapp.connect(signer3).mint(_e(4000))

        // await tapp.approve(monuments.address, _e(4000));
        // await tapp.connect(signer2).approve(monuments.address, _e(4000));
        // await tapp.connect(signer3).approve(monuments.address, _e(4000));

    })

    describe("Success", () => {
        it('creates a collection', async () => {
            const tx1 = await collections.createCollection("collection name", "collection symbol", "banner uri", 0)
            const tx2 = await collections.createCollection("collection name1", "collection symbol1", "banner uri", 0)
            const tx3 = await collections.createCollection("collection name1", "collection symbol1", "banner uri", 0)

            await tx1.wait(1)
            await tx2.wait(1)
            await tx3.wait(1)

            const address1 = await collections.getCollection(1)
            const address2 = await collections.getCollection(2)
            const address3 = await collections.getCollection(3)

            expect(address1).to.be.a.string
            expect(address2).to.be.a.string
            expect(address3).to.be.a.string

            expect(address1 != address2 && address2 != address3 && address1 != address3).to.be.true
        })
        it('gets right collection owner', async () => {
            const tx1 = await collections.createCollection("collection name", "collection symbol", "banner uri", 0)
            const tx2 = await collections.connect(signer2).createCollection("collection name1", "collection symbol1", "banner uri", 0)
            const tx3 = await collections.connect(signer3).createCollection("collection name1", "collection symbol1", "banner uri", 0)

            await tx1.wait(1)
            await tx2.wait(1)
            await tx3.wait(1)

            const user1 = await collections.owner(1)
            const user2 = await collections.owner(2)
            const user3 = await collections.owner(3)

            expect(user1).to.equal(signer.address)
            expect(user2).to.equal(signer2.address)
            expect(user3).to.equal(signer3.address)

        })
        it('gets the properties of contract', async () => {
            const tx1 = await collections.createCollection("collection name", "collection symbol", "banner uri", 0)
            const tx2 = await collections.connect(signer2).createCollection("collection name1", "collection symbol1", "banner uri", 0)
            const tx3 = await collections.connect(signer3).createCollection("collection name2", "collection symbol2", "banner uri", 0)

            await tx1.wait(1)
            await tx2.wait(1)
            await tx3.wait(1)

            const collection1 = await collections.getCollection(1)
            const collection2 = await collections.getCollection(2)
            const collection3 = await collections.getCollection(3)

            const c1 = new ethers.Contract(collection1.collectionAddress, ERC721e.abi, signer)
            const c2 = new ethers.Contract(collection2.collectionAddress, ERC721e.abi, signer)
            const c3 = new ethers.Contract(collection3.collectionAddress, ERC721e.abi, signer)

            const c1Name = await c1.name()
            const c1Symbol = await c1.symbol()

            const c2Name = await c2.name()
            const c2Symbol = await c2.symbol()

            const c3Name = await c3.name()
            const c3Symbol = await c3.symbol()


            expect(c1Name).to.equal('collection name')
            expect(c1Symbol).to.equal('collection symbol')

            expect(c2Name).to.equal('collection name1')
            expect(c2Symbol).to.equal('collection symbol1')

            expect(c3Name).to.equal('collection name2')
            expect(c3Symbol).to.equal('collection symbol2')
        })
        it('gets the list of collections by user', async () => {
            const tx1 = await collections.connect(signer2).createCollection("collection name", "collection symbol", "banner uri", 0)
            const tx2 = await collections.connect(signer3).createCollection("collection name1", "collection symbol1", "banner uri", 0)
            const tx3 = await collections.createCollection("collection name2", "collection symbol2", "banner uri", 0)

            await tx1.wait(1)
            await tx2.wait(1)
            await tx3.wait(1)


            const collection1 = await collections.getCollection(1)
            const collection2 = await collections.getCollection(2)
            const collection3 = await collections.getCollection(3)

            const collections1 = await collections.getUserCollections(signer.address)
            const collections2 = await collections.getUserCollections(signer2.address)
            const collections3 = await collections.getUserCollections(signer3.address)

            expect(collections1[0].collectionAddress).to.equal(collection3.collectionAddress)
            expect(collections2[0].collectionAddress).to.equal(collection1.collectionAddress)
            expect(collections3[0].collectionAddress).to.equal(collection2.collectionAddress)
        })
        it('gets right contract owner', async () => {
            const [tx1, tx2, tx3] = await Promise.all([
                collections.createCollection("collection name", "collection symbol", "banner uri", 0),
                collections.connect(signer2).createCollection("collection name1", "collection symbol1", "banner uri", 0),
                collections.connect(signer3).createCollection("collection name1", "collection symbol1", "banner uri", 0)
            ])


            await Promise.all([
                tx1.wait(1),
                tx2.wait(1),
                tx3.wait(1)
            ])

            const [collection1, collection2, collection3] = await Promise.all([
                collections.getCollection(1),
                collections.getCollection(2),
                collections.getCollection(3)

            ])

            const c1 = new ethers.Contract(collection1.collectionAddress, ERC721e.abi, signer)
            const c2 = new ethers.Contract(collection2.collectionAddress, ERC721e.abi, signer)
            const c3 = new ethers.Contract(collection3.collectionAddress, ERC721e.abi, signer)

            const [owner1, owner2, owner3] = await Promise.all([
                c1.owner(),
                c2.owner(),
                c3.owner()
            ])

            expect(owner1).to.equal(signer.address)
            expect(owner2).to.equal(signer2.address)
            expect(owner3).to.equal(signer3.address)

        })
        it('adds existing contract to the collection', async () => {

            const Monuments = await ethers.getContractFactory('Monuments')
            const monuments = await Monuments.connect(signer2).deploy(tapp.address)
            const monuments2 = await Monuments.connect(signer3).deploy(tapp.address)
            const monuments3 = await Monuments.deploy(tapp.address)
            await monuments.deployed()
            await monuments2.deployed()
            await monuments3.deployed()

            const tx1 = await collections.connect(signer2).addCollection(monuments.address)
            const tx2 = await collections.connect(signer3).addCollection(monuments2.address)
            const tx3 = await collections.addCollection(monuments3.address)



            await Promise.all([
                tx1.wait(1),
                tx2.wait(1),
                tx3.wait(1)
            ])

            const [collection1, collection2, collection3] = await Promise.all([
                collections.getCollection(1),
                collections.getCollection(2),
                collections.getCollection(3)
            ])

            const c1 = new ethers.Contract(collection1.collectionAddress, ERC721e.abi, signer2)
            const c2 = new ethers.Contract(collection2.collectionAddress, ERC721e.abi, signer3)
            const c3 = new ethers.Contract(collection3.collectionAddress, ERC721e.abi, signer)

            let [owner1, owner2, owner3] = await Promise.all([
                c1.owner(),
                c2.owner(),
                c3.owner()
            ])

            expect(owner1).to.equal(signer2.address)
            expect(owner2).to.equal(signer3.address)
            expect(owner3).to.equal(signer.address)

            [owner1, owner2, owner3] = await Promise.all([
                collections.owner(1),
                collections.owner(2),
                collections.owner(3)
            ])

            expect(owner1).to.equal(signer2.address)
            expect(owner2).to.equal(signer3.address)
            expect(owner3).to.equal(signer.address)

        })
    })
    describe("Failure", () => {
        it('rejects other user to add the collection', async () => {

            const Monuments = await ethers.getContractFactory('Monuments')
            const monuments = await Monuments.connect(signer2).deploy(tapp.address)

            await monuments.deployed()

            const tx1 = collections.addCollection(monuments.address)

            await expect(tx1).to.eventually.be.rejectedWith("You're not the owner of contract")

        })
        it('rejects invalid contract (like EOA)', async () => {

            const Monuments = await ethers.getContractFactory('Monuments')
            const monuments = await Monuments.connect(signer2).deploy(tapp.address)

            await monuments.deployed()

            const tx1 = collections.addCollection(signer2.address)

            await expect(tx1).to.eventually.be.rejectedWith("Invalid contract")

        })
        it('rejects zero address', async () => {

            const tx1 = collections.addCollection('0x0000000000000000000000000000000000000000')

            await expect(tx1).to.eventually.be.rejectedWith("Invalid address")

        })
    })
})
