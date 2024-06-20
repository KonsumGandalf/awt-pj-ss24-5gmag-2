import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import { TMappedQoeMetric, TMappedRepSwitchList } from '../models/types/metrics/qoe-report.type';
import { TMetricsDetailReport } from '../models/types/responses/metrics-details-report.interface';
import { QoeMetric } from '../models/types/responses/metrics-details-report.interface';

export const qoEMetricsFromReport = (report: TMetricsDetailReport): TMappedQoeMetric => {
    const QoeMetric = report?.ReceptionReport?.QoeReport?.QoeMetric;

    if (!QoeMetric) {
        return {
            mpdInfo: [],
            bufferLevel: [],
            httpList: [],
            repSwitchList: [],
        };
    }

    const findMetricValue = <T extends keyof QoeMetric>(metricName: T) => {
        return QoeMetric.find((metric) => metric[metricName] !== undefined)?.[metricName];
    };

    const mpdInfo = findMetricValue(EMetricsType.MPD_INFORMATION),
        bufferLevel = findMetricValue(EMetricsType.BUFFER_LEVEL),
        httpList = findMetricValue(EMetricsType.HTTP_LIST),
        repSwitchList = findMetricValue(EMetricsType.REP_SWITCH_LIST);

    const mappedMpdInfo = mpdInfo
        ? mpdInfo.map((i) => ({
              mimeType: i.Mpdinfo.mimeType,
              bandwidth: Number(i.Mpdinfo.bandwidth),
              representationId: i.representationId,
              codecs: i.Mpdinfo.codecs,
              height: i.Mpdinfo.height,
              width: i.Mpdinfo.width,
              frameRate: i.Mpdinfo.frameRate,
          }))
        : [];

    const mappedBufferLevel = bufferLevel
        ? bufferLevel.BufferLevelEntry.map((i) => ({
              level: Number(i.level),
              timeStamp: new Date(i.t).getTime(),
          }))
        : [];

    const mappedHttpList = httpList
        ? httpList.HttpListEntry.map((i) => ({
              type: i.type,
              duration: Number(i.Trace.d),
              transferedBytes: Number(i.Trace.b),
          }))
        : [];

    const mappedRepSwitchList = repSwitchList
        ? repSwitchList.RepSwitchEvent.reduce((acc, entry) => {
              const infoElement = mappedMpdInfo.find((info) => info.representationId === entry.to);
              if (!infoElement) return acc;
              const bandwidth = infoElement.bandwidth;
              const elem = {
                  MimeType: infoElement.mimeType,
                  timeStamp: new Date(entry.t).getTime(),
                  bandwidth: Number(bandwidth),
              };
              acc.push(elem);
              return acc;
          }, [] as TMappedRepSwitchList[])
        : [];

    return {
        mpdInfo: mappedMpdInfo,
        bufferLevel: mappedBufferLevel,
        httpList: mappedHttpList,
        repSwitchList: mappedRepSwitchList,
    };
};
