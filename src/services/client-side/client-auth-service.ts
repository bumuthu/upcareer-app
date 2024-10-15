import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface IAuthUser {
    providerId: string
    email: string
}

export class ClientAuthService {

    static handleLogin(router: AppRouterInstance) {
        router.push("/api/auth/login")
    }

    static handleLogout(router: AppRouterInstance) {
        router.push("/api/auth/logout")
    }

    static handleRegister(router: AppRouterInstance) {
        router.push("/api/auth/register")
    }

    static unauthorizedCallback(router: AppRouterInstance) {
        router.push("/api/auth/login")
    }
}