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
 * Allows to represent a metric based on its metric type by an icon
 *
 * @param props
 * @constructor
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