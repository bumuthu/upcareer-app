"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { ClientAuthService } from "../services/client-side/client-auth-service";
import { PrivateRestService } from "../services/client-side/api-services/private-rest-service";
import { useSubscriptionContext } from "./SubscriptionContext";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CategoryModel, SubscriptionModel } from "../models/entities";
import { PublicRestService } from "../services/client-side/api-services/public-rest-service";
import { SelectableSection } from "@/models/enum";

export interface GlobalContextType {
    isLoading: boolean,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
    categories: CategoryModel[],
    selectedSection?: SelectableSection,
    setSelectedSection?: React.Dispatch<React.SetStateAction<SelectableSection>>,
}

const GlobalContext = createContext<GlobalContextType>({ isLoading: false, categories: [] });

export const GlobalContextProvider: React.FC<any> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [selectedSection, setSelectedSection] = useState<SelectableSection>(SelectableSection.EXPLORE_INTERVIEWS)

    const authUser = useKindeBrowserClient();
    const authContext = useAuthContext();
    const subscriptionContext = useSubscriptionContext();
    const router = useRouter();
    const pathName = usePathname()

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

            const allSubs: SubscriptionModel[] = [] // TODO: await privateService.getAllSubscriptions();
            subscriptionContext.setAllSubscriptions!(allSubs);

            const activeSubscription = allSubs.find(s => s._id == activeUser.subscription);
            subscriptionContext.setActiveSubscription!(activeSubscription)
        } catch (err) {
            console.log("Terminated private initial data retrieval", err)
            // unauthorizedCallback() // TODO: check looping issue due to this
        }
    }

    const fetchPublicData = async () => {
        try {
            const publicService = new PublicRestService()
            const allCategories = await publicService.getCategories();
            setCategories(allCategories);
        } catch (err) {
            console.log("Error while retrieving system params", err)
        }
    }

    const setNavBarSelection = () => {
        if (pathName == '/') {
            setSelectedSection(SelectableSection.EXPLORE_INTERVIEWS)
        } else if (pathName == '/my-interviews') {
            setSelectedSection(SelectableSection.MY_INTERVIEWS)
        } else if (pathName == '/my-progress') {
            setSelectedSection(SelectableSection.MY_PROGRESS)
        } else {
            setSelectedSection(SelectableSection.MY_ACCOUNT)
        }
    }

    useEffect(() => {
        const loadData = async () => {
            await fetchPublicData()
            if (!authUser.user) {
                setIsLoading(false);
                return
            }
            if (authUser.error) {
                console.error("Error while retrieving user session")
                ClientAuthService.handleLogin(router)
                return
            }
            await fetchPrivateData()
            setIsLoading(false);
        }

        if (authUser.isLoading) {
            setIsLoading(true);
        } else {
            loadData();
        }
    }, [authUser.isLoading])

    useEffect(() => {
        setNavBarSelection()
    }, [pathName])

    return (
        <GlobalContext.Provider value={{
            isLoading,
            setIsLoading,
            categories,
            selectedSection,
            setSelectedSection,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);