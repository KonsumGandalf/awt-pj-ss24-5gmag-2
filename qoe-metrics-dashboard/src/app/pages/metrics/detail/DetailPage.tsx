import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { EnvContext } from '../../../env.context';
import { useMetricsReportDetail } from '../../../hooks/metrics-api';

import { DetailPageContent } from './DetailPageContent';
import { DetailPageContext } from './DetailPageContext';

import './DetailPage.scss';

function DetailPage() {
    const envCtx = useContext(EnvContext);

    const [searchParams] = useSearchParams();

    const { reportDetails, error, loading } = useMetricsReportDetail(envCtx.backendUrl, searchParams);

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
            <DetailPageContext.Provider
                value={reportDetails}
                key={reportDetails.QoeReport.RecordingSessionID + reportDetails.QoeReport.ReportTime}
            >
                <DetailPageContent reportDetails={reportDetails} />
            </DetailPageContext.Provider>
        </Box>
    );
}

export default DetailPage;
