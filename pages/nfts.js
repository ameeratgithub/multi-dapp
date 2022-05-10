import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../components/layout"
import NFTCard from "../components/nfts/NFTCard"
import { loadImageFromMetadata } from "../utils/ipfs"

export default ({ mvImage }) => {
    const mv = {
        heading: 'Monument Valley Collection',
        description: 'Monument valley is beautifully designed challenging puzzle game which has received many awards'
    }
    
    return <Layout>
        <Container sx={{ display: 'flex', mt: '40px' }}>
            <NFTCard image={mvImage} heading={mv.heading} description={mv.description} href="/monument-valley" />
        </Container>
    </Layout>
}

export async function getServerSideProps() {
    // const { IPFS_GATEWAY, MV_JSON_HASH } = process.env
    // const baseUrl = IPFS_GATEWAY + MV_JSON_HASH
    const baseUrl = process.env.WEB_STORAGE_PATH
    
    const mvImage = await loadImageFromMetadata(baseUrl + "15.json");
    return {
        props: {
            mvImage
        }
    }
}