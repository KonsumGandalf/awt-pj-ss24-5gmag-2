import { EMetricsType } from '../models/enums/metrics/metrics-type.enum';
import { TMetricsDetailsReportResponse } from '../models/types/metrics/responses/metrics-details-report.interface';

import MetricReportUtils from './metric-report-utils';

describe('MetricReportUtils', () => {
    describe('aggregateMetricReports', () => {
        it('should return undefined when metricReports is undefined or empty', () => {
            expect(MetricReportUtils.aggregateMetricReports(undefined)).toBeUndefined();
            expect(MetricReportUtils.aggregateMetricReports([])).toBeUndefined();
        });

        it('should aggregate metric reports correctly', () => {
            const metricReports: TMetricsDetailsReportResponse = [
                {
                    ReceptionReport: {
                        clientID: 'client1',
                        contentURI: 'http://example.com/content1',
                        'xsi:schemaLocation': 'http://www.example.com/schema1',
                        'xmlns:sv': 'http://www.example.com/sv1',
                        xmlns: 'http://www.example.com',
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                        QoeReport: {
                            recordingSessionId: 'session1',
                            reportPeriod: 'period1',
                            periodID: '1',
                            reportTime: '2021-01-01T00:00:00Z',
                            QoeMetric: [
                                {
                                    [EMetricsType.BUFFER_LEVEL]: {
                                        BufferLevelEntry: [{ level: '10', t: '2021-01-01T00:00:00Z' }],
                                    },
                                    [EMetricsType.HTTP_LIST]: {
                                        HttpListEntry: [
                                            {
                                                type: 'GET',
                                                Trace: { d: '200', b: '1000', s: '1' },
                                                url: 'http://example.com',
                                                actualurl: 'http://example.com',
                                                interval: '1000',
                                                range: 'bytes=0-1000',
                                                responsecode: '200',
                                                trequest: '2021-01-01T00:00:00Z',
                                                tresponse: '2021-01-01T00:00:01Z',
                                            },
                                        ],
                                    },
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
                                    [EMetricsType.REP_SWITCH_LIST]: {
                                        RepSwitchEvent: [{ to: '1', t: '2021-01-01T00:00:00Z', mt: '1' }],
                                    },
                                },
                            ],
                        },
                    },
                },
                {
                    ReceptionReport: {
                        clientID: 'client2',
                        contentURI: 'http://example.com/content2',
                        'xsi:schemaLocation': 'http://www.example.com/schema2',
                        'xmlns:sv': 'http://www.example.com/sv2',
                        xmlns: 'http://www.example.com',
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                        QoeReport: {
                            recordingSessionId: 'session2',
                            reportPeriod: 'period2',
                            periodID: '2',
                            reportTime: '2021-01-02T00:00:00Z',
                            QoeMetric: [
                                {
                                    [EMetricsType.BUFFER_LEVEL]: {
                                        BufferLevelEntry: [{ level: '20', t: '2021-01-02T00:00:00Z' }],
                                    },
                                    [EMetricsType.HTTP_LIST]: {
                                        HttpListEntry: [
                                            {
                                                type: 'POST',
                                                Trace: { d: '300', b: '2000', s: '1' },
                                                actualurl: 'http://example.com',
                                                interval: '1000',
                                                range: 'bytes=0-1000',
                                                responsecode: '200',
                                                trequest: '2021-01-02T00:00:00Z',
                                                tresponse: '2021-01-02T00:00:01Z',
                                                url: 'http://example.com',
                                            },
                                        ],
                                    },
                                    [EMetricsType.MPD_INFORMATION]: [
                                        {
                                            Mpdinfo: {
                                                mimeType: 'video/mp4',
                                                bandwidth: '6000',
                                                codecs: 'avc1.64001f',
                                                height: '720',
                                                width: '1280',
                                                frameRate: '60',
                                            },
                                            representationId: '2',
                                        },
                                    ],
                                    [EMetricsType.REP_SWITCH_LIST]: {
                                        RepSwitchEvent: [{ to: '2', t: '2021-01-02T00:00:00Z', mt: '1' }],
                                    },
                                },
                            ],
                        },
                    },
                },
            ];

            const result = MetricReportUtils.aggregateMetricReports(metricReports);

            expect(result).toBeDefined();
            expect(result?.length).toBe(1);

            const aggregatedReport = result![0];
            expect(aggregatedReport.ReceptionReport.QoeReport.reportTime).toBe(
                '2021-01-01T00:00:00Z, 2021-01-02T00:00:00Z'
            );
            expect(aggregatedReport.ReceptionReport.QoeReport.QoeMetric).toEqual([
                {
                    [EMetricsType.BUFFER_LEVEL]: {
                        BufferLevelEntry: [
                            { level: '10', t: '2021-01-01T00:00:00Z' },
                            { level: '20', t: '2021-01-02T00:00:00Z' },
                        ],
                    },
                },
                {
                    [EMetricsType.HTTP_LIST]: {
                        HttpListEntry: [
                            {
                                type: 'GET',
                                Trace: { d: '200', b: '1000', s: '1' },
                                url: 'http://example.com',
                                actualurl: 'http://example.com',
                                interval: '1000',
                                range: 'bytes=0-1000',
                                responsecode: '200',
                                trequest: '2021-01-01T00:00:00Z',
                                tresponse: '2021-01-01T00:00:01Z',
                            },
                            {
                                type: 'POST',
                                Trace: { d: '300', b: '2000', s: '1' },
                                url: 'http://example.com',
                                actualurl: 'http://example.com',
                                interval: '1000',
                                range: 'bytes=0-1000',
                                responsecode: '200',
                                trequest: '2021-01-02T00:00:00Z',
                                tresponse: '2021-01-02T00:00:01Z',
                            },
                        ],
                    },
                },
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
                        {
                            Mpdinfo: {
                                mimeType: 'video/mp4',
                                bandwidth: '6000',
                                codecs: 'avc1.64001f',
                                height: '720',
                                width: '1280',
                                frameRate: '60',
                            },
                            representationId: '2',
                        },
                    ],
                },
                {
                    [EMetricsType.REP_SWITCH_LIST]: {
                        RepSwitchEvent: [
                            { to: '1', t: '2021-01-01T00:00:00Z', mt: '1' },
                            { to: '2', t: '2021-01-02T00:00:00Z', mt: '1' },
                        ],
                    },
                },
            ]);
        });
    });
});
