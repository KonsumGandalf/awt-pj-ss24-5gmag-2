import { useState } from 'react';
import { every, maxBy } from 'lodash';
import {
    CartesianGrid,
    DefaultLegendContentProps,
    Label,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { Box, Typography, useTheme } from '@mui/material';

import { TMappedHttpList } from '../../../app/models/types/metrics/qoe-report.type';
import { graphColors } from '../../../theme';
import { TypographyTickX, TypographyTickY } from '../utils/chart';

type DataPoint = {
    duration: number;
    transferedBytes: number;
};

type TypeDataPoint = Record<string, DataPoint[]>;

function HttpListChart({ httpList }: { httpList: TMappedHttpList[] }) {
    const theme = useTheme();

    const [scatterVisibility, setScatterisibility] = useState<Record<string, boolean>>(
        httpList.reduce((acc, entry) => {
            acc[entry.type] = true;
            return acc;
        }, {} as Record<string, boolean>)
    );

    const dataByTypeRef = httpList.reduce((acc, entry) => {
        if (!acc[entry.type]) {
            acc[entry.type] = [];
        }

        acc[entry.type].push({
            duration: Number(entry.duration),
            transferedBytes: Number(entry.transferedBytes),
        });
        return acc;
    }, {} as TypeDataPoint);

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
                                const temp = { ...scatterVisibility };
                                temp[entry.value] = !scatterVisibility[entry.value];
                                if (every(Object.values(temp).map((t) => !t))) {
                                    return;
                                }
                                setScatterisibility({
                                    ...scatterVisibility,
                                    [entry.value]: !scatterVisibility[entry.value],
                                });
                            }}
                        >
                            <Box
                                height={'1rem'}
                                width={'1rem'}
                                borderRadius={'1rem'}
                                bgcolor={scatterVisibility[entry.value] ? color : 'transparent'}
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
                Http List
            </Typography>
            <ResponsiveContainer minHeight={500} minWidth={200}>
                <ScatterChart width={500} height={1000} margin={{ top: 0, bottom: 20, left: 20, right: 20 }}>
                    <CartesianGrid syncWithTicks={true} vertical={false} />

                    <XAxis
                        dataKey="duration"
                        name="Duration"
                        type="number"
                        unit={'ms'}
                        domain={['auto', 'auto']}
                        stroke="none"
                        padding={{ left: 10, right: 10 }}
                        tick={(args) => <TypographyTickX {...args} unit></TypographyTickX>}
                    >
                        <Label
                            value="Duration in ms"
                            position="bottom"
                            style={{ textAnchor: 'middle' }}
                            fill={theme.palette.primary.main}
                        ></Label>
                    </XAxis>
                    <YAxis
                        dataKey="transferedBytes"
                        name="Transfered Bytes"
                        type="number"
                        unit={'B'}
                        domain={[
                            'auto',
                            () => {
                                return (
                                    maxBy(httpList, (o) => (scatterVisibility[o.type] ? o.transferedBytes : 0))
                                        ?.transferedBytes ?? 0
                                );
                            },
                        ]}
                        stroke="none"
                        padding={{ top: 10, bottom: 10 }}
                        tick={(args) => <TypographyTickY {...args}></TypographyTickY>}
                    >
                        <Label
                            value="Transferred Bytes"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            fill={theme.palette.primary.main}
                            style={{ textAnchor: 'middle' }}
                        />
                    </YAxis>
                    <Tooltip
                        formatter={(value: string, name: string) => {
                            return [value, name];
                        }}
                    />

                    <Legend verticalAlign="top" content={renderLegend} height={40} />
                    {Object.entries(dataByTypeRef).map(([type, data], index) => {
                        console.log('reload');
                        return (
                            <Scatter
                                key={type}
                                name={type}
                                data={data}
                                isAnimationActive={true}
                                fill={graphColors[index % graphColors.length]}
                                hide={!scatterVisibility[type]}
                            />
                        );
                    })}
                </ScatterChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default HttpListChart;
