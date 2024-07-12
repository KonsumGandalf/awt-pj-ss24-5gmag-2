const xml2js = require('xml2js');
const ReportsService = require('./reports.service'); // Adjust the path to your service
const Utils = require('../utils/utils');
const { chain } = require('lodash');
const { faker } = require('@faker-js/faker');
const { flatten } = require('express/lib/utils');

jest.mock('../utils/utils', () => ({
    readFiles: jest.fn(),
    writeToDisk: jest.fn(),
}));

describe('ReportsService', () => {
    let reportsService;

    beforeEach(() => {
        reportsService = new ReportsService();
    });

    describe('translateXmlToJson', () => {
        it('should translate XML to JSON', async () => {
            const xml = '<root><child>value</child></root>';

            const result = await reportsService.translateXmlToJson(xml);

            expect(result).toEqual({ root: { child: 'value' } });
        });
    });

    describe('transformXmlToReport', () => {
        it('should transform XML files to JSON reports', async () => {
            const xmlFiles = [
                '<root><child>value1</child></root>',
                '<root><child>value2</child></root>',
            ];

            const result = await reportsService.transformXmlToReport(xmlFiles);

            expect(result).toEqual([
                { root: { child: 'value1' } },
                { root: { child: 'value2' } },
            ]);
        });
    });

    describe('generateMetricsReport', () => {
        it('should generate a combined metrics report', async () => {
            Utils.readFiles.mockResolvedValueOnce([
                '<root><child>value1</child></root>',
            ]);
            const provisionSessionIds = [1];
            const queryFilter = {};
            jest.spyOn(reportsService, 'overviewMetricsReport').mockImplementationOnce(async (input) => input)

            const result = await reportsService.generateMetricsReport(provisionSessionIds, queryFilter);

            expect(result).toEqual([
                { root: { child: 'value1' } },
            ]);
        });
    });

    describe('transformJSONtoReport', () => {
        it('should transform JSON strings to JSON objects', () => {
            const jsonArray = [
                '{"key": "value1"}',
                '{"key": "value2"}',
            ];

            const result = reportsService.transformJSONtoReport(jsonArray);

            expect(result).toEqual([
                { key: 'value1' },
                { key: 'value2' },
            ]);
        });
    });

    describe('generateMetricsReport', () => {
        let reports;
        let expectedReports;
        let queryFilter;

        beforeEach(() => {
            const mockReport = (time) => jest.fn().mockReturnValue({
                ReceptionReport: {
                    clientID: faker.string.uuid(),
                    contentURI: faker.internet.url(),
                    QoeReport: {
                        reportTime: time,
                        reportPeriod: faker.number.int({ min: 10, max: 20 }),
                        recordingSessionId: faker.string.uuid(),
                    },
                },
            });

            reports = [];
            reports.push(mockReport(faker.date.future())());
            reports.push(mockReport(faker.date.recent())());
            reports.push(mockReport(faker.date.past())());

            expectedReports = [];
            for (let report of reports) {
                const receptionReport = {
                    clientID: report.ReceptionReport.clientID,
                    contentURI: report.ReceptionReport.contentURI,
                    availableMetrics: []
                };

                expectedReports.push({ ...receptionReport, ...report.ReceptionReport.QoeReport });
            }

            queryFilter = {};
        });

        describe('overviewMetricsReport', () => {
            it('should return an overview of the metrics reports with default ordering', async () => {
                const result = await reportsService.overviewMetricsReport(reports, queryFilter);
                expect(result).toEqual([
                    expectedReports[0],
                    expectedReports[1],
                    expectedReports[2],
                ]);
            });

            it('should return an overview of the metrics reports with custom ordering', async () => {
                queryFilter = { orderProperty: 'reportTime', sortingOrder: 'asc' };
                const result = await reportsService.overviewMetricsReport(reports, queryFilter);
                expect(result).toEqual([
                    expectedReports[2],
                    expectedReports[1],
                    expectedReports[0],
                ]);
            });

            it('should apply offset correctly', async () => {
                queryFilter = { offset: 1 };
                const result = await reportsService.overviewMetricsReport(reports, queryFilter);
                expect(result).toEqual([
                    expectedReports[1],
                    expectedReports[2],
                ]);
            });

            it('should apply limit correctly', async () => {
                queryFilter = { limit: 1 };
                const result = await reportsService.overviewMetricsReport(reports, queryFilter);
                expect(result).toEqual([
                    expectedReports[0],
                ]);
            });

            it('should apply both offset and limit correctly', async () => {
                queryFilter = { offset: 1, limit: 1 };
                const result = await reportsService.overviewMetricsReport(reports, queryFilter);
                expect(result).toEqual([
                    expectedReports[1],
                ]);
            });
        });
    });

    describe('generateConsumptionReport', () => {
        it('should generate a combined consumption report', async () => {
            Utils.readFiles.mockResolvedValueOnce([
                '{"reportingClientId": "client1", "consumptionReportingUnits": [{"startTime": "start1", "duration": 10}]}',
            ]);
            const provisionSessionIds = [1];
            const queryFilter = {};
            const result = await reportsService.generateConsumptionReport(provisionSessionIds, queryFilter);
            expect(result).toEqual([
                {
                    reportingClientId: 'client1',
                    consumptionReportingUnits: [{ startTime: 'start1', duration: 10 }],
                },
            ]);
        });
    });

    describe('overviewConsumptionReport', () => {
        it('should return an overview of the consumption reports', async () => {
            const reports = [
                {
                    reportingClientId: 'client1',
                    consumptionReportingUnits: [{ startTime: 'start1', duration: 10 }],
                },
            ];
            const queryFilter = {};
            const result = await reportsService.overviewConsumptionReport(reports, queryFilter);
            expect(result).toEqual(reports);
        });
    });

    describe('overviewMetricsReport', () => {
        it('should return an overview of the metrics reports', async () => {
            const reports = [
                {
                    ReceptionReport: {
                        clientID: 'client1',
                        QoeReport: {
                            reportPeriod: '10',
                            reportTime: 'time1',
                            recordingSessionId: 'session1',
                            QoeMetric: [{ metric1: 'value1' }],
                        },
                    },
                },
            ];
            const queryFilter = {};
            const result = await reportsService.overviewMetricsReport(reports, queryFilter);
            expect(result).toEqual([
                {
                    clientID: 'client1',
                    contentURI: undefined,
                    reportPeriod: '10',
                    reportTime: 'time1',
                    recordingSessionId: 'session1',
                    availableMetrics: ['metric1'],
                },
            ]);
        });
    });

    describe('filterReports', () => {
        it('should filter reports based on query parameters', () => {
            const reportsList = [
                {
                    ReceptionReport: {
                        QoeReport: {
                            recordingSessionId: 'session1',
                            reportTime: 'time1',
                        },
                    },
                    reportingClientId: 'client1',
                },
            ];
            const queryFilter = { recordingSessionId: 'session1', reportTime: 'time1' };
            const result = reportsService.filterReports(reportsList, queryFilter);
            expect(result).toEqual(reportsList);
        });

        it('should return 1 consumption report', () => {
            const reportsList = [
                {
                    consumptionReportingUnits: [
                        { startTime: 'start1', duration: 10 },
                    ],
                    reportingClientId: 'client1',
                },
                {
                    consumptionReportingUnits: [
                        { startTime: 'start1', duration: 20 },
                    ],
                    reportingClientId: 'client1',
                },
            ];
            const queryFilter = { startTime: 'start1', duration: 10 };
            const result = reportsService.filterReports(reportsList, queryFilter);
            expect(result).toEqual([reportsList[0]]);
        });

        it('should return all consumption reports if not filter is available', () => {
            const reportsList = [
                {
                    consumptionReportingUnits: [
                        { startTime: 'start1', duration: 10 },
                    ],
                    reportingClientId: 'client1',
                },
                {
                    consumptionReportingUnits: [
                        { startTime: 'start1', duration: 20 },
                    ],
                    reportingClientId: 'client1',
                },
            ];
            const queryFilter = {};
            const result = reportsService.filterReports(reportsList, queryFilter);
            expect(result).toEqual(reportsList);
        });
    });
});
