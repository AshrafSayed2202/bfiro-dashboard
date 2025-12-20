import { useLocation, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
