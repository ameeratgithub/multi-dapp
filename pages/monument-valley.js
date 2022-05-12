import { Button, Grid, Stack, Typography, Modal } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../components/layout"
import { loadMetadata } from "../utils/ipfs"
import NFTItem from "../components/NFTItem"
import MintingForm from "../components/MintingForm"

export default ({ jsonUrls }) => {
    const [json, setJson] = useState([])
    const [openMintingModal, setOpenMintingModal] = useState(true)
    const [estimatePrice, setEstimatePrice] = useState('')

    useEffect(() => {
        loadData()
    }, [])
    const loadData = async () => {
        const jsonArray = await Promise.all(jsonUrls.map(u => loadMetadata(u)))

        setTimeout(() => {
            setJson(jsonArray)
        }, 300)
    }

    return <Layout>
        <Modal open={openMintingModal} onClose={() => setOpenMintingModal(false)}>
            <MintingForm></MintingForm>
        </Modal>
        <Stack>
            <Grid container direction="row" justifyContent="space-between" sx={{ mt: '20px' }}>
                <Typography variant="h5">Monument Valley Collection</Typography>
                <Button variant="contained" color="success"
                    onClick={e => setOpenMintingModal(true)}>Mint Custom NFT</Button>
            </Grid>
            <Grid container spacing={12} sx={{ mt: '1px', mb: '40px' }}>
                {json.map(j => <Grid item xs={12} md={12} lg={6} xl={6} key={j.name}>
                    <NFTItem nft={j} ></NFTItem>
                </Grid>)}
            </Grid>
        </Stack>
    </Layout>
}

export async function getServerSideProps() {
    // const { IPFS_GATEWAY, MV_JSON_HASH } = process.env
    // const baseUrl = IPFS_GATEWAY + MV_JSON_HASH
    const baseUrl = process.env.WEB_STORAGE_PATH
    const jsonUrls = Array(16).fill(1).map((v, i) => {
        return baseUrl + `${i + 1}.json`
    })

    return {
        props: {
            jsonUrls
        }
    }
}