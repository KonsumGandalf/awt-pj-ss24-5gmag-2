import { createContext } from 'react';
import { TMappedReportDetails } from '../../../models/types/metrics/qoe-report.type';

export const DetailPageContext = createContext<
    TMappedReportDetails
>(
    {} as TMappedReportDetails
);
