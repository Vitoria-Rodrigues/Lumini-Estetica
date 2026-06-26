import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Home, Login } from "@/pages"
import { RootLayout } from '@/components/layout';
import Customer from "@/pages/Views/Customer/Customer";
import Appointment from '@/pages/Views/Appointment/Appointment';
import Procedure from '@/pages/Views/Procedure/Procedure';
import Session from '@/pages/Views/Session/Session';
import Professional from "@/pages/Views/Professional/Professional";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'customer',
        element: <Customer />,
      },
      {
        path: 'appointment',
        element: <Appointment />,
      },
      {
        path: 'procedure',
        element: <Procedure />,
      },
      {
        path: 'session',
        element: <Session />,
      },
      {
        path: 'professional',
        element: <Professional />,
      },
    ], 
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace/>,
  },
]);