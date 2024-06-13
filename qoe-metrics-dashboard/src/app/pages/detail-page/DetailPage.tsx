import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import BasicInformationTables from '../../components/basic-information-tables/BasicInformationTables';
import BufferLevelChart from '../../components/buffer-level-chart/BufferLevelChart';
import HttpListChart from '../../components/http-list-chart/HttpListChart';
import MPDInformationTable from '../../components/mpd-information-table/MPDInformationTable';
import RepSwitchesChart from '../../components/rep-switches-chart/RepSwitchesChart';
import { EnvContext } from '../../env.context';
import { useReportDetail } from '../../hooks/api';
import { TMetricsDetailsRequestParams } from '../../models/types/requests/metrics-details-request-params.type';

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
            {Array.isArray(reportDetails) &&
                reportDetails.map((report) => (
                    <DetailPageContext.Provider
                        value={reportDetails}
                        key={
                            report.ReceptionReport.QoeReport.recordingSessionId +
                            report.ReceptionReport.QoeReport.reportTime
                        }
                    >
                        {Array.isArray(report?.ReceptionReport.QoeReport.QoeMetric) && (
                            <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
                                <BasicInformationTables
                                    receptionReport={report.ReceptionReport}
                                ></BasicInformationTables>
                                <MPDInformationTable
                                    mpdInfo={
                                        report?.ReceptionReport.QoeReport.QoeMetric?.find(
                                            (metric) => metric.MPDInformation
                                        )?.MPDInformation
                                    }
                                ></MPDInformationTable>
                                <BufferLevelChart
                                    bufferLevel={
                                        report?.ReceptionReport.QoeReport.QoeMetric?.find(
                                            (metric) => metric.BufferLevel
                                        )?.BufferLevel
                                    }
                                ></BufferLevelChart>

                                <HttpListChart
                                    httpList={
                                        report?.ReceptionReport.QoeReport.QoeMetric?.find((metric) => metric.HttpList)
                                            ?.HttpList
                                    }
                                ></HttpListChart>

                                <RepSwitchesChart
                                    repSwitchList={
                                        report?.ReceptionReport.QoeReport.QoeMetric?.find(
                                            (metric) => metric.RepSwitchList
                                        )?.RepSwitchList
                                    }
                                    mpdInfo={
                                        report?.ReceptionReport.QoeReport.QoeMetric?.find(
                                            (metric) => metric.MPDInformation
                                        )?.MPDInformation
                                    }
                                ></RepSwitchesChart>
                            </Box>
                        )}
                    </DetailPageContext.Provider>
                ))}
        </Box>
    );
}

export default DetailPage;
