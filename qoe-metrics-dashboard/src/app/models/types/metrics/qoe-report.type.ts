export type TMappedReportResponse = {
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
