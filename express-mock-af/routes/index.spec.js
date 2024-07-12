const request = require('supertest');
const express = require('express');
const indexRouter = require('../app');

const app = express();
app.use('/', indexRouter);

describe('GET /', () => {
    it('should render the index page with title "Express"', (done) => {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)
            .expect((res) => {
                if (!res.text.includes('<title>Express</title>')) {
                    throw new Error('Missing title Express');
                }
            })
            .end(done);
    });
});
