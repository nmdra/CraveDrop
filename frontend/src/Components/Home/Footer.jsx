import { FaFacebookSquare } from 'react-icons/fa'
import { FaTiktok } from 'react-icons/fa'
import { FaMedium } from 'react-icons/fa6'
import logo from '../../assets/logo.png'

const Footer = () => {
    return (
        <div className="mx-auto max-w-7xl pt-[1rem] pb-3">
            <hr className="my-2" />
            <div className="grid grid-cols-2 pt-4 pb-8 md:grid-cols-4">
                <div>
                    <img src={logo} alt="Logo" width={160} height={160} />
                </div>
                <div></div>
                <div className="flex flex-col gap-y-4">
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Get Help
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Add your Shop
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Sign up to Deliver
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Create a Business Account
                    </p>
                </div>
                <div className="flex flex-col gap-y-4">
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Shops near me
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        View all cities
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        Pickup near me
                    </p>
                    <p className="hover:cursor-pointer hover:text-[#b8f724] hover:underline">
                        About Farm cart
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer
