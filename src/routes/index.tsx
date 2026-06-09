import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Home, Login } from "@/pages"
import Customer from "@/pages/Views/Customer/Customer";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, 
  },
  {
    path: '/login',
    element: <Login />, 
  },
  {
    path: '/customer',
    element: <Customer />, 
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);