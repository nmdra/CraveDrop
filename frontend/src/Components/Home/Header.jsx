import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../../assets/logo.png'
import CartButton from './CartButton'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [cartItemCount, setCartItemCount] = useState(0) // Initialize cart item count as 0
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    // Fetch cart from local storage
    const cartItems = JSON.parse(localStorage.getItem('cart')) || []

    const dropdownRef = useRef(null) // Ref for dropdown menu

    useEffect(() => {
        setIsLoggedIn(!!user) // Set isLoggedIn based on user presence
    }, [user])

    useEffect(() => {
        // Calculate total item count
        const totalItemCount = cartItems.reduce(
            (total, item) => total + item.quantity,
            0
        )

        // Set cart item count
        setCartItemCount(totalItemCount)
    }, [cartItems])

    useEffect(() => {
        // Close dropdown if click outside of it
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false)
            }
        }

        // Add event listener to detect outside click
        document.addEventListener('mousedown', handleClickOutside)

        // Clean up event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [dropdownRef])

    const handleLogout = async (e) => {
        e.preventDefault()
        if (window.confirm('Are you sure you want to log out?')) {
            try {
                await axios.post(
                    '/api/user/logout',
                    {},
                    { withCredentials: true }
                )
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                setIsLoggedIn(false)
                setIsDropdownOpen(false)
                navigate('/login')
            } catch (error) {
                console.error('Error logging out', error)
            }
        }
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <div>
            <div className="mx-auto flex max-w-7xl items-center justify-between border-b py-6">
                <div>
                    <Link to="/">
                        <img src={logo} alt="Logo" width={160} height={160} />
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4 text-sm">
                            <div className="pr-2">
                                <Link to="/help">Help & Support</Link>
                            </div>

                            <CartButton cartItemCount={cartItemCount} />

                            <button
                                className="flex items-center gap-2"
                                onClick={() => navigate('/dashboard')}
                            >
                                {user?.firstname} {user?.lastname}
                            </button>

                            {/* User Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    id="user-menu-button"
                                    aria-expanded={isDropdownOpen}
                                    onClick={toggleDropdown}
                                >
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    <img
                                        className="h-8 w-8 rounded-full ring-2 ring-green-700"
                                        src={user?.pic}
                                        alt="User profile"
                                    />
                                </button>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 z-50 my-4 list-none divide-y divide-gray-100 rounded-lg bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
                                        id="user-dropdown"
                                    >
                                        <div className="px-4 py-3">
                                            <span className="block text-sm text-gray-900 dark:text-white">
                                                {user?.firstname}{' '}
                                                {user?.lastname}
                                            </span>
                                            <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                                                {user?.email}
                                            </span>
                                        </div>
                                        <ul
                                            className="py-2"
                                            aria-labelledby="user-menu-button"
                                        >
                                            <li>
                                                <Link
                                                    to="/dashboard"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/settings"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Orders
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/notifications"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Notifications
                                                </Link>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                    onClick={handleLogout}
                                                >
                                                    Sign out
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/farmerRegister"
                                    className="cursor-pointer text-sm text-black hover:text-[#99DD05] hover:underline"
                                >
                                    Become a Seller
                                </Link>
                                <Link
                                    to="/register-driver"
                                    className="cursor-pointer text-sm text-black hover:text-[#99DD05] hover:underline"
                                >
                                    Become a Driver
                                </Link>
                                <Link
                                    to="/help"
                                    className="cursor-pointer text-sm text-black hover:text-[#99DD05] hover:underline"
                                >
                                    Help & Support
                                </Link>
                            </div>
                            <Link to="/register">
                                <button className="rounded-lg border border-black px-7 py-3 hover:border-[#99DD05] hover:bg-[#99DD05]">
                                    SignUp
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="rounded-lg bg-[#99DD05] px-7 py-3 hover:bg-[#99DD05]/60">
                                    Login
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
