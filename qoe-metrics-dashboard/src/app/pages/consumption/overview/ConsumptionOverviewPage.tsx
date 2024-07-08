import { useCallback, useContext, useState } from 'react';
import { isAxiosError } from 'axios';
import { defaults, isNil, omitBy, pick, range } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, CircularProgress, TableCell, TableRow } from '@mui/material';
import {
    DataGrid,
    DEFAULT_GRID_AUTOSIZE_OPTIONS,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
    GridToolbar,
} from '@mui/x-data-grid';

import { theme } from '../../../../theme';
import FooterButton from '../../../components/footer-button/footer-button';
import { ReloadButton } from '../../../components/reload-button/reload-button';
import { EnvContext } from '../../../env.context';
import { useConsumptionReportList } from '../../../hooks/consumption-api';
import { ESortingOrder } from '../../../models/enums/shared/sorting-order.enum';
import { ESseTopic } from '../../../models/enums/shared/sse-topic.enum';
import { TConsumptionDetailsRequestParams } from '../../../models/types/consumption/requests/consumption-details-request-params.interface';
import { IConsumptionOverviewRequestParams } from '../../../models/types/consumption/requests/consumption-overview-request-params.interface';
import {
    ConsumptionReportingUnit,
    IConsumptionDetailReport,
} from '../../../models/types/consumption/responses/consumption-details-report.interface';

import './ConsumptionOverviewPage.scss';

const ROWS_PER_PAGE = 5;
const MAX_ROWS_PER_PAGE = 25;

/**
 * Displays an overview of the consumption reports
 */
function ConsumptionOverviewPage() {
    const navigate = useNavigate();
    const envCtx = useContext(EnvContext);

    const [rerender, setRerender] = useState(Date.now().toString());
    const onReload = useCallback(() => setRerender(Date.now().toString()), []);

    const [provisionSessionIds] = useState<RegExp>(/1-6/);

    const { reportList, error, loading } = useConsumptionReportList(
        envCtx.backendUrl,
        {
            provisionSessionIds,
        } as IConsumptionOverviewRequestParams,
        rerender
    );

    if (loading) {
        return (
            <div className="loading">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        console.log(error);
        return (
            <div className="page-wrapper">
                <Alert variant="outlined" severity="error">
                    An unknown error has occurred {`${error}`}
                    {isAxiosError(error) && <div>No data from backend, have you started it?</div>}
                </Alert>
            </div>
        );
    }

    if (reportList?.length === 0) {
        return <div>No Records found</div>;
    }

    function handleClickMetric(
        consumptionReport: Pick<IConsumptionDetailReport, 'reportingClientId' | 'consumptionReportingUnits'>
    ): void {
        let queryParam: TConsumptionDetailsRequestParams = {
            reportingClientId: consumptionReport.reportingClientId,
        };
        if (Array.isArray(consumptionReport.consumptionReportingUnits)) {
            queryParam = {
                startTime: consumptionReport.consumptionReportingUnits[0].startTime,
                duration: `${consumptionReport.consumptionReportingUnits[0].duration}`,
            };
        }
        const filteredQueryParam = omitBy(queryParam, isNil);
        const params = new URLSearchParams(filteredQueryParam);
        navigate('/consumption/details?' + params.toString());
    }

    function consumptionReportingUnitsRenderer(
        params: GridRenderCellParams,
        cellName: keyof ConsumptionReportingUnit
    ) {
        const consumptionReports = params.value as ConsumptionReportingUnit[];
        return (
            <div className='consumptionUnit'>
                {consumptionReports.map((metricType: ConsumptionReportingUnit, index: number) => (
                        <p className="unitCell">
                            {`${metricType[cellName]}`}
                        </p>
                ))}
            </div>
        );
    }

    const columns: GridColDef<IConsumptionDetailReport>[] = [
        { field: 'mediaPlayerEntry', headerName: 'Media Player Entry' },
        { field: 'reportingClientId', headerName: 'Reporting Client ID' },
        { field: 'stability', headerName: 'Stability', maxWidth: 120 },
        {
            field: 'consumptionReportingUnits',
            headerName: 'Media Consumed',
            cellClassName: 'consumptionUnit',
            renderCell: (params: GridRenderCellParams) => {
                return (
                        <>{consumptionReportingUnitsRenderer(params, 'mediaConsumed')}</>
                );
            },
            sortable: false,
        },
    ];

    return (
        <div className="page-wrapper">
            <DataGrid
                rows={reportList}
                columns={columns}
                slotProps={{
                    toolbar: {
                        printOptions: { disableToolbarButton: true },
                        csvOptions: { disableToolbarButton: true },
                    }}}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 },
                    },
                    sorting: {
                        sortModel: [{ field: 'reportingClientId', sort: ESortingOrder.ASC }],
                    },
                    columns: {
                        columnVisibilityModel: {},
                    },
                }}
                pageSizeOptions={range(ROWS_PER_PAGE, MAX_ROWS_PER_PAGE + 1, ROWS_PER_PAGE)}
                getRowId={(row: IConsumptionDetailReport) => {
                    const durationStartTimeString = row.consumptionReportingUnits.reduce((acc: string, cur) => {
                        return `${acc}-${cur.startTime}-${cur.duration}`;
                    }, '');
                    return `${row.reportingClientId}-${durationStartTimeString}`;
                }}
                autosizeOptions={{
                    expand: DEFAULT_GRID_AUTOSIZE_OPTIONS.expand,
                    includeHeaders: true,
                    includeOutliers: true,
                }}
                autosizeOnMount
                onRowClick={(params: GridRowParams<IConsumptionDetailReport>) => {
                    const filterQueryParams = pick(params.row, ['reportingClientId', 'consumptionReportingUnits']);
                    handleClickMetric(filterQueryParams);
                }}
                getRowClassName={() => 'row'}
                sx={{
                    overflowX: 'scroll',
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        background: 'var(--DataGrid-containerBackground)',
                        button: {
                            padding: '0.75rem',
                            margin: '0.5rem',
                        },
                    },
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignContent: 'center',
                        alignItems: 'center',
                    },
                }}
                loading={loading}
                slots={{
                    toolbar: GridToolbar,
                    footer: () => (
                        <FooterButton>
                            <ReloadButton action={onReload} topic={ESseTopic.CONSUMPTION} />
                        </FooterButton>
                    )
                }}
                getRowHeight={() => 'auto'}
            />
        </div>
    );
}

export default ConsumptionOverviewPage;
