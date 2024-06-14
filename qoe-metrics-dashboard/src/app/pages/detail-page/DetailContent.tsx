import Box from '@mui/material/Box';

import BasicInformationTables from '../../components/basic-information-tables/BasicInformationTables';
import BufferLevelChart from '../../components/buffer-level-chart/BufferLevelChart';
import HttpListChart, { TypeDataPoint } from '../../components/http-list-chart/HttpListChart';
import MPDInformationTable from '../../components/mpd-information-table/MPDInformationTable';
import RepSwitchesChart from '../../components/rep-switches-chart/RepSwitchesChart';
import { useQoeReport } from '../../hooks/qoe-report';
import { TMetricsDetailReport } from '../../models/types/responses/metrics-details-report.interface';

export function DetailContent({ reports }: { reports: TMetricsDetailReport[] }) {
    const computedReports = useQoeReport(reports);

    if (computedReports.length === 0) {
        return null;
    }

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
            <BasicInformationTables receptionReport={computedReports[0].receptionReport}></BasicInformationTables>
            <MPDInformationTable mpdInfo={computedReports[0].mpdInfo}></MPDInformationTable>
            <BufferLevelChart bufferLevel={computedReports[0].bufferLevel}></BufferLevelChart>
            <HttpListChart
                data={computedReports.reduce((acc, report) => {
                    if (!report.httpList) {
                        return acc;
                    }

                    report.httpList.HttpListEntry.forEach((httpList) => {
                        const key = report.receptionReport.clientID + '_' + httpList.type;
                        if (!acc[key]) {
                            acc[key] = [];
                        }

                        acc[key].push({
                            duration: Number(httpList.Trace.d),
                            transferedBytes: Number(httpList.Trace.b),
                        });
                    });

                    return acc;
                }, {} as TypeDataPoint)}
            ></HttpListChart>
            <RepSwitchesChart
                repSwitchList={computedReports[0].repSwitchList}
                mpdInfo={computedReports[0].mpdInfo}
            ></RepSwitchesChart>
        </Box>
    );
}
