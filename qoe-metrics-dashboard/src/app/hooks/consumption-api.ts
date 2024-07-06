import { isNil, omitBy } from 'lodash';

import { IConsumptionOverviewRequestParams } from '../models/types/consumption/requests/consumption-overview-request-params.interface';
import { TConsumptionDetailsReportResponse } from '../models/types/consumption/responses/consumption-details-report.interface';
import { TConsumptionOverviewReportResponse } from '../models/types/consumption/responses/consumption-overview-report.type';

import { useAxiosGet } from './api';

/**
 * Fetches the list of consumption reports
 *
 * @param backendUrl - The URL of the backend
 * @param requestOverviewParams - The filter parameters for the requests
 */
export const useConsumptionReportList = (
    backendUrl: string,
    requestOverviewParams: IConsumptionOverviewRequestParams,
    rerender?: string
) => {
    const cleanParams = omitBy(requestOverviewParams, isNil);

    const {
        response: reportList,
        error,
        loading,
    } = useAxiosGet<TConsumptionOverviewReportResponse>({
        url: `${backendUrl}/reporting-ui/consumption`,
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
export const useConsumptionReportDetail = (backendUrl: string, requestDetailsParams: URLSearchParams) => {
    const params = {
        startTime: requestDetailsParams.get('startTime'),
        duration: requestDetailsParams.get('duration'),
    };

    const { response, error, loading } = useAxiosGet<TConsumptionDetailsReportResponse>({
        url: `${backendUrl}/reporting-ui/consumption/details`,
        params,
    });

    const reportDetails = response && response.length > 0 ? response[0] : undefined;

    return { reportDetails: reportDetails, error, loading };
};
