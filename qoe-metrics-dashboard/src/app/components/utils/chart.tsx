import dayjs from 'dayjs';

import { useTheme } from '@mui/material';

/**
 * TypographyTickY component, used to render the y-axis ticks. It renders the value of the tick.
 */
export function TypographyTickY(props: { payload: { value: string }; x: number; y: number }) {
    const { payload, x, y } = props;
    const theme = useTheme();

    return (
        <g transform={`translate(${x},${y})`}>
            <text fontSize={10} x={0} y={0} dy={4} textAnchor="end" fill={theme.palette.primary.main}>
                {payload.value}
            </text>
        </g>
    );
}

/**
 * TypographyTickX component, used to render the x-axis ticks. It renders the value of the tick.
 */
export function TypographyTickX(props: { payload: { value: string }; x: number; y: number }) {
    const { payload, x, y } = props;
    const theme = useTheme();

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                fontSize={10}
                x={0}
                y={0}
                dy={8}
                dx={6 + (payload.value?.length ?? 0)}
                textAnchor="end"
                fill={theme.palette.primary.main}
            >
                {payload.value}
            </text>
        </g>
    );
}

/**
 * XAxisTick component, used to render the x-axis ticks. It renders time in the format HH:mm:ss:SSS.
 */
export function XAxisTick(props: { payload: { value: string }; x: number; y: number }) {
    const { x, y, payload } = props;
    const theme = useTheme();

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={16}
                textAnchor="end"
                fill={theme.palette.primary.main}
                transform="rotate(-65)"
                fontSize={10}
            >
                {dayjs(payload.value).format('HH:mm:ss:SSS')}
            </text>
        </g>
    );
}
