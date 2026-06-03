import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";

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