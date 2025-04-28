import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function HomePage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cartItemsCount, setCartItemsCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true)
                const res = await axios.get('/api/products')
                setProducts(res.data)
            } catch (err) {
                console.error('Failed to fetch products', err)
                setError('Failed to load products. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleViewDetails = (id) => {
        navigate(`/products/${id}`)
    }

    const handleNavigateToCart = () => {
        navigate('/cart')
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="max-w-md border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation with Cart Button */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex flex-shrink-0 items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                ShopEase
                            </h1>
                        </div>
                        <div className="ml-6 flex items-center">
                            <button
                                onClick={handleNavigateToCart}
                                className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                {cartItemsCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-red-500 px-2 py-1 text-xs leading-none font-bold text-white">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="px-4 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Our Products
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
                            Discover our premium collection
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                            >
                                <div className="flex h-48 items-center justify-center bg-gray-200">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            No image available
                                        </span>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-gray-900">
                                        {product.name}
                                    </h3>
                                    <p className="mb-4 line-clamp-2 text-gray-600">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">
                                            Rs {product.price.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleViewDetails(product._id)
                                            }
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && !isLoading && (
                        <div className="py-12 text-center">
                            <p className="text-lg text-gray-500">
                                No products available at the moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
