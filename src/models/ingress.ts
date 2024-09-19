export namespace ingress {
    // Subscription related
    export interface CheckoutSessionResponse {
        clientSecret: string
    }
    export interface StripeDetailsResponse {
        defaultCard: boolean,
        cardEndingNumbers?: string,
        cardBrand?: string
    }
}