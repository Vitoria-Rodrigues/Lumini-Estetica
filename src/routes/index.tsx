import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Home, Login } from "@/pages"

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
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);