import { ethers } from 'ethers'

const TappJSON = require('../ethereum/artifacts/contracts/Tapp.sol/Tapp.json')

export const _e = (wei) => Number(ethers.utils.formatEther(wei))
export const _w = (ether) => ethers.utils.parseEther(ether)

export const getTappContract = (signer, tappAddress) => {
    return new ethers.Contract(tappAddress, TappJSON.abi, signer)
}