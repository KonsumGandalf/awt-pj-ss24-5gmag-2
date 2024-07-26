import { Tooltip } from '@mui/material';

import { metricsTypeInformation } from '../../models/const/metrics/metrics-type-icon.record';
import { EMetricsType } from '../../models/enums/metrics/metrics-type.enum';

import './metric-type-icon.scss';

/**
 * Props for the MetricTypeIcon component
 */
interface MetricTypeIconProps {
    metricType: EMetricsType;
}

/**
 * MetricTypeIcon component displays the icon of a metric type.
 * It employs the metricsTypeInformation record to get the icon and the title of the metric type.
 *
 * @param {MetricTypeIconProps} props - The properties object.
 * @param {EMetricsType} props.metricType - The metric type.
 */
export function MetricTypeIcon(props: MetricTypeIconProps) {
    return (
        <Tooltip title={metricsTypeInformation[props.metricType].title}>
            {metricsTypeInformation[props.metricType].icon({
                className: 'metric-icon',
                style: {
                    background: metricsTypeInformation[props.metricType].backgroundColor,
                    color: 'white',
                },
            })}
        </Tooltip>
    );
}

export default MetricTypeIcon;
