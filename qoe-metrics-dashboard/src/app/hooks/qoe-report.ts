import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import { QoeMetric } from '../models/types/metrics/qoe-report.type';
import { TMetricsDetailReport } from '../models/types/responses/metrics-details-report.interface';

export const useQoeReport = (report: TMetricsDetailReport) => {
    const QoeMetric = report?.ReceptionReport?.QoeReport?.QoeMetric;

    if (!QoeMetric) {
        return {
            mpdInfo: undefined,
            bufferLevel: undefined,
            httpList: undefined,
            repSwitchList: undefined,
        };
    }

    const findMetricValue = <T extends keyof QoeMetric>(metricName: T) => {
        const metric = QoeMetric.find((metric) => metric[metricName] !== undefined);
        return metric ? metric[metricName] : undefined;
    };

    return {
        mpdInfo: findMetricValue(EMetricsType.MPD_INFORMATION),
        bufferLevel: findMetricValue(EMetricsType.BUFFER_LEVEL),
        httpList: findMetricValue(EMetricsType.HTTP_LIST),
        repSwitchList: findMetricValue(EMetricsType.REP_SWITCH_LIST),
    };
};
