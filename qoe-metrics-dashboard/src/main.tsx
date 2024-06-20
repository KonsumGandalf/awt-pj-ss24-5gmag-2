import { ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import App from './app/app';
import ConsumptionOverviewPage from './app/pages/consumption/overview/ConsumptionOverviewPage';
import DetailPage from './app/pages/metrics/detail/DetailPage';
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
                element: <Navigate to="metrics" replace/>
            },
            {
                path: 'metrics',
                element: <MetricsOverviewPage></MetricsOverviewPage>,
            },
            {
                path: 'metrics/details',
                element: <DetailPage></DetailPage>
            },
            {
                path: 'consumption',
                element: <ConsumptionOverviewPage></ConsumptionOverviewPage>,
            },
            {
                path: 'consumption/:consumptionId',
                element: <DetailPage></DetailPage>
            }
        ]
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </StrictMode>
);
