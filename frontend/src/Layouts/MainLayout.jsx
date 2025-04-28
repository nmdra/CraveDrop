import { Outlet } from 'react-router-dom'
import Footer from '../Components/Home/FooterDashboard'
import Header from '../Components/Home/Header'

function MainLayout() {
    return (
        <>
            <div className="bg-opacity-70 sticky top-0 z-50 bg-white shadow-md backdrop-blur-md">
                {/* <NewsBar /> */}
                <Header />
            </div>
            <Outlet />
            <div className="bg-opacity-70 sticky top-0 z-50 bg-white shadow-md backdrop-blur-md">
                <Footer />
            </div>
        </>
    )
}

export default MainLayout
