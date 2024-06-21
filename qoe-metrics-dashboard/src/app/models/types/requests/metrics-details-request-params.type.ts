/**
 * The endpoint allows to filter based on the properties of the reception report and the QoE report
 */
export type TMetricsDetailsRequestParams = Pick<any, 'reportTime' | 'clientID' | 'recordingSessionId'>;
