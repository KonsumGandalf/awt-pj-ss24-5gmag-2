const express = require('express');
const Utils = require('../../utils/utils');

const router = express.Router();

/**
 * Flag to check if intervals are set
 */
let intervalsSet = false;

/**
 * This endpoint functions as an event source that sends a message every time a new file is written.
 * This is base on {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events SSE } (Server-Sent Events)
 */
router.get('/reload', (req, res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Encoding': 'none',
    });

    const subscription = Utils.fileWritten$.subscribe({
        next: async ({ content, topic }) => {
            res.write(`event: ${topic}\ndata: A new file has been written\n\n`);
        },
        error: (err) => {
            console.error(err);
            res.status(500).send(err.message);
        },
    });

    req.on('close', () => {
        subscription.unsubscribe();
    });

    if (intervalsSet === false) {
        Utils.triggerIrregularInterval('consumption', 'test', 5000, 15000);
        Utils.triggerIrregularInterval('metrics', 'test2', 15000, 25000);

        intervalsSet = true;
    }
});

module.exports = router;
