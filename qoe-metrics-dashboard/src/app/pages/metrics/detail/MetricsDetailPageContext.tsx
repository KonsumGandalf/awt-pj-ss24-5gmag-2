import { createContext } from 'react';

import { TMappedReportDetails } from '../../../models/types/metrics/qoe-report.type';

export const MetricsDetailPageContext = createContext<TMappedReportDetails>({} as TMappedReportDetails);
