import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { EnvContext } from '../../../env.context';
import { useConsumptionReportDetail } from '../../../hooks/consumption-api';

import './ConsumptionDetailPage.scss';

/**
 * ConsumptionDetailPage component displays the details of a consumption report. It uses the useSearchParams hook to get the search parameters from the URL.
 *
 * When loading, it displays a loading spinner.
 *
 * When an error occurs, it displays the error message.
 *
 * When no data is found, it displays a message.
 */
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
                                    <TableCell className="mono bold">clientID</TableCell>
                                    <TableCell className="mono">{reportDetails.reportingClientId}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="mono bold">contentURI</TableCell>
                                    <TableCell>
                                        <a href={reportDetails.mediaPlayerEntry}>{reportDetails.mediaPlayerEntry}</a>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="mono bold">stability</TableCell>
                                    <TableCell>{reportDetails.stability}</TableCell>
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
                                    <TableCell className="mono bold">mediaConsumed</TableCell>
                                    <TableCell className="mono bold">clientEndpoint</TableCell>
                                    <TableCell className="mono bold">serverEndpoint</TableCell>
                                    <TableCell className="mono bold">startTime</TableCell>
                                    <TableCell className="mono bold">duration</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportDetails.consumptionReportingUnits.map((unit, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{unit.mediaConsumed}</TableCell>
                                        <TableCell>
                                            {unit.clientEndpointAddress.ipv4Addr}:
                                            {unit.clientEndpointAddress.portNumber}
                                        </TableCell>
                                        <TableCell>
                                            <a
                                                href={`https://${unit.serverEndpointAddress.domainName}:${unit.serverEndpointAddress.portNumber}`}
                                            >
                                                {unit.serverEndpointAddress.domainName}:
                                                {unit.serverEndpointAddress.portNumber}
                                            </a>
                                        </TableCell>
                                        <TableCell>{unit.startTime}</TableCell>
                                        <TableCell>{unit.duration}</TableCell>
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
