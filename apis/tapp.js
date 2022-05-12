// import { ethers } from 'ethers'

import { getTappContract } from '../utils/ethers'



export const getUserBalance = (address, signer, tappAddress) => {
    const tapp = getTappContract(signer, tappAddress)
    return tapp.balanceOf(address)
}
export const getLimit =  (signer, tappAddress) => {
    const tapp = getTappContract(signer, tappAddress)
    return tapp.currentBalanceLimit()
}

export const mint = (amount, signer, tappAddress) => {
    const tapp = getTappContract(signer, tappAddress)
    return tapp.mint(amount)
}