import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { backendUrl } from "../utils/constants";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});

let refreshPromise: Promise<unknown> | null = null;

const isApiResponse = (value: unknown): value is { data: unknown; success: boolean; message: string } => {
    return Boolean(
        value &&
        typeof value === "object" &&
        "success" in value &&
        "data" in value
    );
};

const normalizeError = (error: any) => ({
    status: error?.response?.status,
    message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    error: error?.response?.data?.errors || [],
});

api.interceptors.response.use(
    (response) => {
        if (isApiResponse(response.data)) {
            response.data = response.data.data;
        }
        return response;
    },
    async (error) => {
        const original = error.config as RetryConfig | undefined;
        const status = error?.response?.status;
        const url = String(original?.url ?? "");

        const skipRefresh =
            url.includes("/users/refresh-token") ||
            url.includes("/users/login") ||
            url.includes("/users/register");

        if (status === 401 && original && !original._retry && !skipRefresh) {
            original._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = api.post("/users/refresh-token").finally(() => {
                        refreshPromise = null;
                    });
                }
                await refreshPromise;
                return api(original);
            } catch {
                return Promise.reject(normalizeError(error));
            }
        }

        return Promise.reject(normalizeError(error));
    }
);

export default api;
