import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from "@/pages/Home.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />, 
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);