import { Card, CardContent, CardHeader, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, ListSubheader, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import Layout from "../components/layout"
import { loadMetadata } from "../utils/ipfs"
import Image from "next/image"
import InfoIcon from '@mui/icons-material/Info';
import NFTItem from "../components/NFTItem"

export default ({ jsonUrls }) => {
    const [json, setJson] = useState([])

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
        <Grid container spacing={12} sx={{ mt: '20px', mb:'40px' }}>
            {json.map(j => <Grid item xs={12} md={12} lg={6} xl={6} key={j.name}>
                <NFTItem nft={j} ></NFTItem>
            </Grid>)}
        </Grid>


        {/* <ImageList>
            <ImageListItem key="header" cols={2}>
                <ListSubheader component="div">Monument Valley Collection</ListSubheader>
            </ImageListItem>
            {json.map((item) => (
                <ImageListItem key={item.image}>
                    <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        height="600"
                        width="300"
                    />
                    <ImageListItemBar
                        title={item.name}
                        subtitle={item.description}
                        actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                            >
                                <InfoIcon />
                            </IconButton>
                        }
                    />
                </ImageListItem>
            ))}
        </ImageList> */}
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