import { render } from '@testing-library/react';

import { EMetricsType } from '../../models/enums/metrics/metrics-type.enum';

import MetricTypeIcon from './metric-type-icon';

describe('MetricTypeIcon', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<MetricTypeIcon metricType={EMetricsType.HTTP_LIST} />);
        expect(baseElement).toBeTruthy();
    });
});
