var express = require('express');
const Utils = require('../../utils/Utils');
const ReportsService = require('../../services/reports.service');
var router = express.Router();

const reportsService = new ReportsService();

/**
 * This endpoint returns an overview of all the metrics for the given provisionSessionIds
 */
router.get('/', async (req, res) => {
    let provisionSessionIds = req.query.provisionSessionIds;
    if (!provisionSessionIds) {
        return res.status(400).send('provisionSessionIds is required');
    }

    provisionSessionIds = Utils.regexRangeToArray(provisionSessionIds);

    const report = await reportsService.generateMetricsReport(provisionSessionIds, req.query);
    res.status(200).send(report);
});

/**
 * This endpoint filters reports based on the query parameters and returns them in a detailed format
 */
router.get('/details', async (req, res) => {
    const readContent = await Utils.readFiles('public/reports', /\.xml$/);
    const transformedJsonResponse = await reportsService.transformXmlToReport(readContent);
    const filteredList = await reportsService.filterReports(transformedJsonResponse, req.query);
    res.status(200).send(filteredList);
});

module.exports = router;
