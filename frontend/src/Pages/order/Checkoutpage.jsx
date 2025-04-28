import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    setCheckoutItems(items);
  }, []);

  const totalAmount = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!address.trim() || !phone.trim()) {
      alert('Please fill address and phone number.');
      return;
    }

    if (checkoutItems.length === 0) {
      alert('No items selected for checkout.');
      return;
    }

    setLoading(true);

    try {
      // Format items the same way as in PaymentPage
      const orderItems = checkoutItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      if (paymentMethod === 'cash') {
        // Cash on delivery order creation
        const response = await axios.post('http://localhost:5000/api/orders', {
          userId: 'user-123',
          items: orderItems.map(item => ({
            ...item,
            // Retrieve restaurantId from localStorage or use default
            restaurantId: localStorage.getItem(`restaurant_${item.productId}`) || 'default-restaurant'
          })),
          paymentMethod,
          currency: 'usd',
          deliveryAddress: address,
          phoneNumber: phone,
          // Note: When using cash payment, backend calculates totalAmount
        });

        console.log('Order created:', response.data);
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutItems');
        navigate('/');
      } else if (paymentMethod === 'card') {
        // Create payment intent first
        const paymentResponse = await axios.post('http://localhost:5002/api/payments/create-payment-intent', {
          amount: Math.round(totalAmount * 100), // Convert to cents and ensure it's an integer
          currency: 'usd',
        });

        // Store necessary data for payment page
        localStorage.setItem('paymentItems', JSON.stringify(orderItems));
        localStorage.setItem('paymentAddress', address);
        localStorage.setItem('paymentPhone', phone);
        localStorage.setItem('paymentMethod', paymentMethod);
        localStorage.setItem('paymentClientSecret', paymentResponse.data.clientSecret);

        navigate('/payment');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        alert(`Error: ${error.response.data.message || 'Something went wrong. Please try again.'}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

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
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all border"
                >
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-700">Price: Rs {item.price}</p>
                  <p className="text-gray-700">Quantity: {item.quantity}</p>
                  <p className="font-semibold text-gray-800 mt-2">
                    Subtotal: Rs {item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Total Amount: Rs {totalAmount}</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Delivery Address:</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    placeholder="Enter your address"
                    className="w-full p-3 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Phone Number:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full p-3 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Payment Method:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-3 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash on Delivery</option>
                    <option value="card">Card Payment</option>
                  </select>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;