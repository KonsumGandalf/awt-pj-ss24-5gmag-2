import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EnvContext } from '../../../env.context';
import { useConsumptionReportDetail } from '../../../hooks/consumption-api';
import React from 'react';

import './ConsumptionDetailPage.scss';

function ConsumptionDetailPage() {
    const envCtx = useContext(EnvContext);

    const [searchParams] = useSearchParams();

    const { reportDetails, error, loading } = useConsumptionReportDetail(envCtx.backendUrl, searchParams);

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
            height={'100%'}
            sx={{
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
        >
            <Box display={'flex'} flexDirection={'column'} gap={'2rem'} width={'90%'} maxWidth={900}>
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
                        Consumption Detail Report
                    </Typography>
                    <Box component={'div'} width={1} sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="mono bold">Client ID</TableCell>
                                    <TableCell className="mono">{reportDetails.reportingClientId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="mono bold">content URI</TableCell>
                                    <TableCell className="mono">
                                        <a href={reportDetails.mediaPlayerEntry}>{reportDetails.mediaPlayerEntry}</a>
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
                        Consumption Reporting Units
                    </Typography>
                    <Box component={'div'} width={1} sx={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="mono bold">Media Consumed</TableCell>
                                    <TableCell className="mono bold">Client Endpoint</TableCell>
                                    <TableCell className="mono bold">Server Endpoint</TableCell>
                                    <TableCell className="mono bold">Start Time</TableCell>
                                    <TableCell className="mono bold">Duration</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportDetails.consumptionReportingUnits.map((unit, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="mono">{unit.mediaConsumed}</TableCell>
                                        <TableCell className="mono">
                                            {unit.clientEndpointAddress.ipv4Addr}:
                                            {unit.clientEndpointAddress.portNumber}
                                        </TableCell>
                                        <TableCell className="mono">
                                            {unit.serverEndpointAddress.domainName}:
                                            {unit.serverEndpointAddress.portNumber}
                                        </TableCell>
                                        <TableCell className="mono">{unit.startTime}</TableCell>
                                        <TableCell className="mono">{unit.duration}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ConsumptionDetailPage;
