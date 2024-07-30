const request = require('supertest');
const express = require('express');

const router = require('../app');

const app = express();
app.use(express.json());
app.use(router);

describe('/users', () => {
    it('should return a 200 status code', async () => {
        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.text).toEqual('respond with a resource');
    });
});
