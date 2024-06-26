express = require('express');
const Utils = require('../../utils/Utils');
const ReportsService = require('../../services/reports.service');
var router = express.Router();

const reportsService = new ReportsService();

/**
 * This endpoint returns an overview of all the consumption reports for the given provisionSessionIds
 */
router.get('/', async (req, res) => {
    let provisionSessionIds = req.query.provisionSessionIds;
    if (!provisionSessionIds) {
        return res.status(400).send('provisionSessionId is required');
    }

    provisionSessionIds = Utils.regexRangeToArray(provisionSessionIds);

    const report = await reportsService.generateConsumptionReport(provisionSessionIds, req.query);
    res.status(200).send(report);
});

router.get('/details', async (req, res) => {
    const readContent = await Utils.readFiles('public/reports', /\.json$/);
    const transformedJsonResponse = await reportsService.transformJSONtoReport(readContent);
    const filteredList = await reportsService.filterReports(transformedJsonResponse, req.query);
    res.status(200).send(filteredList);
});

module.exports = router;
