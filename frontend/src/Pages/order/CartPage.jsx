import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, []);

  const handleCheckboxChange = (item) => {
    const isSelected = selectedItems.some((i) => i._id === item._id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Add function to update quantity
  const updateQuantity = (itemId, newQuantity) => {
    // Don't allow quantities less than 1
    if (newQuantity < 1) return;
    
    // Update cart items state
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedCart);
    
    // Update selected items if this item is selected
    if (selectedItems.some(item => item._id === itemId)) {
      setSelectedItems(prevSelected => 
        prevSelected.map(item => {
          if (item._id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Add function to remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    setSelectedItems(selectedItems.filter(item => item._id !== itemId));
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to checkout.');
      return;
    }
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <p className="text-xl">Your cart is empty.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item, index) => {
                const isSelected = selectedItems.some((i) => i._id === item._id);
                return (
                  <div 
                    key={index}
                    className={`flex items-center bg-white p-6 rounded-lg shadow hover:shadow-lg transition-all ${
                      isSelected ? 'border-2 border-blue-500' : 'border'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(item)}
                      className="w-5 h-5 mr-4 accent-blue-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Price: <span className="font-medium">Rs {item.price}</span></p>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center mt-3 mb-2">
                        <span className="text-gray-600 mr-2">Quantity:</span>
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                          className="w-12 h-8 text-center border-y border-gray-200 focus:outline-none"
                        />
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r-md hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="text-gray-700 font-semibold mt-2">Subtotal: Rs {item.price * item.quantity}</p>
                    </div>
                    
                    {/* Remove button */}
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-white rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Total for selected: Rs {totalAmount}
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full md:w-auto px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Continue Shopping
                </button>
                
                <button
                  onClick={handleProceedToCheckout}
                  disabled={selectedItems.length === 0}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg transition-all ${
                    selectedItems.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                  }`}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
