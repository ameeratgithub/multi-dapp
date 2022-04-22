import { Container } from '@mui/material'
import ResponsiveAppBar from './Navbar'

export default function ({ children }) {
    return <>
        <ResponsiveAppBar></ResponsiveAppBar>
        <Container>
            {children}
        </Container>
    </>
}