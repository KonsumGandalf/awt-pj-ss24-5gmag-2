const request = require('supertest');
const express = require('express');
const Utils = require('../utils/utils');

jest.mock('../utils/utils', () => ({
    writeToDisk: jest.fn()
}));

const metricsReportingRouter = require('../routes/metrics-reporting');
const app = express();
app.use(express.json());
app.use('/3gpp-m5/v2/metrics-reporting', metricsReportingRouter);

describe('/3gpp-m5/v2/metrics-reporting', () => {
    it('should return 204 when provisioningSessionId and metricsReportingConfigurationId are provided with a valid payload', async () => {
        const payload = {
            reportingClientId: 'client123',
            data: 'test data'
        };

        await request(app)
            .post(`/3gpp-m5/v2/metrics-reporting/12345/67890`)
            .send(payload)
            .expect(204);

        expect(Utils.writeToDisk).toHaveBeenCalledWith(
            expect.stringContaining('12345/metrics_reports/67890'),
            payload,
            'metrics'
        );
    });
});
