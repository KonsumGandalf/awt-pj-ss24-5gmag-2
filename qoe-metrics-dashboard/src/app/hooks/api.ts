import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

/**
 * Generically fetches data from the backend
 *
 * @param url - The URL to fetch data from
 * @param params - The parameters to send with the requests
 */
export const useAxiosGet = <T>({ url, params, rerender }: { url: string; params: object; rerender?: string }) => {
    const [response, setResponse] = useState<T>();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const stringifiedParams = JSON.stringify(Object.values(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps,
    const memoizedParams = useMemo(() => params, [stringifiedParams]);

    useEffect(() => {
        const fetchData = () => {
            axios<T>(url, {
                method: 'get',
                params: memoizedParams,
            })
                .then((res) => {
                    setResponse(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching data', err);
                    setError(err);
                })
                .finally(() => {
                    console.log('Finished fetching data');
                    setLoading(false);
                });
        };

        fetchData();
    }, [url, memoizedParams, rerender]);

    return { response, error, loading };
};

/**
 * Uses the SSE to be notified when the list of reports should be reloaded
 *
 * @param backendUrl - The URL of the backend
 */
export const useSseReloadList = (backendUrl: string, topic: string) => {
    const [reloadCount, setReloadCount] = useState(0);
    const handleReload = (e: MessageEvent) => {
        console.log('SSE event received', e);
        setReloadCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        const sse = new EventSource(`${backendUrl}/reporting-ui/sse/reload`);

        sse.onopen = () => {
            console.log('SSE connection opened', `${backendUrl}/reporting-ui/sse/reload`);
        };

        sse.onerror = function (e) {
            if (this.readyState == EventSource.CONNECTING) {
                console.log(`Reconnecting (readyState=${this.readyState})...`);
            } else {
                console.log('Error has occurred: ', e);
            }
        };

        sse.addEventListener(topic, handleReload);

        return () => {
            sse.removeEventListener(topic, handleReload);
            sse.close();
        };
    }, []);

    const resetReloadCount = useCallback(() => {
        setReloadCount(0);
    }, []);

    return { reloadCount, resetReloadCount };
};
