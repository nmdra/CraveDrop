import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

// Layouts
import MainLayout from './Layouts/MainLayout'
import DriverLayout from './Layouts/DriverLayout'
import SidebarLayout from './Layouts/SidebarLayout'

// Customer Pages
import HomePage from './Pages/HomePage'
import Login from './Pages/Customer/LoginForm'
import Register from './Pages/Customer/RegisterForm'
import Dashboard from './Pages/Customer/UserDashboard'
import Settings from './Pages/Customer/Settings'
import Orders from './Pages/Customer/Orders'
import Notifications from './Pages/Customer/Notifications'
import OrderSummary from './Pages/Customer/OrderSummary'

// Driver Pages
// import DriverList from './Components/Admin/DriverList'
import DriverLogin from './Pages/Driver/LoginForm'
import DriverRegister from './Pages/Driver/RegisterForm'
import DriverDashboard from './Pages/Driver/DriverDashboard'
import DriverProfile from './Pages/Driver/DriverProfile'
import DriverDeliveries from './Pages/Driver/DriverDeliveries'
import OngoingDeliveries from './Pages/Driver/OngoingDeliveries'
import DriverIncome from './Pages/Driver/DriverIncome'

// Delivery Pages
import AllDeliveries from './Pages/Delivery/AllDeliveries'
import DeliveryDetails from './Pages/Delivery/DeliveryDetails'

// Order (Shop) Pages
import { CartProvider } from './Context/CartContext'
import Home from './Pages/order/HomePage'
import ProductDetails from './Pages/order/ProductDetails'
import Cart from './Pages/order/CartPage'
import Checkout from './Pages/order/Checkoutpage'
import Payment from './Pages/order/PaymentPage'
import SuccessPage from './Pages/order/SuccessPage'

// Common
import NotFound from './Pages/NotFound'

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />}>
            {/* Public Pages */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Admin Section */}
            {/* <Route path="admin/drivers" element={<DriverList />} /> */}
            <Route path="register-driver" element={<DriverRegister />} />

            {/* Deliveries */}
            <Route path="deliveries" element={<AllDeliveries />} />
            <Route path="deliveries/:id" element={<DeliveryDetails />} />

            {/* Customer Section (Sidebar Layout) */}
            <Route element={<SidebarLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="settings" element={<Settings />} />
                <Route path="orders" element={<Orders />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="orders/:orderId" element={<OrderSummary />} />
            </Route>

            {/* Driver Section (Driver Layout) */}
            <Route path="/driver" element={<DriverLayout />}>
                <Route path="login" element={<DriverLogin />} />
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="profile" element={<DriverProfile />} />
                <Route path="deliveries" element={<DriverDeliveries />} />
                <Route path="ongoing" element={<OngoingDeliveries />} />
                <Route path="income" element={<DriverIncome />} />
                <Route path="deliveries/:id" element={<DeliveryDetails />} />
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Shop / Ordering Pages */}
            <Route path="home" element={<Home />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="payment" element={<Payment />} />
            <Route path="success" element={<SuccessPage />} />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
        </Route>
    )
)

const App = () => {
    return (
        <CartProvider>
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </CartProvider>
    )
}

export default App
