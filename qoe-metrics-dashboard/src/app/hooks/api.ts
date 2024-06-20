/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { isNil, omitBy } from 'lodash';

import { IMetricsRequestParamsOverview } from '../models/types/requests/metrics-overview-request-params.interface';
import { TMetricsDetailsReportResponse } from '../models/types/responses/metrics-details-report.interface';
import { TMetricsOverviewReportResponse } from '../models/types/responses/metrics-overview-report.interface';
import MetricReportUtils from '../utils/metric-report-utils';

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
                    setError(err);
                })
                .finally(() => {
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

    useEffect(() => {
        const sse = new EventSource(`${backendUrl}/reporting-ui/sse/reload`);

        const handleReload = (e: MessageEvent) => {
            setReloadCount((prevCount) => prevCount + 1);
        };

        sse.onopen = () => {
            console.log('SSE connection opened');
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
    }, [backendUrl]);

    const resetReloadCount = useCallback(() => {
        setReloadCount(0);
    }, []);

    return { reloadCount, resetReloadCount };
};
