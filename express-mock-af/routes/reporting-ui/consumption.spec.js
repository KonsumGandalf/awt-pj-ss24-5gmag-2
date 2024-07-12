const request = require('supertest');
const express = require('express');
const Utils = require('../../utils/Utils');
const ReportsService = require('../../services/reports.service');

jest.mock('../../utils/Utils', () => ({
    readFiles: jest.fn(),
    regexRangeToArray: jest.fn()
}));

const reportsService = new ReportsService();
jest.mock('../../services/reports.service', () => {
    return jest.fn().mockReturnValue({
        generateConsumptionReport: jest.fn(),
        transformJSONtoReport: jest.fn(),
        filterReports: jest.fn()
    });
});

const router = require('../../app');
const app = express();
app.use(express.json());
app.use(router);

describe('/reporting-ui/consumption', () => {
    const basePath = '/reporting-ui/consumption';

    describe('GET /', () => {
        it('should return 400 if provisionSessionIds is not provided', async () => {
            await request(app)
                .get(basePath)
                .expect(400, 'provisionSessionIds is required');
        });

        it('should return 200 and the report for valid provisionSessionIds', async () => {
            const provisionSessionIds = '1-3';
            const provisionSessionArray = [1, 2, 3];
            const report = { reportData: 'some data' };
            const spyGenerateConsumptionReport = jest.spyOn(reportsService, 'generateConsumptionReport').mockResolvedValue(report);
            const spyRegex = jest.spyOn(Utils, 'regexRangeToArray').mockReturnValue(provisionSessionArray);

            const response = await request(app)
                .get(basePath)
                .query({ provisionSessionIds });

            expect(spyRegex).toHaveBeenCalledWith(provisionSessionIds);
            expect(spyGenerateConsumptionReport).toHaveBeenCalledWith(provisionSessionArray, { provisionSessionIds: '1-3' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(report);
        });
    });

    describe('GET /details', () => {
        it('should return 200 and the filtered report details', async () => {
            const readContent = [{ reportData: 'some data' }];
            const transformedJsonResponse = [{ reportData: 'some data' }];
            const filteredList = [{ reportData: 'some data' }];
            const spyReadFiles = jest.spyOn(Utils, 'readFiles').mockResolvedValue(readContent);
            const spyTransformJSONtoReport = jest.spyOn(reportsService, 'transformJSONtoReport').mockResolvedValue(transformedJsonResponse);
            const spyFilterReports = jest.spyOn(reportsService, 'filterReports').mockResolvedValue(filteredList);

            const response = await request(app)
                .get(`${basePath}/details`)
                .query({ testParam: 'testValue' });
            ;

            expect(spyReadFiles).toHaveBeenCalledWith('public/reports', /\.json$/);
            expect(spyTransformJSONtoReport).toHaveBeenCalledWith(readContent);
            expect(spyFilterReports).toHaveBeenCalledWith(transformedJsonResponse, { testParam: 'testValue' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(filteredList);
        });
    });
});
