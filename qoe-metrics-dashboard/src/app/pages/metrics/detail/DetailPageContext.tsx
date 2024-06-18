import { createContext } from 'react';
import { TMappedReportDetails } from 'src/app/hooks/api';

import { TMetricsDetailsReportResponse } from '../../../models/types/metrics/responses/metrics-details-report.interface';

export const DetailPageContext = createContext<
    TMetricsDetailsReportResponse
>(
    {} as TMetricsDetailsReportResponse
);
