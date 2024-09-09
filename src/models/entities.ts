import { SubscriptionTierKey, UserStatus } from "./enum";

export interface Entity {
    _id?: any;
}

export interface Notification {
    createdAt: number,
    title: string,
    description: string,
    hasRead: boolean
}
export interface UserModel extends Entity {
    name: string,
    email: string,
    status: UserStatus,
    providerUserId: string,
    notifications: Notification[],
    imageUrl?: string
    thumbnailUrl?: string,
    createdAt: number,
}

export interface SubscriptionModel extends Entity {
    key: SubscriptionTierKey,
    price: number,
    stripeMonthlyLookUpKey?: string,
    stripeAnnualLookUpKey?: string,
}