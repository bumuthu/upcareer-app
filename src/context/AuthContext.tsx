'use client';

import { useState, useContext, createContext } from 'react';
import { useRouter } from 'next/navigation';
import { KindeAuthService } from '../services/kinde-auth-service';

export interface AuthContextType {
  isAuthenticated?: boolean,
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean | undefined>>, 
  unauthorizedCallback?: () => void
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const router = useRouter();

  const unauthorizedCallback = () => {
    KindeAuthService.handleLogin(router)
}

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      unauthorizedCallback
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
