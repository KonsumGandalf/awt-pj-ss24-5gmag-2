import Box from '@mui/material/Box';

import BasicInformationTables from '../../../components/basic-information-tables/BasicInformationTables';
import BufferLevelChart from '../../../components/buffer-level-chart/BufferLevelChart';
import HttpListChart from '../../../components/http-list-chart/HttpListChart';
import MPDInformationTable from '../../../components/mpd-information-table/MPDInformationTable';
import RepSwitchesChart from '../../../components/rep-switches-chart/RepSwitchesChart';
import { TMappedReportDetails } from '../../../models/types/metrics/qoe-report.type';

export function DetailPageContent({ reportDetails }: { reportDetails: TMappedReportDetails }) {
    const { mpdInfo, bufferLevel, httpList, repSwitchList } = reportDetails.QoeReport;

    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'} width={'90%'} maxWidth={900}>
            <BasicInformationTables reportDetails={reportDetails}></BasicInformationTables>
            <MPDInformationTable mpdInfo={mpdInfo}></MPDInformationTable>
            <BufferLevelChart bufferLevel={bufferLevel}></BufferLevelChart>
            <HttpListChart httpList={httpList}></HttpListChart>
            <RepSwitchesChart repSwitchList={repSwitchList} mpdInfo={mpdInfo}></RepSwitchesChart>
        </Box>
    );
}
