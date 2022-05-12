import { Button, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material"
import { styled } from "@mui/system"


const NFTImage = styled('img')({
    width: '230px',
    height: '350px',
    position: 'absolute',
    top: '-25px',
    left: '-175px',
    borderRadius: '10px',
    boxShadow: '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 5px 8px 0px rgb(0 0 0 / 14%), 0px 1px 14px 0px rgb(0 0 0 / 12%)'

})
export const AttributeBar = ({ value, title }) => {
    return <Stack spacing={1} sx={{ mt: '10px' }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <LinearProgress value={value * 10} variant="determinate" sx={{ width: '70%' }} />
            <Chip label={value} size="small" sx={{ position: 'absolute', right: '5%' }}/>
        </Grid>
    </Stack>
}
export default ({ nft }) => {
    return <Paper sx={{ width: '300px', pl: '75px', position: 'relative', left: '175px' }} elevation={5}>
        <Stack direction="row">
            <NFTImage src={nft.image} alt={nft.name} sx={{ boxShadow: 4 }} />
            <Stack sx={{ padding: '10px', pt: '15px' }}>
                <Typography variant="h6" >{nft.name}</Typography>
                <Typography variant="body2" sx={{ mt: '10px', mb: '10px' }}>{nft.description}</Typography>
                {nft.attributes.map(
                    a => a.type == "bar" && <AttributeBar value={a.value} title={a.title} key={a.title} />
                )}
                <Button variant="contained" size="small" sx={{ mt: '20px' }}>Mint</Button>
            </Stack>
        </Stack>
    </Paper>
}