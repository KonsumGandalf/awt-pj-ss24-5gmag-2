import { isNil, omitBy } from 'lodash';
import { TMappedReportDetails, TMappedReportResponse } from '../models/types/metrics/qoe-report.type';
import { TMetricsDetailsRequestParams } from '../models/types/metrics/requests/metrics-details-request-params.type';

import { IMetricsRequestParamsOverview } from '../models/types/metrics/requests/metrics-overview-request-params.interface';
import { TMetricsDetailsReportResponse } from '../models/types/metrics/responses/metrics-details-report.interface';
import { TMetricsOverviewReportResponse } from '../models/types/metrics/responses/metrics-overview-report.type';
import MetricReportUtils from '../utils/metric-report-utils';

import { useAxiosGet } from './api';
import { qoEMetricsFromReport } from './qoe-report';

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
 * @param requestDetailsParams - The filter parameters for the request
 */
export const useMetricsReportDetail = (backendUrl: string, requestDetailsParams: TMetricsDetailsRequestParams): TMappedReportResponse => {
    const {
        response: reportDetails,
        error,
        loading
    } = useAxiosGet<TMetricsDetailsReportResponse>({
        url: `${backendUrl}/reporting-ui/metrics/details`,
        params: requestDetailsParams
    });
    const aggregatedMetricReports = MetricReportUtils.aggregateMetricReports(reportDetails);

    if (aggregatedMetricReports) {
        const firstReport = aggregatedMetricReports[0];

        const receptionReport = firstReport.ReceptionReport;

        const QoeMetrics = qoEMetricsFromReport(firstReport);

        const mappedReportList: TMappedReportDetails = {
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

                ...QoeMetrics
            }
        };

        return { reportDetails: mappedReportList, error, loading };
    }

    return { error, loading };
};
