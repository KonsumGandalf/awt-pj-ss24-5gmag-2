import { EMetricsType } from '../../../enums/metrics/metrics-type.enum';

/**
 * The response type for the backend endpoint for metrics report detail
 */
export type TMetricsDetailsReportResponse = IMetricsDetailReport[];

/**
 * The interface for a single metrics report detail
 */
export interface IMetricsDetailReport {
    ReceptionReport: IReceptionReport;
}

/**
 * Template for a reception report
 */
export interface IReceptionReport {
    clientID: string;
    contentURI: string;
    'xsi:schemaLocation': string;
    'xmlns:sv': string;
    xmlns: string;
    'xmlns:xsi': string;
    QoeReport: IQoeReport;
}

/**
 * The interface for a QoE report
 */
export interface IQoeReport {
    recordingSessionId: string;
    reportPeriod: string;
    reportTime: string;
    periodID: string;
    QoeMetric?: IQoeMetric[];
}

export interface IQoeMetric {
    [EMetricsType.BUFFER_LEVEL]?: BufferLevel;
    [EMetricsType.HTTP_LIST]?: HttpList;
    [EMetricsType.MPD_INFORMATION]?: MPDInformation[];
    [EMetricsType.REP_SWITCH_LIST]?: RepSwitchList;
}

export interface RepSwitchList {
    RepSwitchEvent: RepSwitchEvent[];
}

export interface RepSwitchEvent {
    mt: string;
    t: string;
    to: string;
}

export interface MPDInformation {
    representationId: string;
    Mpdinfo: Mpdinfo;
}

export interface Mpdinfo {
    bandwidth: string;
    codecs: string;
    mimeType: string;
    frameRate?: string;
    height?: string;
    width?: string;
}

export interface HttpList {
    HttpListEntry: HttpListEntry[];
}

export interface HttpListEntry {
    actualurl: string;
    interval: string;
    range: string;
    responsecode: string;
    trequest: string;
    tresponse: string;
    type: string;
    url: string;
    Trace: Trace;
}

export interface Trace {
    b: string;
    d: string;
    s: string;
}

export interface BufferLevel {
    BufferLevelEntry: BufferLevelEntry[];
}

export interface BufferLevelEntry {
    level: string;
    t: string;
}
