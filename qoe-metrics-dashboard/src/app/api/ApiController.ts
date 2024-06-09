import axios from 'axios';
import { defaults } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { TMetricsDetailsRequestParams } from '../models/types/requests/metrics-details-request-params.type';
import { IMetricsRequestParamsOverview } from '../models/types/requests/metrics-overview-request-params.interface';
import { TMetricsDetailsReportResponse } from '../models/types/responses/metrics-details-report.interface';
import { TMetricsOverviewReportResponse } from '../models/types/responses/metrics-overview-report.interface';

const useAxiosGet = <T>({ url, params }: { url: string; params: object }) => {
    const [response, setResponse] = useState<T>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const memoizedParams = useMemo(() => params, Object.values(params));

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
    }, [url, memoizedParams]);

    return { response, error, loading };
};

export const useReportList = (
    backendUrl: string,
    requestOverviewParams: IMetricsRequestParamsOverview
) => {
    const {
        response: reportList,
        error,
        loading,
    } = useAxiosGet<TMetricsOverviewReportResponse>({
        url: `${backendUrl}/reporting-ui/metrics`,
        params: defaults(
            {
                provisionSessionId: JSON.stringify(
                    requestOverviewParams.provisionSessionIds
                ),
            },
            requestOverviewParams
        ),
    });

    return { reportList, error, loading };
};

export const useReportDetail = (
    backendUrl: string,
    requestDetailsParams: TMetricsDetailsRequestParams
) => {
    const {
        response: reportDetails,
        error,
        loading,
    } = useAxiosGet<TMetricsDetailsReportResponse>({
        url: `${backendUrl}/reporting-ui/metrics/details`,
        params: requestDetailsParams,
    });

    return { reportDetails, error, loading };
};
