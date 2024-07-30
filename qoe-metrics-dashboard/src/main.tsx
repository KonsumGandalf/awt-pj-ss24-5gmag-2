import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

import App from './app/app';
import ConsumptionDetailPage from './app/pages/consumption/detail/consumptionDetailPage';
import ConsumptionOverviewPage from './app/pages/consumption/overview/ConsumptionOverviewPage';
import MetricsDetailPage from './app/pages/metrics/detail/MetricsDetailPage';
import MetricsOverviewPage from './app/pages/metrics/overview/MetricsOverviewPage';
import { theme } from './theme';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {
                path: '',
                index: true,
                element: <Navigate to="metrics" replace />,
            },
            {
                path: 'metrics',
                element: <MetricsOverviewPage></MetricsOverviewPage>,
            },
            {
                path: 'metrics/details',
                element: <MetricsDetailPage></MetricsDetailPage>,
            },
            {
                path: 'consumption',
                element: <ConsumptionOverviewPage></ConsumptionOverviewPage>,
            },
            {
                path: 'consumption/details',
                element: <ConsumptionDetailPage></ConsumptionDetailPage>,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
    </ThemeProvider>
);
