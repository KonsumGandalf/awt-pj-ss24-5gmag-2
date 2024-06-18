import { createContext } from 'react';
import { TMappedReportDetails } from 'src/app/hooks/api';

export const DetailPageContext = createContext<TMappedReportDetails>({} as TMappedReportDetails);
