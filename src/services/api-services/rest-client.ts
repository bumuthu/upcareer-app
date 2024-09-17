
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_REST_BASE_URL!;

export class RestClient {

    private baseUrl: string;
    private isPublic: boolean;
    private unauthorizedCallback?: () => void;

    constructor(isPublic: boolean, unauthorizedCallback?: () => void) {
        this.baseUrl = BASE_URL;
        this.isPublic = isPublic;
        this.unauthorizedCallback = unauthorizedCallback;

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    if (!isPublic) {
                        this.unauthorizedCallback!();
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private async request<T>(config: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await axios(config);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message || 'An error occurred';
        }
    }

    async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: `${this.baseUrl}/${url}`,
            params,
        };
        return this.request<T>(config);
    }

    async post<T>(url: string, data: any): Promise<T> {
        const config: AxiosRequestConfig = {
            method: 'post',
            url: `${this.baseUrl}/${url}`,
            data,
        };
        return this.request<T>(config);
    }

    async put<T>(url: string, data: any): Promise<T> {
        const config: AxiosRequestConfig = {
            method: 'put',
            url: `${this.baseUrl}/${url}`,
            data,
        };
        return this.request<T>(config);
    }

    async delete<T>(url: string): Promise<T> {
        const config: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.baseUrl}/${url}`,
        };
        return this.request<T>(config);
    }
}
