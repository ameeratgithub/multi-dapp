import "../styles/index.css"
import Web3Provider from "../utils/web3-context"

function MyApp({ Component, pageProps }) {
  return <Web3Provider>
    <Component {...pageProps} />
  </Web3Provider>
}

export default MyApp
