import { Outlet } from 'react-router-dom'
import Sidebar from '../Components/User/Sidebar'

const SidebarLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="z-10 w-64 bg-white shadow-lg">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    )
}

export default SidebarLayout
