const { Web3Storage, getFilesFromPath } = require("web3.storage");

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVjRWM2RjZjOTY2N0Y5ODU2MjUwYTIyZTc3QzhkYTM1MkYwMGRhQzgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIxNjAyNzQ5MDEsIm5hbWUiOiJORlQgTWFya2V0cGxhY2UgVG9rZW4ifQ.XNtGQMCrNbS7LwQMdEfJQJMsxvOTUFtnJIha0hMhuhc'

const client = new Web3Storage({ token })

async function storeFiles() {
    // const files = await getFilesFromPath('C:\\Users\\Ameer Hamza\\Pictures\\MV\\images')
    const files = await getFilesFromPath('C:\\Users\\Ameer Hamza\\Pictures\\MV\\web.storage json')
    const cid = await client.put(files)
    console.log("CID=", cid)
}

storeFiles().then(() => {
    console.log("Files stored")
}).catch(err => { console.log("Error occured", err) })