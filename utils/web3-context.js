import CoinbaseWalletSDK from "@coinbase/wallet-sdk"
import WalletConnectProvider from "@walletconnect/web3-provider"
import { ethers } from "ethers"
import { createContext, useContext, useEffect, useState } from "react"
import Web3Modal from 'web3modal'



const Web3Context = createContext()
const Web3UpdateContext = createContext()

let web3Modal

export const useWeb3 = () => {
    return useContext(Web3Context)
}
export const useWeb3Update = () => {
    return useContext(Web3UpdateContext)
}

const getDesiredChainId = () => {
    if (process) {
        const { NEXT_PUBLIC_APP_ENV, NEXT_PUBLIC_DEV_CHAINID, NEXT_PUBLIC_REL_CHAINID } = process.env
        const chainId = NEXT_PUBLIC_APP_ENV == 'development' ? NEXT_PUBLIC_DEV_CHAINID : NEXT_PUBLIC_REL_CHAINID
        return Number(chainId)
    }
    return 0;
}
const initializeWeb3Modal = () => {
    const providerOptions = {
        walletlink: {
            package: CoinbaseWalletSDK,
            options: {
                appName: 'Mumbai',
                rpc: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_KEY}`
            }
        },
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                appName: 'Mumbai',
                // rpc: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_MUMBAI_KEY}`
                rpc: {
                    137: 'https://matic-mumbai.chainstacklabs.com'
                }
            }
        }
    }

    web3Modal = new Web3Modal({
        network: 'matic',
        cacheProvider: true,
        providerOptions
    })

}

function switchNetwork() {
    console.log("Switching Network")
    const provider = window.ethereum
    if (provider) {
        const chainId = ethers.utils.hexlify(getDesiredChainId())
        console.log("Hex chain Id", chainId)
        try {
            provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId}]
            })
            return true
        } catch (error) {
            if (error.code === 4902) {
                provider.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                        chainId,
                        rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                        chainName: "Mumbai Testnet",
                        nativeCurrency: {
                            name: "MATIC",
                            symbol: "MATIC",
                            decimals: 18
                        },
                        blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                    }]
                });
                return true
            }
            console.log("Failed to switch network")
            return false
        }
    }
    return false
}


export default ({ children }) => {
    const [context, setContext] = useState({ provider: null, signer: null, address: '' })

    useEffect(async () => {
        initializeWeb3Modal()
        if (window) loadAccount()
    }, [])

    const loadAccount = async () => {
        let provider, signer
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

        } else {
            const item = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");

            if (!item) return

            const cachedProviderName = JSON.parse(item)

            const connector = web3Modal.providerController.providers.filter(p => p.id == cachedProviderName)[0].connector

            const options = web3Modal.providerController.providerOptions[cachedProviderName]

            const proxy = await connector(options.package, options.options)

            provider = new ethers.providers.Web3Provider(proxy)

        }


        signer = provider.getSigner()

        try {
            const address = await signer.getAddress()
            const { chainId } = await provider.getNetwork()

            const desiredChainId = getDesiredChainId()
            console.log(chainId, desiredChainId)
            if (chainId !== desiredChainId) return switchNetwork()

            setContext({ provider, signer, address })
        } catch (err) {
            console.log(err)
        }

    }

    const connect = async () => {

        try {

            const instance = await web3Modal.connect()

            const provider = new ethers.providers.Web3Provider(instance)
            const signer = provider.getSigner()
            const address = await signer.getAddress()

            const desiredChainId = getDesiredChainId()
            console.log(chainId, desiredChainId)
            if (chainId !== desiredChainId) return switchNetwork()

            setContext({ provider, signer, address })
        }
        catch (err) { }
    }

    return <Web3Context.Provider value={context}>
        <Web3UpdateContext.Provider value={connect}>
            {children}
        </Web3UpdateContext.Provider>
    </Web3Context.Provider>

}