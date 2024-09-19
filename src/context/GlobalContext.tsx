"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { useRouter } from "next/navigation";
import { ClientAuthService } from "../services/client-side/client-auth-service";
import { PrivateRestService } from "../services/client-side/api-services/private-rest-service";
import { useSubscriptionContext } from "./SubscriptionContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export interface GlobalContextType {
    isLoading?: boolean,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
}

const GlobalContext = createContext<GlobalContextType>({});

export const GlobalContextProvider: React.FC<any> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const authUser = useKindeBrowserClient();
    const authContext = useAuthContext();
    const subscriptionContext = useSubscriptionContext();
    const router = useRouter();

    const unauthorizedCallback = () => {
        ClientAuthService.unauthorizedCallback(router)
    }

    const fetchPrivateData = async () => {
        try {
            const privateService = new PrivateRestService(unauthorizedCallback)
            const activeUser = await privateService.getUser();
            console.log("Active user:", activeUser)
            if (!activeUser) {
                console.log("No valid user session found")
                authContext.setIsAuthenticated!(false)
                return;
            }
            console.log("User session found", activeUser)
            authContext.setIsAuthenticated!(true)
            authContext.setCurrentUser!(activeUser)

            const allSubs = await privateService.getAllSubscriptions();
            subscriptionContext.setAllSubscriptions!(allSubs);

            const activeSubscription = allSubs.find(s => s._id == activeUser.subscription);
            subscriptionContext.setActiveSubscription!(activeSubscription)
        } catch (err) {
            console.log("Terminated private initial data retrieval", err)
            unauthorizedCallback()
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            if (authUser.error) {
                console.error("Error while retrieving user session")
                ClientAuthService.handleLogin(router)
                return
            }
            await fetchPrivateData()
            setIsLoading(false);
        }
        if (authUser.user) {
            loadData();
        }
        if (!authUser.user && !authUser.isLoading) {
            setIsLoading(false);
        }
    }, [authUser.isLoading])

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