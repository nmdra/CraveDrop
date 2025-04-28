import React from 'react'
import { MdShoppingCart } from 'react-icons/md'
import { Link } from 'react-router-dom'

const CartButton = ({ cartItemCount }) => {
    return (
        <Link to="/cart" className="relative flex items-center">
            <MdShoppingCart
                size={28}
                className="text-black hover:text-gray-700"
            />
            {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {cartItemCount}
                </span>
            )}
        </Link>
    )
}

export default CartButton
