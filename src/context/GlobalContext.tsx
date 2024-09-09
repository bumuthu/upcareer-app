"use client";

import React, { createContext, useContext, useState } from "react";

export interface GlobalContextType {
    isLoading?: boolean,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
}

const GlobalContext = createContext<GlobalContextType>({});

export const GlobalContextProvider: React.FC<any> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);


    return (
        <GlobalContext.Provider value={{
            isLoading,
            setIsLoading,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);