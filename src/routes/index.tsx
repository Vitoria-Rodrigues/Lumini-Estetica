import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Home, Login } from "@/pages"
import Customer from "@/pages/Views/Customer/Customer";
import Appointment from '@/pages/Views/Appointment/Appointment';
import Procedure from '@/pages/Views/Procedure/Procedure';
import Session from '@/pages/Views/Session/Session';

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
    path: '/appointment',
    element: <Appointment />, 
  },
  {
    path: '/procedure',
    element: <Procedure />, 
  },
  {
    path: '/session',
    element: <Session />, 
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);