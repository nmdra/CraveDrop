import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Add this state for quantity
  const [quantity, setQuantity] = useState(1);

  // Memoized fetch function
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product', err);
      setError('Failed to load product details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    try {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItemIndex = cart.findIndex((item) => item._id === product._id);

      if (existingItemIndex !== -1) {
        // If product already in cart, add the new quantity to the existing one
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Otherwise add new product with selected quantity
        cart.push({ ...product, quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Store restaurantId for this product separately for easy access when creating orders
      localStorage.setItem(`restaurant_${product._id}`, product.restaurantId || 'default-restaurant');
      
      alert(`${product.name} added to cart!`);
      navigate('/cart');
    } catch (err) {
      alert('Failed to add to cart');
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to products
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden lg:flex">
          {/* Product Image */}
          <div className="lg:w-1/2 bg-gray-100 flex items-center justify-center p-8">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-96 w-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-gray-400 text-center">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>No image available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 ml-2">(24 reviews)</span>
            </div>

            <p className="text-2xl font-bold text-gray-900 mb-6">
              Rs {product.price.toLocaleString()}
            </p>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Details</h2>
              <ul className="list-disc pl-5 text-gray-600">
                <li>High-quality materials</li>
                <li>Eco-friendly packaging</li>
                <li>30-day return policy</li>
              </ul>
            </div>

            {/* Add this quantity selector */}
            <div className="mb-6">
              <label className="text-lg font-semibold text-gray-900 mb-2 block">Quantity</label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center py-2 border-t border-b border-gray-300"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                isAddingToCart 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;