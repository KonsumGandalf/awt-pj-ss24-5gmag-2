import { isNil, omitBy } from 'lodash';

import { TMetricsDetailsRequestParams } from '../models/types/metrics/requests/metrics-details-request-params.type';
import { IMetricsRequestParamsOverview } from '../models/types/metrics/requests/metrics-overview-request-params.interface';
import { TMetricsDetailsReportResponse } from '../models/types/metrics/responses/metrics-details-report.interface';
import { TMetricsOverviewReportResponse } from '../models/types/metrics/responses/metrics-overview-report.type';

import { useAxiosGet } from './api';

/**
 * Fetches the list of reports
 *
 * @param backendUrl - The URL of the backend
 * @param requestOverviewParams - The filter parameters for the requests
 */
export const useMetricsReportList = (
    backendUrl: string,
    requestOverviewParams: IMetricsRequestParamsOverview,
    rerender?: string,
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


/**
 * Fetches the details of a report
 *
 * @param backendUrl - The URL of the backend
 * @param requestDetailsParams - The filter parameters for the requests
 */
export const useMetricsReportDetail = (backendUrl: string, requestDetailsParams: TMetricsDetailsRequestParams) => {
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
