import { Navigate, useLocation } from "react-router-dom";

const AuthRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthRoute;
