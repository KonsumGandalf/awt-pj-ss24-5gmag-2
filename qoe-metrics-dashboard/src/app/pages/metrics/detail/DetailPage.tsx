import { Box, CircularProgress } from '@mui/material';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { EnvContext } from '../../../env.context';
import { useMetricsReportDetail } from '../../../hooks/metrics-api';
import { TMetricsDetailsRequestParams } from '../../../models/types/metrics/requests/metrics-details-request-params.type';

import { DetailPageContent } from './DetailPageContent';
import { DetailPageContext } from './DetailPageContext';

import './DetailPage.scss';

function DetailPage() {
    const envCtx = useContext(EnvContext);

    const [searchParams] = useSearchParams();

    const { reportDetails, error, loading } = useMetricsReportDetail(
        envCtx.backendUrl,
        searchParams as unknown as TMetricsDetailsRequestParams
    );

    if (loading) {
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!reportDetails) {
        return <div>No Data found</div>;
    }

    return (
        <Box padding={'2rem'} component={'div'} overflow={'scroll'}>
            {reportDetails.map((report) => (
                <DetailPageContext.Provider
                    value={reportDetails}
                    key={
                        report.ReceptionReport.QoeReport.recordingSessionId +
                        report.ReceptionReport.QoeReport.reportTime
                    }
                >
                    <DetailPageContent report={report} />
                </DetailPageContext.Provider>
            ))}
        </Box>
    );
}

export default DetailPage;
