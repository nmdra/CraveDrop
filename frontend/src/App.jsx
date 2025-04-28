import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import MainLayout from "./Layouts/MainLayout";
import DriverLayout from "./Layouts/DriverLayout";


import HomePage from "./Pages/HomePage";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Customer/LoginForm";
import Register from "./Pages/Customer/RegisterForm";
import DriverList from "./Components/Admin/DriverList";
import DriverLogin from "./Pages/Driver/LoginForm";
import DriverProfile from "./Pages/Driver/DriverProfile";
import DriverDashboard from "./Pages/Driver/DriverDashboard";
import DriverDeliveries from "./Pages/Driver/DriverDeliveries";
import OngoingDeliveries from "./Pages/Driver/OngoingDeliveries";
import DriverIncome from "./Pages/Driver/DriverIncome";
import DriverRegister from "./Pages/Driver/RegisterForm";
import AllDeliveries from './Pages/Delivery/AllDeliveries';
import DeliveryDetails from './Pages/Delivery/DeliveryDetails';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
		 {/* Driver section with its own layout */}
		 
		 <Route path="/admin/drivers" element={<DriverList />} />
        <Route path="/register-driver" element={<DriverRegister />} />
        <Route path="/deliveries" element={<AllDeliveries />} />
        <Route path="/deliveries/:id" element={<DeliveryDetails />} />
        
		 
		 
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
    </>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
