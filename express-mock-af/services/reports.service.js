const xml2js = require('xml2js');
const { filter, pick, chain, isNil, omitBy, defaults } = require('lodash');
const Utils = require('../utils/utils');

class ReportsService {
    /**
     * Translates XML to JSON
     *
     * @param xml
     * @returns {Promise<*>}
     */
    async translateXmlToJson(xml) {
        return xml2js.parseStringPromise(xml, {
            mergeAttrs: true,
            explicitArray: false,
        });
    }

    /**
     * Transforms XML to a report
     *
     * @param XmlFiles
     * @returns {Promise<any[]>}
     */
    async transformXmlToReport(XmlFiles) {
        return Object.values(
            omitBy(await Promise.all(XmlFiles.map(async (file) => await this.translateXmlToJson(file))), isNil)
        );
    }

    transformJSONtoReport(jsonArray) {
        if (Array.isArray(jsonArray)) {
            return jsonArray.map((jsonObj) => JSON.parse(jsonObj));
        }

        return JSON.parse(jsonArray);
    }

    /**
     * Reads multiple saved metrics reports and generates a combined report
     *
     * @param provisionSessionIds
     * @param queryFilter
     * @returns {Promise<(any)[] | *>}
     */
    async generateMetricsReport(provisionSessionIds, queryFilter) {
        const readContent = (
            await Promise.all(
                provisionSessionIds.map(async (id) => Utils.readFiles(`public/reports/${id}/metrics_reports`))
            )
        )
            .filter((content) => content.length !== 0)
            .flat();

        const transformedJsonResponse = await this.transformXmlToReport(readContent);
        return await this.overviewMetricsReport(transformedJsonResponse, queryFilter);
    }

    async generateConsumptionReport(provisionSessionIds, queryFilter) {
        const readContent = (
            await Promise.all(
                provisionSessionIds.map(async (id) => Utils.readFiles(`public/reports/${id}/consumption_reports`))
            )
        )
            .filter((content) => content.length !== 0)
            .flat();
        const transformedJsonResponse = this.transformJSONtoReport(readContent);

        return await this.overviewConsumptionReport(transformedJsonResponse, queryFilter);
    }

    async overviewConsumptionReport(reports, queryFilter) {
        return chain(reports)
            .map((report) => report)
            .value();
    }

    /**
     * Returns an overview of all the metrics for the given provisionSessionIds
     *
     * @param reports
     * @param queryFilter
     * @returns {Promise<(any)[]>}
     */
    async overviewMetricsReport(reports, queryFilter) {
        const { orderProperty, offset, limit, sortingOrder } = defaults(queryFilter, {
            orderProperty: 'reportTime',
            sortingOrder: 'desc',
        });

        return chain(reports)
            .map((report) => {
                const receptionReport = pick(report.ReceptionReport, ['clientID', 'contentURI']);

                const qoeReport = pick(report.ReceptionReport.QoeReport, [
                    'reportPeriod',
                    'reportTime',
                    'recordingSessionId',
                ]);

                const qoeMetric = report.ReceptionReport.QoeReport.QoeMetric;
                const availableMetrics = Array.isArray(qoeMetric)
                    ? qoeMetric.map((metric) => Object.keys(metric)[0])
                    : [];

                return defaults({}, receptionReport, qoeReport, { availableMetrics });
            })
            .orderBy(orderProperty, sortingOrder)
            .thru((chainInstance) => {
                let result = chain(chainInstance);
                if (offset !== undefined) {
                    result = result.drop(offset);
                }
                if (limit !== undefined) {
                    result = result.take(limit);
                }
                return result.value();
            })
            .value();
    }

    /**
     * Filters reports based on the query parameters
     *
     * @param reportsList
     * @param queryFilter
     * @returns {*}
     */
    filterReports(reportsList, queryFilter) {
        const clearQueryFilter = omitBy(queryFilter, isNil);
        return reportsList.filter((report) => {
            if (report.ReceptionReport) {
                const qoeReport = report.ReceptionReport.QoeReport;
                return (
                    qoeReport.recordingSessionId === clearQueryFilter.recordingSessionId &&
                    (qoeReport.reportTime === clearQueryFilter.reportTime ||
                        clearQueryFilter.reportTime.includes(qoeReport.reportTime))
                );
            }
            if (report.consumptionReportingUnits) {
                const filteredUnits = filter(report.consumptionReportingUnits, (unit) => {
                    const sameStartTime = queryFilter.startTime ? unit.startTime === queryFilter.startTime : true;
                    const sameDuration = queryFilter.duration ? unit.duration === +queryFilter.duration : true;
                    return sameStartTime && sameDuration;
                });

                const sameReportingClientId = queryFilter.reportingClientId
                    ? report.reportingClientId === queryFilter.reportingClientId
                    : true;
                return sameReportingClientId && filteredUnits.length > 0;
            }
            return true;
        });
    }
}

module.exports = ReportsService;
