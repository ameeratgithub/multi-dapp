import { Button, Container, Divider, Grid, Typography } from "@mui/material"
import Image from "next/image"
import React, { useContext, useState } from "react"
import pic from '../../assets/images/bc-iso.jpg'
import { useWeb3, useWeb3Update } from "../../utils/web3-context"


const Banner = () => {
    const { signer, provider, address } = useWeb3()
    console.log("Signer Address: ", address)

    const connect = useWeb3Update()

    return <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid item md={6} lg={4}>
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', minHeight: '300px' }}>
                <Typography
                    variant="h4"
                    sx={{ mb: '10px' }}
                >
                    Multi Dapp
                </Typography>
                <Divider />
                <Typography
                    variant="p"
                    sx={{ mt: '20px', lineHeight: '1.6' }}
                >
                    Explore multiple dapps, inter-connected to each other, demonstrating potential of blockchain
                </Typography>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: '30px' }}>
                    {address?'':<Button variant="outlined" sx={{ width: '35%' }} onClick={connect}>
                        Connect
                    </Button>}
                    <Button variant="contained" sx={{ width: '55%' }}>
                        Get Started
                    </Button>
                </Container>
            </Container>
        </Grid>
        <Grid item md={6} lg={8}>
            <Image src={pic} alt="Blockchain, Dapps" />
        </Grid>


    </Grid>
}

export default Banner;