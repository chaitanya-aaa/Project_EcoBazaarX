import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SellerDashboard from "./components/dashboard/SellerDashboard";
import CustomerDashboard from "./components/dashboard/CustomerDashboard";

function App() {
  const getRole = () => localStorage.getItem("role");

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = getRole();
    if (!role || !allowedRoles.includes(role)) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/seller" element={<ProtectedRoute allowedRoles={["seller"]}><SellerDashboard /></ProtectedRoute>} />
      <Route path="/customer" element={<ProtectedRoute allowedRoles={["customer"]}><CustomerDashboard /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
