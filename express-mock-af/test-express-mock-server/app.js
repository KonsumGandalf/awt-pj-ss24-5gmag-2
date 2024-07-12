const express = require('express');
const { log } = require('debug');
global.EventSource = require('eventsource');

/**
 * Create an express app which should validate the functionality of the SSE endpoint of the regular mock server.
 * @type {*|Express}
 */
const app = express();
const port = 3004;

app.get('/', (req, res) => {
    observeEndpoint();
    res.send(200);
});

function observeEndpoint() {
    const eventSource = new EventSource('http://localhost:3003/reporting-ui/sse/reload');

    eventSource.onopen = function () {
        log('Connection opened');
    };

    eventSource.onerror = function () {
        log('Event: error');
        if (this.readyState === EventSource.CONNECTING) {
            log(`Reconnecting (readyState=${this.readyState})...`);
        } else {
            log('Error has occurred.');
        }
    };

    eventSource.onmessage = function (e) {
        log(`Event: message, data: ${e.data}`);
    };

    eventSource.addEventListener('consumption', (e) => {
        log(e.data, 'consumption');
    });

    eventSource.addEventListener('metrics', (e) => {
        log(e.data, 'metrics');
    });
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    observeEndpoint();
});
