import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material"
import Link from 'next/link';
export default ({ image, heading, description, href }) => {
    return <Link href={href} passHref>
        <Card>
            <CardActionArea>
                <CardMedia height="340" component="img" image={image} />
                <CardContent>
                    <Typography variant="h5">
                        {heading}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </Link>


}