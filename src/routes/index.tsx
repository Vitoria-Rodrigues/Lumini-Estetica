import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Home, Login } from "@/pages"
import { RootLayout } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext/useAuth';
import { Loading } from '@/components/ui/Loading/Loading';
import React from 'react';

//Views Page
import Customer from "@/pages/Views/Customer/Customer";
import Appointment from '@/pages/Views/Appointment/Appointment';
import Procedure from '@/pages/Views/Procedure/Procedure';
import Session from '@/pages/Views/Session/Session';
import Professional from "@/pages/Views/Professional/Professional";


const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
    const  {user, loading } = useAuth();

    if(loading){
      return <Loading fullScreen message='Carregando sessão...'/>;
    }

    if(!user){
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>
}; 

const GuestRoute = ({ children }: { children: React.ReactNode}) => {
  const { user, loading } = useAuth();

  if(loading) {
    return <Loading fullScreen message='Validando login...' />;
  }

  if(user) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>;
};


export const router = createBrowserRouter([
    {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
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
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);