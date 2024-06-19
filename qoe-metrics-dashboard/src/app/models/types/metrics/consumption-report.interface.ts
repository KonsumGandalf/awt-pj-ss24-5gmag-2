export type TConsumptionOverviewReportResponse = IConsumptionDetailReport[];

export interface IConsumptionDetailReport {
    mediaPlayerEntry: string;
    reportingClientId: string;
    consumptionReportingUnits: ConsumptionReportingUnit[];
    stability: number;
}

export interface ConsumptionReportingUnit {
    mediaConsumed: string;
    clientEndpointAddress: ClientEndpointAddress;
    serverEndpointAddress: ServerEndpointAddress;
    startTime: string;
    duration: number;
    locations: never[];
    stability: number;
}

export interface ClientEndpointAddress {
    ipv4Addr: string;
    portNumber: number;
    stability: number;
}

export interface ServerEndpointAddress {
    domainName: string;
    portNumber: number;
    stability: number;
}
