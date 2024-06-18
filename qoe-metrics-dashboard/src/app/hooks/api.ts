import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { isNil, omitBy } from 'lodash';

import { TMetricsDetailsRequestParams } from '../models/types/requests/metrics-details-request-params.type';
import { IMetricsRequestParamsOverview } from '../models/types/requests/metrics-overview-request-params.interface';
import { TMetricsDetailsReportResponse } from '../models/types/responses/metrics-details-report.interface';
import { TMetricsOverviewReportResponse } from '../models/types/responses/metrics-overview-report.interface';
import MetricReportUtils from '../utils/metric-report-utils';

import { qoEMetricsFromReport, TMappedQoeMetric } from './qoe-report';

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
 * Fetches the list of reports
 *
 * @param backendUrl - The URL of the backend
 * @param requestOverviewParams - The filter parameters for the request
 */
export const useReportList = (
    backendUrl: string,
    requestOverviewParams: IMetricsRequestParamsOverview,
    rerender?: string
) => {
    const cleanParams = omitBy(requestOverviewParams, isNil);

    const {
        response: reportList,
        error,
        loading,
    } = useAxiosGet<TMetricsOverviewReportResponse>({
        url: `${backendUrl}/reporting-ui/metrics`,
        params: cleanParams,
        rerender,
    });

    return { reportList, error, loading };
};

export type TReportResponse = {
    reportDetails?: TMappedReportDetails;
    error: any;
    loading: boolean;
};

export type TMappedReportDetails = {
    ClientID: string;
    ContentURI: string;
    xmlns: string;
    'xmlns:sv': string;
    'xsi:schemaLocation': string;
    'xmlns:xsi': string;
    QoeReport: {
        RecordingSessionID: string;
        ReportPeriod: string;
        ReportTime: string;
        PeriodID: string;
    } & TMappedQoeMetric;
};

/**
 * Fetches the details of a report
 *
 * @param backendUrl - The URL of the backend
 * @param requestDetailsParams - The filter parameters for the request
 */
export const useReportDetail = (
    backendUrl: string,
    requestDetailsParams: TMetricsDetailsRequestParams
): TReportResponse => {
    const {
        response: reportDetails,
        error,
        loading,
    } = useAxiosGet<TMetricsDetailsReportResponse>({
        url: `${backendUrl}/reporting-ui/metrics/details`,
        params: requestDetailsParams,
    });

    if (reportDetails) {
        const firstReport = reportDetails[0];

        const receptionReport = firstReport.ReceptionReport;

        const QoeMetrics = qoEMetricsFromReport(firstReport);

        const mappedReportList = {
            ClientID: receptionReport.clientID,
            ContentURI: receptionReport.contentURI,
            xmlns: receptionReport.xmlns,
            'xmlns:sv': receptionReport['xmlns:sv'],
            'xsi:schemaLocation': receptionReport['xsi:schemaLocation'],
            'xmlns:xsi': receptionReport['xmlns:xsi'],
            QoeReport: {
                RecordingSessionID: receptionReport.QoeReport.recordingSessionId,
                ReportPeriod: receptionReport.QoeReport.reportPeriod,
                ReportTime: receptionReport.QoeReport.reportTime,
                PeriodID: receptionReport.QoeReport.periodID,

                ...QoeMetrics,
            },
        };

        return { reportDetails: mappedReportList, error, loading };
    }

    return { error, loading };
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
