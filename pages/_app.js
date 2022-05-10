import NextNProgress from "nextjs-progressbar"
import "../styles/index.css"
import Web3Provider from "../utils/web3-context"

function MyApp({ Component, pageProps }) {
  return <Web3Provider>
    <NextNProgress color="#EF6D6D" />
    <Component {...pageProps} />
  </Web3Provider>
}

export default MyApp
