import { cloneDeep } from 'lodash';

import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import {
    BufferLevel,
    HttpList,
    MPDInformation,
    RepSwitchList,
} from '../models/types/responses/metrics-details-report.interface';
import {
    TMetricsDetailReport,
    TMetricsDetailsReportResponse,
} from '../models/types/responses/metrics-details-report.interface';

export default class MetricReportUtils {
    static aggregateMetricReports(
        metricReports?: TMetricsDetailsReportResponse
    ): TMetricsDetailsReportResponse | undefined {
        if (!metricReports || !metricReports.length) {
            return;
        }
        const aggregatedReport: TMetricsDetailReport = cloneDeep(metricReports[0]);
        const aggregatedReportTime: string[] = [];
        const aggregatedBl: BufferLevel = {
            BufferLevelEntry: [],
        };
        const aggregatedHttpL: HttpList = {
            HttpListEntry: [],
        };
        const aggregatedMpd: MPDInformation[] = [];
        const aggregatedRsl: RepSwitchList = {
            RepSwitchEvent: [],
        };

        for (const r of metricReports) {
            aggregatedReportTime.push(r.ReceptionReport.QoeReport.reportTime);
            const newBl = r.ReceptionReport.QoeReport.QoeMetric?.find((m) => m.BufferLevel);
            if (newBl?.BufferLevel?.BufferLevelEntry) {
                aggregatedBl.BufferLevelEntry.push(...newBl.BufferLevel.BufferLevelEntry);
            }

            const newHttpL = r.ReceptionReport.QoeReport.QoeMetric?.find((m) => m.HttpList);
            if (newHttpL?.HttpList?.HttpListEntry) {
                aggregatedHttpL.HttpListEntry.push(...newHttpL.HttpList.HttpListEntry);
            }

            const newMpd = r.ReceptionReport.QoeReport.QoeMetric?.find((m) => m.MPDInformation);
            if (newMpd?.MPDInformation) {
                aggregatedMpd.push(...newMpd.MPDInformation);
            }

            const newRsl = r.ReceptionReport.QoeReport.QoeMetric?.find((m) => m.RepSwitchList);
            if (newRsl?.RepSwitchList?.RepSwitchEvent) {
                aggregatedRsl.RepSwitchEvent.push(...newRsl.RepSwitchList.RepSwitchEvent);
            }
        }
        const aggregatedMetrics = [
            { [EMetricsType.BUFFER_LEVEL]: aggregatedBl },
            { [EMetricsType.HTTP_LIST]: aggregatedHttpL },
            { [EMetricsType.MPD_INFORMATION]: aggregatedMpd },
            { [EMetricsType.REP_SWITCH_LIST]: aggregatedRsl },
        ];

        aggregatedReport.ReceptionReport.QoeReport.reportTime = aggregatedReportTime.join(', ');
        aggregatedReport.ReceptionReport.QoeReport.QoeMetric = aggregatedMetrics;

        return [aggregatedReport];
    }
}
