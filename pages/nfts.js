import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../components/layout"
import NFTCard from "../components/nfts/NFTCard"
import { loadImageFromMetadata } from "../utils/ipfs"

export default ({ baseUrl }) => {
    const [mvImage, setMVImage] = useState('')

    useEffect(() => {
        loadMVImage()
    }, [])
    const loadMVImage = async () => {
        const img = await loadImageFromMetadata(baseUrl + "/15.json");
        setMVImage(img)
        console.log(img)
    }
    return <Layout>
        <Container sx={{ display: 'flex', mt: '40px' }}>
            <NFTCard image={mvImage}></NFTCard>
        </Container>
    </Layout>
}

export async function getServerSideProps() {
    const { IPFS_GATEWAY, MV_JSON_HASH } = process.env
    return {
        props: {
            baseUrl: IPFS_GATEWAY + MV_JSON_HASH
        }
    }
}