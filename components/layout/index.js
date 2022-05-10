import { Alert, Container, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { useWeb3 } from '../../utils/web3-context'
import ResponsiveAppBar from './Navbar'

export default function ({ children }) {

    const [isOpen, setIsOpen] = useState(false)
    const [count, setCount] = useState(0)

    const { signer, provider, address } = useWeb3()

    useEffect(() => {
        if (count > 3) return

        setTimeout(() => {
            setCount(c => {
                console.log(c, address)
                if (c > 0 && !address && !isOpen)
                    setIsOpen(true)
                return c + 1;
            })
        }, 1000)
    })


    const handleClose = () => {
        setIsOpen(false)
    }

    return <>
        

        <ResponsiveAppBar></ResponsiveAppBar>
        

        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isOpen}
            onClose={handleClose} autoHideDuration={6000}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                Your wallet is not connected
            </Alert>
        </Snackbar>
        <Container>
            {children}
        </Container>
    </>
}