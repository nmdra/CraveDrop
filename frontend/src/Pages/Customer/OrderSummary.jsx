import { useParams } from 'react-router-dom'
import { FiPackage, FiCalendar, FiClock, FiDollarSign } from 'react-icons/fi'
import { orders } from '../../mock/order' // adjust path accordingly

function OrderSummary() {
    const { orderId } = useParams()
    const order = orders.find((o) => o.orderId === orderId)

    if (!order) {
        return <div className="p-6 text-red-500">Order not found.</div>
    }

    return (
        <div className="mx-auto max-w-5xl rounded-lg bg-white p-12 shadow-lg">
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                <FiPackage className="text-xl" />
                Order Summary
            </h1>
            <div className="mb-4 text-gray-600">
                <div className="flex justify-between">
                    <span className="font-medium">Order ID:</span>
                    <span>{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span className="flex items-center gap-2">
                        <FiCalendar className="text-sm" />
                        {new Date(order.createdAt).toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="text-sm text-blue-600 capitalize">
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="mb-4 border-t pt-4">
                {order.items.map((item, idx) => (
                    <div
                        key={idx}
                        className="mb-4 flex items-center justify-between rounded-md border p-3"
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold">
                                Product ID: {item.productId}
                            </span>
                            <span className="text-gray-500">
                                Quantity: {item.quantity}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold text-gray-800">
                                Rs.{item.price}
                            </div>
                            <span className="text-sm text-gray-500">Price</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <div className="text-xl text-green-600">
                    <FiDollarSign className="mr-1 inline" />
                    Rs.{order.total}
                </div>
            </div>
        </div>
    )
}

export default OrderSummary
