import { EMetricsType } from '../../enums/metrics/metrics-type.enum';

export type TReportResponse = {
    reportDetails?: TMappedReportDetails;
    error: any;
    loading: boolean;
};

export type TMappedReportDetails = {
    ClientID: string;
    ContentURI: string;
    xmlns: string;
    'xmlns:sv': string;
    'xsi:schemaLocation': string;
    'xmlns:xsi': string;
    QoeReport: {
        RecordingSessionID: string;
        ReportPeriod: string;
        ReportTime: string;
        PeriodID: string;
    } & TMappedQoeMetric;
};

export type TMappedQoeMetric = {
    mpdInfo: TMappedMpdInfo[];
    bufferLevel: TMappedBufferLevel[];
    httpList: TMappedHttpList[];
    repSwitchList: TMappedRepSwitchList[];
};

export type TMappedMpdInfo = {
    mimeType: string;
    bandwidth: number;
    representationId: string;
    codecs: string;
    height?: string;
    width?: string;
    frameRate?: string;
};

export type TMappedBufferLevel = {
    level: number;
    timeStamp: number;
};

export type TMappedHttpList = {
    type: string;
    duration: number;
    transferedBytes: number;
};

export type TMappedRepSwitchList = {
    MimeType: string;
    timeStamp: number;
    bandwidth: number;
};

export interface QoeMetric {
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
