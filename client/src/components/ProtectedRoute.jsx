import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but does not have the required role - redirect to their dashboard
    if (user.role === "student") {
      return <Navigate to="/dashboard/developer" replace />;
    }
    if (user.role === "business") {
      return <Navigate to="/dashboard/business" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
