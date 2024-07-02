import dayjs from 'dayjs';
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Box, Typography, useTheme } from '@mui/material';

import { TMappedBufferLevel } from '../../../app/models/types/metrics/qoe-report.type';
import { TypographyTickY, XAxisTick } from '../utils/chart';

function BufferLevelChart({ bufferLevel }: { bufferLevel: TMappedBufferLevel[] }) {
    const theme = useTheme();

    if (!bufferLevel || !bufferLevel.length) {
        return <Box>No data</Box>;
    }

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
                paddingBottom={'1.5rem'}
                fontFamily={'Roboto Mono'}
                color={'primary'}
            >
                Buffer Level
            </Typography>
            <ResponsiveContainer minHeight={500} minWidth={200}>
                <LineChart
                    data={bufferLevel}
                    width={500}
                    height={1000}
                    margin={{ top: 0, bottom: 20, left: 20, right: 20 }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="timeStamp"
                        tick={(args) => <XAxisTick {...args}></XAxisTick>}
                        height={80}
                        allowDuplicatedCategory={true}
                        angle={10}
                        padding={{ right: 40, left: 40 }}
                        type="number"
                        domain={['auto', 'auto']}
                        scale={'time'}
                    >
                        <Label
                            value="Timestamp"
                            position="bottom"
                            style={{ textAnchor: 'middle', fill: theme.palette.primary.main }}
                        />
                    </XAxis>

                    <YAxis tick={(args) => <TypographyTickY {...args}></TypographyTickY>} padding={{ top: 40 }}>
                        <Label
                            value="Buffer Level in ms"
                            position="insideLeft"
                            angle={-90}
                            offset={-10}
                            style={{ textAnchor: 'middle', fill: theme.palette.primary.main }}
                        />
                    </YAxis>
                    <Line
                        type="monotone"
                        dataKey="level"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={{
                            stroke: theme.palette.primary.main,
                            strokeWidth: 3,
                            fill: theme.palette.primary.main,
                        }}
                        activeDot={{
                            stroke: theme.palette.primary.main,
                            strokeWidth: 1,
                            fill: theme.palette.background.paper,
                        }}
                    />
                    <Tooltip
                        position={{ y: 0 }}
                        labelFormatter={(name: string) => 'Timestamp: ' + dayjs(name).format('YYYY-MM-DD HH:mm:ss:SSS')}
                        formatter={(value: string, name, props) => [value, 'Duration in ms']}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default BufferLevelChart;
