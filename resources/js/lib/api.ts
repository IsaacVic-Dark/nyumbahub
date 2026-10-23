import axios, { isAxiosError } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        /** Skip the automatic redirect to /login when this call returns 401. */
        skipAuthRedirect?: boolean;
    }
}

/**
 * Same-origin client for the Laravel API (/api/*). Auth is the Fortify cookie
 * session: axios sends the session cookie and echoes the XSRF-TOKEN cookie as
 * the X-XSRF-TOKEN header automatically, which is what Sanctum's stateful
 * mode expects (SANCTUM_STATEFUL_DOMAINS must include the host you browse).
 */
export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.response.use(
    (r) => r,
    (error) => {
        if (
            isAxiosError(error) &&
            error.response?.status === 401 &&
            !error.config?.skipAuthRedirect
        ) {
            window.location.href = '/login'; // session expired / not signed in
        }

        return Promise.reject(error);
    },
);

export type Paginated<T> = {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

/** Best human-readable message from a failed API call. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string; errors?: Record<string, string[]> | null }
            | undefined;
        const first = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;

        return first ?? data?.message ?? (error.response ? fallback : 'Could not reach NyumbaHub. Check your connection.');
    }

    return fallback;
}

/** Laravel validation errors as { field: message }. */
export function getFieldErrors(error: unknown): Record<string, string> {
    if (isAxiosError(error)) {
        const errors = (error.response?.data as { errors?: Record<string, string[]> | null } | undefined)?.errors;

        return Object.fromEntries(
            Object.entries(errors ?? {}).map(([k, v]) => [k, v[0]]),
        );
    }

    return {};
}
