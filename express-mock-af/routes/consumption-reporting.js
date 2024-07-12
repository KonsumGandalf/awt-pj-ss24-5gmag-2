const express = require('express');
const Utils = require('../utils/utils.js');

const router = express.Router();

router.post('/:provisioningSessionId?', (req, res, next) => {
    if (!req.params.provisioningSessionId) {
        return res.status(400).send('provisioningSessionId is required');
    }
    if (!req.body.reportingClientId) {
        return res.status(400).send('reportingClientId in body is required');
    }

    try {
        const payload = req.body;
        const path = `public/reports/${req.params.provisioningSessionId}/consumption_reports/${payload.reportingClientId}_${new Date().toISOString()}.json`;

        Utils.writeToDisk(path, JSON.stringify(payload), 'consumption');
        res.sendStatus(204);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.message);
    }
});

module.exports = router;
