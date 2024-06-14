import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import { QoeMetric } from '../models/types/metrics/qoe-report.type';
import { TMetricsDetailReport } from '../models/types/responses/metrics-details-report.interface';

export const useQoeReport = (reports: TMetricsDetailReport[]) => {
    return reports.map((report) => {
        const QoeMetric = report?.ReceptionReport?.QoeReport?.QoeMetric;

        if (!QoeMetric) {
            return {
                receptionReport: report.ReceptionReport,
                mpdInfo: undefined,
                bufferLevel: undefined,
                httpList: undefined,
                repSwitchList: undefined,
            };
        }

        const findMetricValue = <T extends keyof QoeMetric>(metricName: T) => {
            return QoeMetric.find((metric) => metric[metricName] !== undefined)?.[metricName];
        };

        return {
            receptionReport: report.ReceptionReport,
            mpdInfo: findMetricValue(EMetricsType.MPD_INFORMATION),
            bufferLevel: findMetricValue(EMetricsType.BUFFER_LEVEL),
            httpList: findMetricValue(EMetricsType.HTTP_LIST),
            repSwitchList: findMetricValue(EMetricsType.REP_SWITCH_LIST),
        };
    });
};
