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

    // Azure AI related
    export interface SpeechTokenResponse {
        token: string
        region: string
    }
}