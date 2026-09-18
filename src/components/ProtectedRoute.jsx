import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  // Firebase authentication state check ayye varaku loader
  if (loading) {
    return <Loader />;
  }

  // User login ayithe page allow
  // Login lekapothe Login page ki redirect
  return currentUser ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

export default ProtectedRoute;