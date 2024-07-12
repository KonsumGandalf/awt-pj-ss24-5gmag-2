const request = require('supertest');
const express = require('express');
const router = require('../app');

const app = express();
app.use(router);

describe('GET /provisioning-session/:provisioningSessionId', () => {
    it('should return the correct session information and headers', async () => {
        const provisioningSessionId = 6;
        const response = await request(app).get(`/3gpp-m5/v2/service-access-information/${provisioningSessionId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            provisioningSessionId: 6,
            provisioningSessionType: 'DOWNLINK',
            streamingAccess: {
                entryPoints: [
                    {
                        locator: 'http://10.147.67.85:3003/content/animated/dash.mpd',
                        contentType: 'application/dash+xml',
                        profiles: [
                            'urn:mpeg:dash:profile:isoff-live:2011'
                        ]
                    }
                ]
            },
            clientConsumptionReportingConfiguration: {
                serverAddresses: ['http://10.147.67.85:3003/3gpp-m5/v2/'],
                locationReporting: true,
                samplePercentage: 100,
                reportingInterval: 10,
                accessReporting: true
            },
            clientMetricsReportingConfigurations: [{
                metricsReportingConfigurationId: 'QM10',
                serverAddresses: ['http://10.147.67.85:3003/3gpp-m5/v2/'],
                scheme: 'urn:3GPP:ns:PSS:DASH:QM10',
                reportingInterval: 10,
                samplePercentage: 100.0,
                samplingPeriod: 10
            }, {
                metricsReportingConfigurationId: 'other',
                serverAddresses: ['http://10.147.67.85:3003/3gpp-m5/v2/'],
                scheme: 'urn:some:other:scheme',
                reportingInterval: 10,
                samplePercentage: 100.0,
                samplingPeriod: 10
            }]
        });

        expect(response.headers[ 'cache-control' ]).toBe('max-age=10');
        expect(response.headers[ 'age' ]).toBe('2');
        expect(response.headers[ 'expires' ]).toBeTruthy();
        expect(response.headers[ 'last-modified' ]).toBeTruthy();
    });

    it('should return 404 for non-existing session', async () => {
        const provisioningSessionId = 999;
        const response = await request(app).get(`/provisioning-session/${provisioningSessionId}`);

        expect(response.status).toBe(404);
    });
});
