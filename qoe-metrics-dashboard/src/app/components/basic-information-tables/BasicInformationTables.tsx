import dayjs from 'dayjs';

import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';

import { TMappedReportDetails } from '../../../app/models/types/metrics/qoe-report.type';

import './BasicInformationTables.scss';

/**
 * BasicInformationTables component displays the basic information of a report.
 *
 * @param {Object} props - The properties object.
 * @param {TMappedReportDetails} props.reportDetails - The mapped details of the report to be displayed.
 *
 */
function BasicInformationTables({ reportDetails }: { reportDetails: TMappedReportDetails }) {
    return (
        <Box display={'flex'} flexDirection={'column'} gap={'2rem'} width={1}>
            <Box
                padding={'2rem'}
                bgcolor={'background.paper'}
                borderRadius={'2rem'}
                alignItems={'flex-start'}
                display={'flex'}
                flexDirection={'column'}
                className="box-shadow"
            >
                <Typography
                    component={'h2'}
                    variant="h5"
                    paddingBottom={'1rem'}
                    fontFamily={'Roboto Mono'}
                    color={'primary'}
                >
                    Reception Report
                </Typography>
                <Box component={'div'} width={1} sx={{ overflowX: 'auto' }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="mono bold">clientID</TableCell>
                                <TableCell className="mono">{reportDetails.ClientID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="mono bold">contentURI</TableCell>
                                <TableCell>
                                    <a href={reportDetails.ContentURI}>{reportDetails.ContentURI}</a>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>
            <Box
                padding={'2rem'}
                bgcolor={'background.paper'}
                borderRadius={'2rem'}
                alignItems={'flex-start'}
                display={'flex'}
                flexDirection={'column'}
                className="box-shadow"
            >
                <Typography
                    component={'h2'}
                    variant="h5"
                    paddingBottom={'1rem'}
                    fontFamily={'Roboto Mono'}
                    color={'primary'}
                >
                    QoE Report
                </Typography>
                <Box component={'div'} width={1} sx={{ overflowX: 'auto' }}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="mono bold">recordingSessionId</TableCell>
                                <TableCell className="mono">{reportDetails.QoeReport.RecordingSessionID}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="mono bold">reportPeriod</TableCell>
                                <TableCell>{reportDetails.QoeReport.ReportPeriod}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="mono bold">reportTime</TableCell>
                                <TableCell>
                                    {reportDetails.QoeReport.ReportTime.split(',')
                                        .map((d) => dayjs(d).format('YYYY-MM-DD HH:mm:ss'))
                                        .join(', ')}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </Box>
    );
}

export default BasicInformationTables;
