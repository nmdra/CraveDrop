import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img
          src={product.image || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
          New
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
        <p className="text-sm text-gray-600 mt-2 truncate">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-green-600">${product.price.toFixed(2)}</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            Add t Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;