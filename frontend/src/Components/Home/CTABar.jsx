import { Link } from 'react-router-dom'

const CTABar = () => {
    return (
        <div className="mx-auto flex items-center justify-center gap-10 bg-[#faffe5] py-3 text-center">
            <p className="text-xl">
                Connect with us today to earn extra income.
            </p>
            <Link to="/login">
                <button className="rounded-lg border border-black px-4 py-2 text-xs hover:bg-[#b8f724]">
                    Click Here
                </button>
            </Link>
        </div>
    )
}

export default CTABar
