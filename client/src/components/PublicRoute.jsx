import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    if (user.role === "student") {
      return <Navigate to="/dashboard/student" replace />;
    }

    if (user.role === "business") {
      return <Navigate to="/dashboard/business" replace />;
    }

    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
