/**
 * The interface for requests parameters for the metrics report overview
 */
export interface IConsumptionOverviewRequestParams {
    /**
     * The id of the provision session (the video used in demo app) usually it is 1-6
     */
    provisionSessionIds: RegExp;
}
