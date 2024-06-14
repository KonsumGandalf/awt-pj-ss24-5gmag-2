import { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Label,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Box, Typography } from '@mui/material';

import { graphColors } from '../../../theme';
import { HttpList } from '../../models/types/metrics/qoe-report.type';
import { TypographyTick } from '../utils/chart';

type DataPoint = {
    duration: number;
    transferedBytes: number;
};

type TypeDataPoint = Record<string, DataPoint[]>;

const useHttpListData = (httpList: HttpList) => {
    const data = useMemo(
        () =>
            httpList.HttpListEntry.reduce((acc, entry) => {
                // Ensure acc[entry.type] is initialized as an empty array if it doesn't exist
                if (!acc[entry.type]) {
                    acc[entry.type] = [];
                }

                // Push new data into acc[entry.type]
                acc[entry.type].push({
                    duration: Number(entry.Trace.d),
                    transferedBytes: Number(entry.Trace.b),
                });

                return acc;
            }, {} as TypeDataPoint),
        [httpList]
    );

    return { data };
};

function HttpListChart({ httpList }: { httpList: HttpList }) {
    const { data } = useHttpListData(httpList);

    const [scatterProps, setScatterProps] = useState(
        Object.keys(data).reduce(
            (acc, type) => {
                acc[type] = {
                    hide: false,
                    hover: false,
                };

                return acc;
            },
            {} as Record<
                string,
                {
                    hide: boolean;
                    hover: boolean;
                }
            >
        )
    );

    const LegendMouseEnter = (e: { value: string }) => {
        setScatterProps((prev) => {
            return {
                ...prev,
                [e.value]: {
                    ...prev[e.value],
                    hover: true,
                },
            };
        });
    };

    const LegendMouseLeave = (e: { value: string }) => {
        setScatterProps((prev) => {
            return {
                ...prev,
                [e.value]: {
                    ...prev[e.value],
                    hover: false,
                },
            };
        });
    };

    const LegendClick = (e: { value: string }) => {
        setScatterProps((prev) => {
            return {
                ...prev,
                [e.value]: {
                    ...prev[e.value],
                    hide: !prev[e.value].hide,
                },
            };
        });
    };
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
                Http List
            </Typography>
            <ResponsiveContainer minHeight={500} minWidth={200}>
                <ScatterChart width={500} height={1000} margin={{ top: 0, bottom: 20, left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="duration"
                        name="Duration"
                        type="number"
                        unit={'ms'}
                        domain={['auto', 'auto']}
                        tick={(args) => <TypographyTick {...args}></TypographyTick>}
                    >
                        <Label value="Duration in ms" position="bottom" style={{ textAnchor: 'middle' }}></Label>
                    </XAxis>
                    <YAxis
                        dataKey="transferedBytes"
                        name="Transfered Bytes"
                        type="number"
                        unit={'bytes'}
                        domain={['auto', 'auto']}
                        tick={(args) => <TypographyTick {...args}></TypographyTick>}
                    >
                        <Label
                            value="Transferred Bytes"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            style={{ textAnchor: 'middle' }}
                        />
                    </YAxis>
                    <Tooltip
                        formatter={(value: string, name: string) => {
                            return [value, name];
                        }}
                    />

                    <Legend
                        verticalAlign="top"
                        onClick={LegendClick}
                        onMouseEnter={LegendMouseEnter}
                        onMouseLeave={LegendMouseLeave}
                        style={{ cursor: 'pointer' }}
                        height={40}
                    />
                    {Object.entries(data).map(([type, dataPoints], index) => {
                        return (
                            <Scatter
                                key={type}
                                name={type}
                                data={dataPoints}
                                style={{ cursor: 'pointer' }}
                                fill={graphColors[index % graphColors.length]}
                                hide={scatterProps[type].hide}
                                opacity={scatterProps[type].hover ? 0.2 : 1}
                            ></Scatter>
                        );
                    })}
                </ScatterChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default HttpListChart;
