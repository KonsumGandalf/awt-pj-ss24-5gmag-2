const request = require('supertest');
const express = require('express');
const Utils = require('../utils/Utils');

jest.mock('../utils/Utils', () => ({
    writeToDisk: jest.fn()
}));

const router = require('../app');
const app = express();
app.use(express.json());
app.use(router);

describe('/3gpp-m5/v2/consumption-reporting', () => {
    const basePath = '/3gpp-m5/v2/consumption-reporting';

    it('should return an error when no provisioningSessionId is provided', async () => {
        await request(app)
            .post(basePath)
            .expect(400, 'provisioningSessionId is required');
    });

    it('should return an error when no reportingClientId is provided', async () => {
        await request(app)
            .post(`${basePath}/12345`)
            .expect(400, 'reportingClientId in body is required');
    });

    it('should return 204 when provisioningSessionId is provided with a valid payload', async () => {
        const payload = {
            reportingClientId: 'client123',
            data: 'test data'
        };

        await request(app)
            .post(`${basePath}/12345`)
            .send(payload)
            .expect(204);

        expect(Utils.writeToDisk).toHaveBeenCalledWith(
            expect.stringContaining('12345'),
            JSON.stringify(payload),
            'consumption'
        );
    });
});
