import { useState } from 'react';
import dayjs from 'dayjs';
import _, { every } from 'lodash';
import {
    CartesianGrid,
    DefaultLegendContentProps,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Box, Typography, useTheme } from '@mui/material';

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
    const [mimeTypeVisibility, setMimeTypeVisibility] = useState<Record<string, boolean>>(
        mpdInfo.reduce((acc, entry) => {
            acc[entry.mimeType] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const theme = useTheme();

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

    const renderLegend = (props: DefaultLegendContentProps) => {
        const { payload } = props;

        return (
            <Box gap={'1.5rem'} display={'flex'} width={1} justifyContent={'center'}>
                {payload?.map((entry, index) => {
                    const color = entry.color;
                    return (
                        <Box
                            key={`item-${index}`}
                            display={'flex'}
                            alignItems={'center'}
                            gap={'0.5rem'}
                            onClick={() => {
                                const temp = { ...mimeTypeVisibility };
                                temp[entry.value] = !mimeTypeVisibility[entry.value];
                                if (every(Object.values(temp).map((t) => !t))) {
                                    return;
                                }
                                setMimeTypeVisibility(temp);
                            }}
                        >
                            <Box
                                height={'1rem'}
                                width={'1rem'}
                                borderRadius={'1rem'}
                                bgcolor={mimeTypeVisibility[entry.value] ? color : 'transparent'}
                                boxSizing={'border-box'}
                                border={'2px solid'}
                                borderColor={color}
                            ></Box>
                            <Typography color={color}>{entry.value}</Typography>
                        </Box>
                    );
                })}
            </Box>
        );
    };

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
                    <CartesianGrid syncWithTicks={true} vertical={false} />
                    <XAxis
                        dataKey="timestamp"
                        tick={(args) => <XAxisTick {...args}></XAxisTick>}
                        height={80}
                        allowDuplicatedCategory={true}
                        angle={10}
                        padding={{ right: 10, left: 10 }}
                        stroke="none"
                        type="number"
                        domain={['auto', 'auto']}
                        scale={'time'}
                    >
                        <Label
                            value="Timestamp"
                            position="bottom"
                            style={{ textAnchor: 'middle' }}
                            fill={theme.palette.primary.main}
                        />
                    </XAxis>

                    <YAxis
                        tick={(args) => <TypographyTickY {...args}></TypographyTickY>}
                        stroke="none"
                        padding={{ top: 10, bottom: 10 }}
                    >
                        <Label
                            value="Bandwidth in bit/s"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            style={{ textAnchor: 'middle' }}
                            fill={theme.palette.primary.main}
                        />
                    </YAxis>
                    {[...mimeTypes].map((mimeType, i) => {
                        const color = graphColors[i % mimeType.length];
                        return (
                            <Line
                                key={mimeType.toString()}
                                animationDuration={200}
                                type="stepAfter"
                                dataKey={mimeType}
                                stroke={color}
                                strokeWidth={2}
                                hide={!mimeTypeVisibility[mimeType]}
                                dot={{
                                    stroke: color,
                                    strokeWidth: 3,
                                    fill: color,
                                }}
                                activeDot={{
                                    stroke: color,
                                    strokeWidth: 1,
                                    fill: theme.palette.background.paper,
                                }}
                            />
                        );
                    })}
                    <Tooltip
                        position={{ y: 0 }}
                        labelFormatter={(name) => 'Timestamp: ' + dayjs(name).format('YYYY-MM-DD HH:mm:ss:SSS')}
                        formatter={(value, name, props) => [value, 'Bandwidth in bit/s']}
                    />
                    <Legend verticalAlign="top" content={renderLegend} height={40} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default RepSwitchesChart;
