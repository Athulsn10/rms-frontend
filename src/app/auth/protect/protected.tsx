import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/provider";

interface ProtectedProps {
  children: ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { isAuthenticated } = useAppContext();

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default Protected;
