
import jwksClient from "jwks-rsa";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { egress } from "../../models/egress";
import { UserModel } from "../../models/entities";
import { UserService } from "./entity-services/user-service";

interface IKindeUserCreated {
    email: string,
    first_name: string,
    last_name: string,
    id: string
}

const client = jwksClient({
    jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export class KindeAuthService {

    async handleWebhook(token: string) {
        const { header } = jwt.decode(token, { complete: true })!;
        const { kid } = header;

        const key = await client.getSigningKey(kid);
        const signingKey = key.getPublicKey();
        const event = jwt.verify(token, signingKey) as JwtPayload;
        console.log("KindeAuthService event:", event)

        switch (event.type) {
            case "user.created":
                console.log("user.created:", event.data);
                await this.handlePostUserSignUp(event.data.user)
                break;
            default:
                console.log("Skipping event:", event.type)
                break;
        }
    }

    async handlePostUserSignUp(kindeUser: IKindeUserCreated) {
        const newUser: egress.SignUpInput = {
            email: kindeUser.email,
            name: `${kindeUser.first_name} ${kindeUser.last_name}`,
            providerUserId: kindeUser.id,
        }
        
        const userService: UserService = new UserService();
        try {
            const userRecord: UserModel = await userService.createNewUser(newUser);
            console.log("User created:", userRecord)
        } catch (error) {
            console.log("Error while handling post user sign up", error)
            throw new Error("Error while handling post user sign up")
        }
    }
}