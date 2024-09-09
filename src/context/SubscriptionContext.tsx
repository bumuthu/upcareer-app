"use client";

import React, { createContext, useContext, useState } from "react";
import { SubscriptionModel } from "../models/entities";

export interface SubscriptionContextType {
    activeSubscription?: SubscriptionModel,
    setActiveSubscription?: React.Dispatch<React.SetStateAction<SubscriptionModel | undefined>>,
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
    const [dialogOpen, setDialogOpen] = useState<DialogOpenType>({});

    return (
        <SubscriptionContext.Provider value={{
            activeSubscription,
            setActiveSubscription,
            dialogOpen,
            setDialogOpen
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export const useSubscriptionContext = () => useContext(SubscriptionContext);