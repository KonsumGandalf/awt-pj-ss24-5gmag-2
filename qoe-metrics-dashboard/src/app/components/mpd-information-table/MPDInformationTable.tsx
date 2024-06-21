import React from 'react';
import { TMappedMpdInfo } from 'src/app/models/types/metrics/qoe-report.type';

import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

function MPDInformationTable({ mpdInfo }: { mpdInfo: TMappedMpdInfo[] }) {
    if (mpdInfo.length === 0) {
        return null;
    }

    return (
        <Box
            padding={'2rem'}
            bgcolor={'background.default'}
            borderRadius={'2rem'}
            alignItems={'center'}
            display={'flex'}
            flexDirection={'column'}
        >
            <Typography component={'h2'} variant="h5" paddingBottom={'1rem'}>
                MPD Information
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Representation ID</TableCell>
                        <TableCell>Bandwidth</TableCell>
                        <TableCell>Codecs</TableCell>
                        <TableCell>Mime Type</TableCell>
                        <TableCell>Height</TableCell>
                        <TableCell>Width</TableCell>
                        <TableCell>Frame Rate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mpdInfo.map((info) => (
                        <TableRow key={info.representationId}>
                            <TableCell>{info.representationId}</TableCell>
                            <TableCell>{info.bandwidth}</TableCell>
                            <TableCell>{info.codecs}</TableCell>
                            <TableCell>{info.mimeType}</TableCell>
                            <TableCell>{info.height ?? '--'}</TableCell>
                            <TableCell>{info.width ?? '--'}</TableCell>
                            <TableCell>{info.frameRate ?? '--'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
}

export default MPDInformationTable;
