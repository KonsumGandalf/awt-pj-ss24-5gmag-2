import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { EnvContext } from '../../env.context';
import { useReportDetail } from '../../hooks/api';
import { TMetricsDetailsRequestParams } from '../../models/types/requests/metrics-details-request-params.type';

import { DetailContent } from './DetailContent';
import { DetailPageContext } from './DetailPage.context';

import './DetailPage.scss';

function DetailPage() {
    const envCtx = useContext(EnvContext);

    const [searchParams] = useSearchParams();

    const { reportDetails, error, loading } = useReportDetail(
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
                    <DetailContent report={report} />
                </DetailPageContext.Provider>
            ))}
        </Box>
    );
}

export default DetailPage;
