import './styles/App.css';

//Route
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

//Auth
import { AuthProvider } from './contexts/AuthContext';

//Toaster
import { ToasterProvider } from './contexts/ToasterContext';
import { Toaster } from './components/ui';

export default function App() {
  return (
    <AuthProvider>
      <ToasterProvider>
        <Toaster />
        <RouterProvider router={router} />
      </ToasterProvider>
    </AuthProvider>
  );
}