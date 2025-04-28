import { NavLink } from 'react-router-dom'
import { FaHome, FaUser, FaCog, FaBox, FaBell } from 'react-icons/fa'
import { FaBoxesPacking } from 'react-icons/fa6'

const Sidebar = () => {
    const navItems = [
        { name: 'Home', path: '/dashboard', icon: <FaHome /> },
        { name: 'Orders', path: '/orders', icon: <FaBox /> },
        { name: 'Notifications', path: '/notifications', icon: <FaBell /> },
        { name: 'Settings', path: '/settings', icon: <FaCog /> },
    ]

    return (
        <div className="h-full p-4">
            <div className="mb-8 px-2 text-2xl font-bold">Dashboard</div>
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                                isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    )
}

export default Sidebar
