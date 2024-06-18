import { useState } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TMappedMpdInfo, TMappedRepSwitchList } from 'src/app/hooks/qoe-report';

import { Box, Typography } from '@mui/material';

import { graphColors } from '../../../theme';
import { TypographyTick, XAxisTick } from '../utils/chart';

function RepSwitchesChart({
    repSwitchList,
    mpdInfo,
}: {
    repSwitchList: TMappedRepSwitchList[];
    mpdInfo: TMappedMpdInfo[];
}) {
    const [mimeTypeVisibility, setMimeTypeVisibility] = useState<Record<string, boolean>>({});

    if (!repSwitchList || !mpdInfo) {
        return null;
    }

    console.log(repSwitchList);

    const mimeTypes = [...new Set(repSwitchList.map((i) => i.MimeType))];

    const dataByMimeType: {
        [key: string]: { bandwidth: number; timestamp: number }[];
    } = repSwitchList.reduce((acc, entry) => {
        if (!acc[entry.MimeType]) {
            acc[entry.MimeType] = [];
        }

        acc[entry.MimeType].push({
            bandwidth: entry.bandwidth,
            timestamp: entry.timeStamp,
        });

        return acc;
    }, {} as { [key: string]: { bandwidth: number; timestamp: number }[] });

    const data: { [key: string]: number }[] = [];

    Object.entries(dataByMimeType).forEach((entry) => {
        const [mimeType, entries] = entry;
        const latestEntry = _.maxBy(entries, 'timestamp');

        if (!latestEntry) return;

        data.push({
            timestamp: latestEntry.timestamp,
            [mimeType]: latestEntry.bandwidth,
        });
    });

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
                Representation Switches
            </Typography>
            <ResponsiveContainer minHeight={500} minWidth={200}>
                <LineChart data={data} width={500} height={1000} margin={{ top: 0, bottom: 20, left: 20, right: 20 }}>
                    <CartesianGrid />
                    <XAxis
                        dataKey="timestamp"
                        tick={(args) => <XAxisTick {...args}></XAxisTick>}
                        height={80}
                        allowDuplicatedCategory={true}
                        angle={10}
                        padding={{ right: 40 }}
                        type="number"
                        domain={['auto', 'auto']}
                        scale={'time'}
                    >
                        <Label value="Timestamp" position="bottom" style={{ textAnchor: 'middle' }} />
                    </XAxis>

                    <YAxis tick={(args) => <TypographyTick {...args}></TypographyTick>}>
                        <Label
                            value="Bandwidth in bit/s"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            style={{ textAnchor: 'middle' }}
                        />
                    </YAxis>
                    {[...mimeTypes].map((mimeType, i) => {
                        console.log(mimeTypeVisibility[mimeType]);
                        console.log(mimeType.toString());
                        return (
                            <Line
                                key={mimeType.toString()}
                                type="stepAfter"
                                dataKey={mimeType}
                                stroke={graphColors[i]}
                                strokeWidth={3}
                                hide={mimeTypeVisibility[mimeType]}
                            />
                        );
                    })}
                    <Tooltip
                        position={{ y: 0 }}
                        labelFormatter={(name) => 'Timestamp: ' + dayjs(name).format('YYYY-MM-DD HH:mm:ss:SSS')}
                        formatter={(value, name, props) => [value, 'Bandwidth in bit/s']}
                    />
                    <Legend
                        verticalAlign="top"
                        onClick={(e: { value: string }) => {
                            setMimeTypeVisibility({
                                ...mimeTypeVisibility,
                                [e.value]: !mimeTypeVisibility[e.value],
                            });
                        }}
                        height={40}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default RepSwitchesChart;
