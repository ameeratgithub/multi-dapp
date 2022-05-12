const { ethers } = require("ethers");

require('dotenv').config()

const provider = new ethers.providers.InfuraProvider('rinkeby', process.env.INFURA_RINKEBY_ID)

async function events() {
    const blockNumber = await provider.getBlockNumber()
    const block = await provider.getBlockWithTransactions(blockNumber)
    console.log(block.transactions.length)
    block.transactions.forEach(async (t, i) => {
        // if (i > 0) return
        try {
            const r = await t.wait(1)
            const code = await provider.getCode(r.to)
            if (code != '0x') {
                console.log(code.substring(0, 10))
                console.log(r.logs)
            }
        } catch (err) {
            // console.log("Error Occured")
            // console.log(err)
        }
        // let code
        // try {
        //     code = await provider.getCode(r.to)
        //     console.log("code", code.substring(0,10))
        // } catch (err) {}

        // console.log(r.logs.topics[1])
    })

}

events().then().catch()