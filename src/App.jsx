import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import Navbar from "./components/Navbar";

/* ---------- Protected Route ---------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "donor") return <Navigate to="/donor" />;
    if (user.role === "hospital") return <Navigate to="/hospital" />;
    return <Navigate to="/login" />;
  }

  return children;
};

/* ---------- Root Redirect ---------- */
const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "donor") return <Navigate to="/donor" />;
  if (user.role === "hospital") return <Navigate to="/hospital" />;

  return <Navigate to="/login" />;
};

/* ---------- App ---------- */
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/donor/*"
                element={
                  <ProtectedRoute allowedRoles={["donor"]}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospital/*"
                element={
                  <ProtectedRoute allowedRoles={["hospital"]}>
                    <HospitalDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<HomeRedirect />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
