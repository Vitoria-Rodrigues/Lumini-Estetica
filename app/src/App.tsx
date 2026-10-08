import { useState } from 'react';
import './styles/App.css';

// TanStack Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

//Route
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

//Auth
import { AuthProvider } from './contexts/AuthContext';

//Toaster
import { ToasterProvider } from './contexts/ToasterContext';
import { Toaster } from './components/ui';

export default function App() {

  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 3,
          gcTime: 1000 * 60 * 15,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToasterProvider>
          <Toaster />
          <RouterProvider router={router} />
        </ToasterProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}