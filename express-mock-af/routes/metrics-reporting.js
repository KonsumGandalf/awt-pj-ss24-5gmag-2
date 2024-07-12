const express = require('express');
const Utils = require('../utils/utils');

const router = express.Router();

router.post('/:provisioningSessionId/:metricsReportingConfigurationId', (req, res, next) => {
    const payload = req.body;
    const path = `public/reports/${req.params.provisioningSessionId}/metrics_reports/${
        req.params.metricsReportingConfigurationId
    }/${new Date().toISOString()}.xml`;

    Utils.writeToDisk(path, payload, 'metrics');
    res.send(204);
});

module.exports = router;
