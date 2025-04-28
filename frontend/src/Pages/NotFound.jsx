import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import notFoundImage from '../assets/notFound.png' // Make sure to replace this with the actual image path

const NotFound = () => {
    useEffect(() => {
        document.title = 'FarmCart : Not Found'
    }, [])
    return (
        <section className="flex min-h-screen flex-col items-center justify-center bg-white">
            <div className="text-center">
                <img
                    src={notFoundImage}
                    alt="404 illustration"
                    className="mx-auto mb-8 w-full max-w-md"
                />
                <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
                    Oops! Page not found
                </h1>

                <p className="mb-6 text-gray-600">
                    Not to worry,
                    <br />
                    why don't you try one of these helpful links
                </p>
                <Link
                    to="/"
                    className="inline-block rounded-full bg-green-600 px-6 py-2 text-white transition-all duration-300 hover:bg-green-700"
                >
                    Back to Home
                </Link>
                <Link
                    to="/"
                    className="ml-4 inline-block rounded-full bg-green-600 px-6 py-2 text-white transition-all duration-300 hover:bg-green-700"
                >
                    Blog
                </Link>
                <Link
                    to="/"
                    className="ml-4 inline-block rounded-full bg-green-600 px-6 py-2 text-white transition-all duration-300 hover:bg-green-700"
                >
                    Support
                </Link>
            </div>
        </section>
    )
}

export default NotFound
