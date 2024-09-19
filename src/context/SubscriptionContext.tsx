"use client";

import React, { createContext, useContext, useState } from "react";
import { SubscriptionModel } from "../models/entities";
import { SubscriptionTierKey } from "../models/enum";

export interface SubscriptionContextType {
    activeSubscription?: SubscriptionModel,
    setActiveSubscription?: React.Dispatch<React.SetStateAction<SubscriptionModel | undefined>>,
    allSubscriptions?: SubscriptionModel[],
    setAllSubscriptions?: React.Dispatch<React.SetStateAction<SubscriptionModel[]>>,
    clickedSubscriptionKey?: SubscriptionTierKey,
    setClickedSubscriptionKey?: React.Dispatch<React.SetStateAction<SubscriptionTierKey | undefined>>,
    dialogOpen?: DialogOpenType,
    setDialogOpen?: React.Dispatch<React.SetStateAction<DialogOpenType>>
}

export interface DialogOpenType {
    subscriptionPricing?: boolean,
    subscriptionPayment?: boolean,
    subscriptionPaused?: boolean,
    usageExceeded?: boolean,
}

const SubscriptionContext = createContext<SubscriptionContextType>({});

export const SubscriptionContextProvider: React.FC<any> = ({ children }) => {
    const [activeSubscription, setActiveSubscription] = useState<SubscriptionModel>();
    const [allSubscriptions, setAllSubscriptions] = useState<SubscriptionModel[]>([]);
    const [clickedSubscriptionKey, setClickedSubscriptionKey] = useState<SubscriptionTierKey>();
    const [dialogOpen, setDialogOpen] = useState<DialogOpenType>({});

    return (
        <SubscriptionContext.Provider value={{
            activeSubscription,
            setActiveSubscription,
            allSubscriptions,
            setAllSubscriptions,
            clickedSubscriptionKey,
            setClickedSubscriptionKey,
            dialogOpen,
            setDialogOpen
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export const useSubscriptionContext = () => useContext(SubscriptionContext);