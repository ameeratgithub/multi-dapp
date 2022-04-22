import Head from 'next/head'
import ResponsiveAppBar from './Navbar'

export default function ({ children }) {
    return <>
        <Head>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </Head>
        <ResponsiveAppBar></ResponsiveAppBar>

        {children}
    </>
}