import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!role) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/properties" element={<PropertiesPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />

      {/* Protected Routes */}
      <Route
        path="/tenant/dashboard"
        element={
          <ProtectedRoute allowedRole="TENANT">
            <TenantDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRole="OWNER">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path = "/verify-email"
      element = {<VerifyEmailPage/>}/>

      <Route path = "/forgot-password"
      element = {<ForgotPasswordPage/>}/>
      <Route path = "/reset-password"
      element = {<ResetPasswordPage/>}/>
    </Routes>
  );
}

export default App;
