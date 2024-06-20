import React from 'react';
import { TMappedReportDetails } from 'src/app/hooks/api';

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { IReceptionReport } from '../../models/types/responses/metrics-details-report.interface';

function BasicInformationTables({ reportDetails }: { reportDetails: TMappedReportDetails }) {
    return (
        <Box display={'flex'} gap={'2rem'} flexWrap={'wrap'}>
            <Box
                padding={'2rem'}
                bgcolor={'background.default'}
                borderRadius={'2rem'}
                alignItems={'center'}
                display={'flex'}
                flexDirection={'column'}
                flex={1}
            >
                <Typography component={'h2'} variant="h5" paddingBottom={'1rem'}>
                    Reception Report
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>clientID</TableCell>
                            <TableCell>{reportDetails.ClientID}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>contentURI</TableCell>
                            <TableCell>
                                <a href={reportDetails.ContentURI}>{reportDetails.ContentURI}</a>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
            <Box
                padding={'2rem'}
                bgcolor={'background.default'}
                borderRadius={'2rem'}
                alignItems={'center'}
                display={'flex'}
                flexDirection={'column'}
                flex={1}
            >
                <Typography component={'h2'} variant="h5" paddingBottom={'1rem'}>
                    QoE Report
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Field</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>recordingSessionId</TableCell>
                            <TableCell>{reportDetails.QoeReport.RecordingSessionID}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>reportPeriod</TableCell>
                            <TableCell>{reportDetails.QoeReport.ReportPeriod}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>reportTime</TableCell>
                            <TableCell>{reportDetails.QoeReport.ReportTime}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

export default BasicInformationTables;
