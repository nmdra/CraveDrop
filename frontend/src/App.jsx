import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import MainLayout from './Layouts/MainLayout'

import HomePage from './Pages/HomePage'
import NotFound from './Pages/NotFound'
import Login from './Pages/Customer/LoginForm'
import Register from './Pages/Customer/RegisterForm'
import Dashboard from './Pages/Customer/UserDashboard'
import Settings from './Pages/Customer/Settings'
import Orders from './Pages/Customer/Orders'
import Notifications from './Pages/Customer/Notifications'
import SidebarLayout from './Layouts/SidebarLayout'
import OrderSummary from './Pages/Customer/OrderSummary'

//order part
import { CartProvider } from './Context/CartContext'
import Home from './Pages/order/HomePage'
import ProductDetails from './Pages/order/ProductDetails'
import Cart from './Pages/order/CartPage'
import Checkout from './Pages/order/Checkoutpage'
import Payment from './Pages/order/PaymentPage'
import SuccessPage from './Pages/order/SuccessPage'

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<SidebarLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="/orders/:orderId" element={<OrderSummary />} />
                </Route>

                {/* order part */}
                <Route path="/home" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/success" element={<SuccessPage />} />

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </>
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
