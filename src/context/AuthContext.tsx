'use client';

import { useState, useContext, createContext } from 'react';
import { UserModel } from '../models/entities';

export interface AuthContextType {
  isAuthenticated?: boolean,
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean | undefined>>,
  currentUser?: UserModel,
  setCurrentUser?: React.Dispatch<React.SetStateAction<UserModel | undefined>>,
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

export const AuthContextProvider: React.FC<any> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [currentUser, setCurrentUser] = useState<UserModel>();

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      currentUser,
      setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
