const request = require('supertest');
const express = require('express');
const { Subject } = require('rxjs');
const Utils = require('../../utils/Utils');

jest.mock('../../utils/Utils', () => ({
    triggerIrregularInterval: jest.fn()
}));

const router = require('../../app');
const app = express();
app.use(router);

describe('GET /reload', () => {
    let req;
    beforeEach(() => {
        const fileWritten$ = new Subject();
        Utils.fileWritten$ = fileWritten$;

        req = request(app)
            .get('/reporting-ui/sse/reload')
            .set('Accept', 'text/event-stream');
    });

    it('should return a sse stream on connection', (done) => {
        req.end((err, res) => {
            if (err) return done(err);

            expect(res.status).toBe(200);
            expect(res.headers).toMatch({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/event-stream; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Encoding': 'none'
            });

            const testEvent = { content: 'test content', topic: 'testTopic' };
            Utils.fileWritten$.next(testEvent);

            res.on('data', (chunk) => {
                const message = `event: ${testEvent.topic}\ndata: A new file has been written\n\n`;
                expect(chunk).toContain(message);

                req.abort();
                done();
            });
        });

        setTimeout(() => {
            req.abort();
            done();
        }, 1000);
    });

    it('should set interval only once for each topic', (done) => {
        req.end((err, res) => {
            if (err) return done(err);

            res.on('data', (chunk) => {
                expect(res.status).toBe(200);
                expect(Utils.triggerIrregularInterval).toHaveBeenCalledTimes(2);
                expect(Utils.triggerIrregularInterval).toHaveBeenNthCalledWith(1, 'consumption', 'test', 5000, 15000);
                expect(Utils.triggerIrregularInterval).toHaveBeenNthCalledWith(2, 'metrics', 'test2', 15000, 25000);

                req.abort();
                done();
            });
        });

        setTimeout(() => {
            req.abort();
            done();
        }, 1000);
    });

    it('should notifiy the client when a file is written', (done) => {
        req.end((err, res) => {
            if (err) return done(err);

            const testEvent = { content: 'test content', topic: 'testTopic' };
            Utils.fileWritten$.next(testEvent);

            res.on('data', (chunk) => {
                const message = `event: ${testEvent.topic}\ndata: A new file has been written\n\n`;
                expect(chunk).toContain(message);

                req.abort();
                done();
            });
        });

        setTimeout(() => {
            req.abort();
            done();
        }, 1000);
    });
});
