import { useEffect } from 'react'
import CTABar from '../Components/Home/CTABar'
import Hero from '../Components/Home/Hero'
import ShopList from '../Components/Home/ShopList'
import Footer from '../Components/Home/Footer'
import ProcessCTA from '../Components/Home/ProcessCTA'

const Homepage = () => {
    useEffect(() => {
        document.title = 'CraveDrop : Home'
    }, [])

    return (
        <>
            <Hero />
            <ProcessCTA />
            <CTABar />
            <ShopList />
            <Footer />
        </>
    )
}

export default Homepage
