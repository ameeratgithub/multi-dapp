import { Card, CardActionArea, CardMedia } from "@mui/material"

export default ({image})=>{
    return <Card>
        <CardActionArea>
            <CardMedia component="img" image={image}></CardMedia>
        </CardActionArea>
    </Card>
}