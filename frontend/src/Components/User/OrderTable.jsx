import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCheckCircle } from 'react-icons/fi'

// Function to get badge color based on the order status
const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'bg-yellow-100 text-yellow-700'
        case 'processing':
            return 'bg-green-100 text-green-700'
        case 'cancelled':
            return 'bg-red-100 text-red-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const OrderTable = ({ orders }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [ordersPerPage] = useState(5)
    const [filterStatus, setFilterStatus] = useState('all')

    // Filter orders based on selected status
    const filteredOrders =
        filterStatus === 'all'
            ? orders
            : orders.filter(
                  (order) =>
                      order.status.toLowerCase() === filterStatus.toLowerCase()
              )

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder
    )

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    if (!orders.length) {
        return <p className="text-gray-500">No orders found.</p>
    }

    return (
        <div>
            {/* Filters */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <label htmlFor="statusFilter" className="mr-2 text-sm">
                        Filter by Status:
                    </label>
                    <select
                        id="statusFilter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2"
                    >
                        <option value="all">All</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Pagination */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-md bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {currentPage} of{' '}
                        {Math.ceil(filteredOrders.length / ordersPerPage)}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={
                            currentPage ===
                            Math.ceil(filteredOrders.length / ordersPerPage)
                        }
                        className="rounded-md bg-gray-200 px-3 py-2 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
                    <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Order ID
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Total
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr
                                key={order.orderId}
                                className="border-b border-gray-200 bg-white hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900">
                                    {order.orderId}
                                </td>
                                <td className="px-6 py-4">
                                    Rs.{order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm ${getStatusBadgeColor(order.status)}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/orders/${order.orderId}`}
                                        className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                                    >
                                        <FiCheckCircle />
                                        View Order
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderTable
