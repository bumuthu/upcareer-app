import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export interface IAuthUser {
    providerId: string
    email: string
}

export class AuthService {
    public static async getUser(): Promise<IAuthUser> {
        const user = await getKindeServerSession().getUser();

        if (!user || !user.id || !user.email) {
            throw new Error("Invalid user found")
        }
        return { email: user.email, providerId: user.id};
    }
}