import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Loading from '../../Components/User/Loading'
import {
    FiLogOut,
    FiSettings,
    FiPackage,
    FiShoppingCart,
    FiMapPin,
    FiX,
    FiBell,
} from 'react-icons/fi'
import { orders as mockOrders } from '../../mock/order'

// Initialize mock adapter
const mock = new MockAdapter(axios, { delayResponse: 1000 })
mock.onGet('/api/orders').reply(200, mockOrders)
mock.onAny().passThrough()

// Fetcher
const fetcher = (url) =>
    axios
        .get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((res) => res.data.user)

function Dashboard() {
    const [showBanner, setShowBanner] = useState(true)

    const {
        data: user,
        error,
        isLoading,
    } = useSWR('/api/user/', fetcher, {
        dedupingInterval: 5 * 60 * 1000,
    })

    const {
        data: orders,
        isLoading: ordersLoading,
        error: ordersError,
    } = useSWR('/api/orders', (url) => axios.get(url).then((res) => res.data))

    if (error) {
        return (
            <div className="mt-10 text-center text-red-500">
                Failed to load user data. Please try again.
            </div>
        )
    }

    if (isLoading || !user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-neutral-100 p-6">
            {showBanner && (
                <div className="mb-4 flex items-start justify-between rounded-lg border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-800">
                    <div className="flex items-start gap-2">
                        <FiBell className="mt-1 text-xl" />
                        <div>
                            <p className="font-medium">Notice</p>
                            <p className="text-sm">
                                Your recent order has been shipped! Track your
                                orders from the{' '}
                                <Link
                                    to="/orders"
                                    className="font-semibold text-yellow-700 underline"
                                >
                                    orders page
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="mt-1 ml-4 text-yellow-700 hover:text-yellow-900"
                    >
                        <FiX className="text-lg" />
                    </button>
                </div>
            )}

            <h1 className="mb-6 text-2xl font-bold text-gray-800">
                My Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Profile Card */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center space-x-4">
                        <img
                            src={user.pic}
                            alt="Profile"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">
                                {user.firstname} {user.lastname}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                            {user.birthday && (
                                <p className="text-sm text-gray-400">
                                    🎂 {new Date(user.birthday).toDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between gap-2">
                        <Link
                            to="/settings"
                            className="text-sm text-green-600 hover:underline"
                        >
                            <FiSettings className="mr-1 inline" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Address Card */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="text-sm font-semibold text-gray-500">
                        DEFAULT ADDRESS
                    </h3>
                    {user?.address && user?.address.street ? (
                        <>
                            <p className="mt-2 text-gray-700">
                                {user.firstname} {user.lastname}
                            </p>
                            <p className="text-gray-500">
                                {user.address.street}, {user.address.city},{' '}
                                {user.address.country}
                                <br />
                                Postal Code: {user.address.postalCode}
                                <br />
                                {user.mobileNumbers?.[0]?.number ||
                                    'No mobile number'}
                            </p>
                            <Link
                                to="/settings"
                                className="text-sm text-green-600 hover:underline"
                            >
                                <FiMapPin className="mr-1 inline" />
                                Edit Address
                            </Link>
                        </>
                    ) : (
                        <div>
                            <p className="mt-2 text-red-500">
                                Complete your profile by adding an address.
                            </p>
                            <Link to="/settings">
                                <button
                                    type="button"
                                    className="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                    Click here
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg bg-white p-4 shadow">
                    <h3 className="mb-2 text-sm font-semibold text-gray-500">
                        QUICK LINKS
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-green-600">
                        <Link to="/cart" className="hover:underline">
                            <FiShoppingCart className="mr-1 inline" />
                            View Cart
                        </Link>
                        <Link to="/orders" className="hover:underline">
                            <FiPackage className="mr-1 inline" />
                            View My Orders
                        </Link>
                        <Link to="/settings" className="hover:underline">
                            <FiSettings className="mr-1 inline" />
                            Account Settings
                        </Link>
                        <button className="text-left text-red-500 hover:underline">
                            <FiLogOut className="mr-1 inline" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Recent Orders
                </h2>
                {ordersLoading ? (
                    <p className="text-gray-500">Loading orders...</p>
                ) : ordersError ? (
                    <p className="text-red-500">
                        Failed to load recent orders.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {mockOrders.slice(0, 2).map((order) => (
                            <Link
                                key={order.orderId}
                                to={`/orders/${order.orderId}`}
                                className="block rounded-lg border p-4 hover:shadow"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <p className="font-medium">
                                            Order #{order.orderId}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="text-sm text-blue-600 capitalize">
                                        {order.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">
                                    Total: Rs.{order.total}
                                </p>
                            </Link>
                        ))}

                        <div className="pt-2">
                            <Link
                                to="/orders"
                                className="inline-block rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                View All Orders
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
