import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { EnvContext } from '../../../env.context';
import { useMetricsReportDetail } from '../../../hooks/metrics-api';

import { MetricsDetailPageContent } from './MetricsDetailPageContent';
import { MetricsDetailPageContext } from './MetricsDetailPageContext';

import './MetricsDetailPage.scss';

/**
 * MetricsDetailPage component displays the details of a metrics report. It uses the useSearchParams hook to get the search parameters from the URL.
 *
 * When loading, it displays a loading spinner.
 *
 * When an error occurs, it displays the error message.
 *
 * When no data is found, it displays a message.
 */
function MetricsDetailPage() {
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
        <Box
            padding={'2rem'}
            component={'div'}
            bgcolor={'background.default'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            sx={{
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
        >
            <MetricsDetailPageContext.Provider
                value={reportDetails}
                key={reportDetails.QoeReport.RecordingSessionID + reportDetails.QoeReport.ReportTime}
            >
                <MetricsDetailPageContent reportDetails={reportDetails} />
            </MetricsDetailPageContext.Provider>
        </Box>
    );
}

export default MetricsDetailPage;
