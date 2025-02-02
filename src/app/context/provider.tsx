import { useLocation, useNavigate } from "react-router-dom";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isRestuarant: boolean;
  setIsRestuarant: (isAuthenticated: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [isRestuarant, setIsRestuarant] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem("user");
    return !!user;
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    const restuarant = localStorage.getItem('restuarant');
    if (restuarant && user) {
      setIsRestuarant(true);
    }
    if (user) {
      setIsAuthenticated(true);
    } 
  }, [location.pathname, navigate]);

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated, isRestuarant, setIsRestuarant  }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
