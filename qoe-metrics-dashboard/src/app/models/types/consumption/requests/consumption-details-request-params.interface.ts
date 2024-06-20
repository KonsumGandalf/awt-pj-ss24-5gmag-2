import { ConsumptionReportingUnit, IConsumptionDetailReport } from '../responses/consumption-details-report.interface';

/**
 * The endpoint allows to filter based on the properties of the consumption report
 */
export type TConsumptionDetailsRequestParams =
    Pick<IConsumptionDetailReport, 'reportingClientId'> |
    Pick<ConsumptionReportingUnit, 'startTime'> & { duration: string };
