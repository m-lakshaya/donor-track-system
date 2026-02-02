import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access unauthorized route
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'donor') return <Navigate to="/donor" />;
    if (user.role === 'hospital') return <Navigate to="/hospital" />;
    return <Navigate to="/" />;
  }

  return children;
};

// Root redirect based on role
const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'donor') return <Navigate to="/donor" />;
  if (user.role === 'hospital') return <Navigate to="/hospital" />;
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/donor/*" element={
                  <ProtectedRoute allowedRoles={['donor']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/hospital/*" element={
                  <ProtectedRoute allowedRoles={['hospital']}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/" element={<HomeRedirect />} />
              </Routes>
            </main>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
