import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/provider";

interface ProtectedProps {
  children: ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { isAuthenticated, isRestuarant } = useAppContext();
  const location = useLocation();

  const unAuthorisedRoutes = ['/profile', '/', '/qrscanner', '/search', '/authentication', '/register','/restuarant'];

  // useEffect(() => {
  //   if (isRestuarant && !unAuthorisedRoutes.includes(location.pathname) && location.pathname !== '/dashboard') {
  //     return <Navigate to="/dashboard" replace />;
  //   }
  // }, [location.pathname, isRestuarant]);

  if (!isAuthenticated && !unAuthorisedRoutes.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  if (isRestuarant && unAuthorisedRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default Protected;
