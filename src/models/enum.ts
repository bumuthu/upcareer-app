export enum SubscriptionTierKey {
    FREE = "FREE",
    PLUS = "PLUS",
    PREMIUM = "PREMIUM"
}

export enum UserStatus {
    INVITED = "INVITED",
    INITIALIZED = "INITIALIZED",
    ACTIVE = "ACTIVE",
    DIACTIVE = "DEACTIVE"
}

export enum UserInterviewStatus {
    INITIALIZED = "INITIALIZED",
    ONGOING = "ONGOING",    
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    PAUSED = "PAUSED"
}

export enum SubscriptionEventType {
    WELCOME_TO_FREE_TIER = "WELCOME_TO_FREE_TIER",
    BILLING_CYCLE_STARTED = "BILLING_CYCLE_STARTED",
    BILLING_CYCLE_ENDED = "BILLING_CYCLE_ENDED",
    BILLING_CYCLE_RENEWED = "BILLING_CYCLE_RENEWED",
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
    PAYMENT_FAILURE = "PAYMENT_FAILURE",
    SUBSCRIPTION_PAUSED = "SUBSCRIPTION_PAUSED",
    SUBSCRIPTION_UPGRADED = "SUBSCRIPTION_UPGRADED",
}

export enum SubscriptionEventTitle {
    WELCOME_TO_FREE_TIER = "You are welcome to free tier",
    BILLING_CYCLE_STARTED = "Billing cycle started",
    BILLING_CYCLE_ENDED = "Billing cycle ended",
    BILLING_CYCLE_RENEWED = "Billing cycle renewed",
    PAYMENT_SUCCESS = "Payment successfully completed",
    PAYMENT_FAILURE = "Payment failed",
    SUBSCRIPTION_PAUSED = "Subscription paused due to payment failure",
    SUBSCRIPTION_UPGRADED = "Subscription upgraded",
}

export enum SelectableSection {
    EXPLORE_INTERVIEWS = "EXPLORE_INTERVIEWS",
    MY_INTERVIEWS = "MY_INTERVIEWS",
    MY_PROGRESS = "MY_PROGRESS",
    MY_ACCOUNT = "MY_ACCOUNT"

}