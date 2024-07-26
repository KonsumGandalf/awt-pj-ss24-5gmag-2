import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import { IMetricsDetailReport } from '../models/types/metrics/responses/metrics-details-report.interface';

import { qoEMetricsFromReport } from './qoe-report';

describe('qoEMetricsFromReport', () => {
    it('should return empty arrays when QoeMetric is not present', () => {
        const report: IMetricsDetailReport = {
            ReceptionReport: {
                QoeReport: {},
            },
        } as IMetricsDetailReport;

        const result = qoEMetricsFromReport(report);

        expect(result).toEqual({
            mpdInfo: [],
            bufferLevel: [],
            httpList: [],
            repSwitchList: [],
        });
    });

    it('should map the QoE metrics correctly', () => {
        const report: IMetricsDetailReport = {
            ReceptionReport: {
                QoeReport: {
                    QoeMetric: [
                        {
                            [EMetricsType.MPD_INFORMATION]: [
                                {
                                    Mpdinfo: {
                                        mimeType: 'video/mp4',
                                        bandwidth: '5000',
                                        codecs: 'avc1.64001f',
                                        height: '1080',
                                        width: '1920',
                                        frameRate: '30',
                                    },
                                    representationId: '1',
                                },
                            ],
                            [EMetricsType.BUFFER_LEVEL]: {
                                BufferLevelEntry: [
                                    {
                                        level: '10',
                                        t: '2021-01-01T00:00:00Z',
                                    },
                                ],
                            },
                            [EMetricsType.HTTP_LIST]: {
                                HttpListEntry: [
                                    {
                                        type: 'GET',
                                        Trace: {
                                            d: '200',
                                            b: '1000',
                                        },
                                    },
                                ],
                            },
                            [EMetricsType.REP_SWITCH_LIST]: {
                                RepSwitchEvent: [
                                    {
                                        to: '1',
                                        t: '2021-01-01T00:00:00Z',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        } as IMetricsDetailReport;

        const result = qoEMetricsFromReport(report);

        expect(result).toEqual({
            mpdInfo: [
                {
                    mimeType: 'video/mp4',
                    bandwidth: 5000,
                    representationId: '1',
                    codecs: 'avc1.64001f',
                    height: '1080',
                    width: '1920',
                    frameRate: '30',
                },
            ],
            bufferLevel: [
                {
                    level: 10,
                    timeStamp: new Date('2021-01-01T00:00:00Z').getTime(),
                },
            ],
            httpList: [
                {
                    type: 'GET',
                    duration: 200,
                    transferedBytes: 1000,
                },
            ],
            repSwitchList: [
                {
                    MimeType: 'video/mp4',
                    timeStamp: new Date('2021-01-01T00:00:00Z').getTime(),
                    bandwidth: 5000,
                },
            ],
        });
    });
});
