import { useState } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import { CartesianGrid, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Box, Typography } from '@mui/material';

import { graphColors } from '../../../theme';
import { TMappedMpdInfo, TMappedRepSwitchList } from '../../models/types/metrics/qoe-report.type';
import { TypographyTickY, XAxisTick } from '../utils/chart';

function RepSwitchesChart({
    repSwitchList,
    mpdInfo,
}: {
    repSwitchList: TMappedRepSwitchList[];
    mpdInfo: TMappedMpdInfo[];
}) {
    const [mimeTypeVisibility, setMimeTypeVisibility] = useState<Record<string, boolean>>({});

    if (!repSwitchList.length || !mpdInfo.length) {
        return null;
    }

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

    const timestamps: number[] = [];

    Object.entries(dataByMimeType).forEach(([_, entries]) => {
        timestamps.push(...entries.map((e) => e.timestamp));
    });

    const data: { [key: string]: number }[] = [];

    timestamps.forEach((t) => {
        const datapoint: { [key: string]: number } = {
            timestamp: t,
        };
        Object.entries(dataByMimeType).forEach(([mimeType, entries]) => {
            const entry = _.minBy(entries, (o) => {
                return o.timestamp > t ? Infinity : t - o.timestamp;
            });
            if (entry && entry.timestamp <= t) {
                datapoint[mimeType] = entry.bandwidth;
            }
        });
        data.push(datapoint);
    });

    return (
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

                    <YAxis tick={(args) => <TypographyTickY {...args}></TypographyTickY>}>
                        <Label
                            value="Bandwidth in bit/s"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            style={{ textAnchor: 'middle' }}
                        />
                    </YAxis>
                    {[...mimeTypes].map((mimeType, i) => {
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
