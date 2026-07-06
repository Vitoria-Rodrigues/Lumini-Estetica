import './styles/App.css';

//Route
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

//Auth
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}