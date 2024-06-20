import Box from '@mui/material/Box';

import BasicInformationTables from '../../../components/basic-information-tables/BasicInformationTables';
import BufferLevelChart from '../../../components/buffer-level-chart/BufferLevelChart';
import HttpListChart from '../../../components/http-list-chart/HttpListChart';
import MPDInformationTable from '../../../components/mpd-information-table/MPDInformationTable';
import RepSwitchesChart from '../../../components/rep-switches-chart/RepSwitchesChart';
import { useQoeReport } from '../../../hooks/qoe-report';
import { IMetricsDetailReport } from '../../../models/types/metrics/responses/metrics-details-report.interface';

export function DetailPageContent({ report }: { report: IMetricsDetailReport }) {
    const { mpdInfo, bufferLevel, httpList, repSwitchList } = useQoeReport(report);

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'}>
            <BasicInformationTables receptionReport={report.ReceptionReport}></BasicInformationTables>
            <MPDInformationTable mpdInfo={mpdInfo}></MPDInformationTable>
            <BufferLevelChart bufferLevel={bufferLevel}></BufferLevelChart>
            <HttpListChart httpList={httpList}></HttpListChart>
            <RepSwitchesChart repSwitchList={repSwitchList} mpdInfo={mpdInfo}></RepSwitchesChart>
        </Box>
    );
}
