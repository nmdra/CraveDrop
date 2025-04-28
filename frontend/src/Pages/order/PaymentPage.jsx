import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js'
import axios from 'axios'

const stripePromise = loadStripe(
    'pk_test_51RErI8RaMVEyYN7k9JSNZHcktzyVq8fybSIc3KZshl2I2Iy5Q8VJcGgp716TC4MzTKySp7xsy5lrbVMh9gb0s0wb00dvEjXEc2'
)

function CheckoutForm({ clientSecret }) {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setLoading(true)

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                }
            )

            if (error) {
                console.error('Stripe error:', error.message)
                alert(error.message)
                setLoading(false)
                return
            }

            if (paymentIntent.status === 'succeeded') {
                try {
                    // Get stored order details from localStorage
                    const rawItems = JSON.parse(
                        localStorage.getItem('paymentItems')
                    )
                    const address = localStorage.getItem('paymentAddress')
                    const phone = localStorage.getItem('paymentPhone')
                    const paymentMethod = 'card' // Always card in the payment page

                    // Format items properly for backend
                    const formattedItems = rawItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    }))

                    console.log(
                        'Payment successful, creating order with data:',
                        {
                            userId: 'user-123',
                            items: formattedItems,
                            totalAmount: paymentIntent.amount / 100,
                            paymentMethod,
                            deliveryAddress: address,
                            phoneNumber: phone,
                        }
                    )

                    // Create order in backend
                    const response = await axios.post('/api/orders', {
                        userId: 'user-123',
                        items: formattedItems.map((item) => ({
                            ...item,
                            // Retrieve restaurantId from localStorage or use default
                            restaurantId:
                                localStorage.getItem(
                                    `restaurant_${item.productId}`
                                ) || 'default-restaurant',
                        })),
                        totalAmount: paymentIntent.amount / 100,
                        paymentMethod,
                        currency: paymentIntent.currency,
                        deliveryAddress: address,
                        phoneNumber: phone,
                    })

                    console.log('Order created successfully:', response.data)

                    // Clear all localStorage items
                    ;[
                        'cart',
                        'checkoutItems',
                        'paymentClientSecret',
                        'paymentItems',
                        'paymentAddress',
                        'paymentPhone',
                        'paymentMethod',
                    ].forEach((key) => localStorage.removeItem(key))

                    alert('Payment and Order Successful!')
                    navigate('/')
                } catch (error) {
                    console.error('Order creation failed after payment:', error)

                    if (error.response) {
                        console.error('Response data:', error.response.data)
                        console.error('Response status:', error.response.status)
                        console.error(
                            'Request that was sent:',
                            error.config.data
                        )

                        alert(
                            `Payment successful but order creation failed: ${error.response.data.message || error.message}`
                        )
                    } else {
                        alert(
                            `Payment successful but order creation failed: ${error.message}`
                        )
                    }
                }
            }
        } catch (stripeError) {
            console.error('Unexpected Stripe error:', stripeError)
            alert(`Payment processing error: ${stripeError.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto mt-10 max-w-md rounded border p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Complete Payment</h2>
            <form onSubmit={handleSubmit}>
                <CardElement
                    options={{ style: { base: { fontSize: '18px' } } }}
                />
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="mt-6 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </form>
        </div>
    )
}

function PaymentPage() {
    const [clientSecret, setClientSecret] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const secret = localStorage.getItem('paymentClientSecret')
        if (!secret) {
            alert('No payment client secret found.')
            navigate('/checkout')
        } else {
            setClientSecret(secret)
        }
    }, [navigate])

    if (!clientSecret) {
        return <div className="mt-10 text-center">Loading Payment...</div>
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm clientSecret={clientSecret} />
        </Elements>
    )
}

export default PaymentPage
