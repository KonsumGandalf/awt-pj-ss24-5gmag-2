var express = require('express');
var Utils = require('../utils/utils.js');
var router = express.Router();

router.post('/:provisioningSessionId?', function (req, res, next) {
  if (!req.params.provisioningSessionId) {
    return res.status(400).send('provisioningSessionId is required');
  } else if (!req.body.reportingClientId) {
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
