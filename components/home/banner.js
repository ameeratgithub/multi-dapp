import { Button, Container, Divider, Grid, Typography } from "@mui/material"
import Image from "next/image"
import pic from '../../assets/images/bc-iso.jpg'
const Banner = ({ }) => {
    return <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Grid item xs={4}>
            <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', minHeight: '300px' }}>
                <Typography
                    variant="h4"
                    sx={{mb:'10px'}}
                >
                    Multi Dapp
                </Typography>
                <Divider/>
                <Typography
                    variant="p"
                    sx={{ mt: '20px', lineHeight:'1.6' }}
                >
                    Explore multiple dapps, inter-connected to each other, demonstrating potential of blockchain
                </Typography>
                <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: '30px' }}>
                    <Button variant="outlined" sx={{ width: '40%' }}>
                        Connect
                    </Button>
                    <Button variant="contained" sx={{ width: '40%' }}>
                        Explore
                    </Button>
                </Container>
            </Container>
        </Grid>
        <Grid item xs={8}>
            <Image src={pic} alt="Blockchain, Dapps" />
        </Grid>


    </Grid>
}

export default Banner;