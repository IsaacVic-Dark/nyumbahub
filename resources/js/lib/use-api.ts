import type { AxiosRequestConfig } from 'axios';
import { isCancel } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { api, getErrorMessage } from '@/lib/api';

type State<T> = { data: T | null; loading: boolean; error: string | null };

/**
 * GET helper: `useApi<Paginated<Listing>>('/listings', { q: 'ruaka' })`.
 * Re-fetches whenever the url or params change; pass `null` as the url to skip.
 */
export function useApi<T>(
    url: string | null,
    params?: Record<string, unknown>,
    config?: Pick<AxiosRequestConfig, 'skipAuthRedirect'>,
) {
    const [state, setState] = useState<State<T>>({
        data: null,
        loading: url !== null,
        error: null,
    });
    const [nonce, setNonce] = useState(0);
    const paramsKey = JSON.stringify(params ?? {});
    const skipAuthRedirect = config?.skipAuthRedirect;

    useEffect(() => {
        if (url === null) {
            return;
        }

        const controller = new AbortController();
        setState((s) => ({ ...s, loading: true, error: null }));

        api.get<T>(url, {
            params: JSON.parse(paramsKey) as Record<string, unknown>,
            signal: controller.signal,
            skipAuthRedirect,
        })
            .then((res) => setState({ data: res.data, loading: false, error: null }))
            .catch((e) => {
                if (isCancel(e)) {
                    return;
                }
                setState((s) => ({ ...s, loading: false, error: getErrorMessage(e) }));
            });

        return () => controller.abort();
    }, [url, paramsKey, nonce, skipAuthRedirect]);

    const reload = useCallback(() => setNonce((n) => n + 1), []);
    const setData = useCallback(
        (updater: (prev: T | null) => T | null) =>
            setState((s) => ({ ...s, data: updater(s.data) })),
        [],
    );

    return { ...state, reload, setData };
}
