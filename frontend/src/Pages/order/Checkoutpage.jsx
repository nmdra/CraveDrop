import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function CheckoutPage() {
    const [checkoutItems, setCheckoutItems] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('checkoutItems')) || []
        setCheckoutItems(items)
    }, [])

    const totalAmount = checkoutItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    const handlePlaceOrder = async () => {
        if (!address.trim() || !phone.trim()) {
            alert('Please fill address and phone number.')
            return
        }

        if (checkoutItems.length === 0) {
            alert('No items selected for checkout.')
            return
        }

        setLoading(true)

        try {
            // Format items the same way as in PaymentPage
            const orderItems = checkoutItems.map((item) => ({
                productId: item._id,
                quantity: item.quantity,
            }))

            if (paymentMethod === 'cash') {
                // Cash on delivery order creation
                const response = await axios.post('/api/orders', {
                    userId: 'user-123',
                    items: orderItems.map((item) => ({
                        ...item,
                        // Retrieve restaurantId from localStorage or use default
                        restaurantId:
                            localStorage.getItem(
                                `restaurant_${item.productId}`
                            ) || 'default-restaurant',
                    })),
                    paymentMethod,
                    currency: 'usd',
                    deliveryAddress: address,
                    phoneNumber: phone,
                    // Note: When using cash payment, backend calculates totalAmount
                })

                console.log('Order created:', response.data)
                alert('Order placed successfully!')
                localStorage.removeItem('cart')
                localStorage.removeItem('checkoutItems')
                navigate('/')
            } else if (paymentMethod === 'card') {
                // Create payment intent first
                const paymentResponse = await axios.post(
                    '/api/payments/create-payment-intent',
                    {
                        amount: Math.round(totalAmount * 100), // Convert to cents and ensure it's an integer
                        currency: 'usd',
                    }
                )

                // Store necessary data for payment page
                localStorage.setItem('paymentItems', JSON.stringify(orderItems))
                localStorage.setItem('paymentAddress', address)
                localStorage.setItem('paymentPhone', phone)
                localStorage.setItem('paymentMethod', paymentMethod)
                localStorage.setItem(
                    'paymentClientSecret',
                    paymentResponse.data.clientSecret
                )

                navigate('/payment')
            }
        } catch (error) {
            console.error('Error placing order:', error)

            if (error.response) {
                console.error('Response data:', error.response.data)
                console.error('Response status:', error.response.status)
                alert(
                    `Error: ${error.response.data.message || 'Something went wrong. Please try again.'}`
                )
            } else {
                alert('Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-10">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    Checkout
                </h1>

                {checkoutItems.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>No items to checkout.</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {checkoutItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-white p-6 shadow transition-all hover:shadow-lg"
                                >
                                    <h3 className="text-xl font-semibold">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-700">
                                        Price: Rs {item.price}
                                    </p>
                                    <p className="text-gray-700">
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="mt-2 font-semibold text-gray-800">
                                        Subtotal: Rs{' '}
                                        {item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 rounded-lg bg-white p-6 shadow">
                            <h2 className="mb-6 text-2xl font-bold">
                                Total Amount: Rs {totalAmount}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Delivery Address:
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        rows="3"
                                        placeholder="Enter your address"
                                        className="w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Phone Number:
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="Enter phone number"
                                        className="w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block font-medium text-gray-700">
                                        Payment Method:
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="cash">
                                            Cash on Delivery
                                        </option>
                                        <option value="card">
                                            Card Payment
                                        </option>
                                    </select>
                                </div>

                                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading
                                            ? 'Placing Order...'
                                            : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CheckoutPage
