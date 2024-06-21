import { useCallback, useContext, useState } from 'react';
import { isAxiosError } from 'axios';
import { defaults, pick, range } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, CircularProgress } from '@mui/material';
import {
    DataGrid,
    DEFAULT_GRID_AUTOSIZE_OPTIONS,
    GridColDef,
    GridRenderCellParams,
    GridRowParams,
    GridRowSelectionModel,
    GridToolbar,
} from '@mui/x-data-grid';

import { theme } from '../../../theme';
import MetricTypeIcon from '../../components/metric-type-icon/metric-type-icon';
import ReloadButton from '../../components/reload-button/reload-button';
import { EnvContext } from '../../env.context';
import { useReportList } from '../../hooks/api';
import { EMetricsType } from '../../models/enums/metrics/metrics-type.enum';
import { ESortingOrder } from '../../models/enums/shared/sorting-order.enum';
import { ESseTopic } from '../../models/enums/shared/sse-topic.enum';
import { TMetricsDetailsRequestParams } from '../../models/types/requests/metrics-details-request-params.type';
import { IMetricsRequestParamsOverview } from '../../models/types/requests/metrics-overview-request-params.interface';
import { TMetricsOverviewReport } from '../../models/types/responses/metrics-overview-report.type';

import './Overview.scss';

const ROWS_PER_PAGE = 5;
const MAX_ROWS_PER_PAGE = 25;

/**
 * Displays an overview of the metrics types
 */
function Overview() {
    const navigate = useNavigate();
    const envCtx = useContext(EnvContext);

    const [rerender, setRerender] = useState(Date.now().toString());
    const onReload = useCallback(() => setRerender(Date.now().toString()), []);

    const [provisionSessionIds] = useState<RegExp>(/1-6/);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { reportList, error, loading } = useReportList(
        envCtx.backendUrl,
        {
            provisionSessionIds,

            // currentPage,
            // limit,
            // sortingOrder,
            // orderProperty,
        } as IMetricsRequestParamsOverview,
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

    function handleClickMetric(filterQueryParams: TMetricsDetailsRequestParams): void {
        const params = new URLSearchParams(filterQueryParams as Record<string, string>);
        navigate('/metrics/details?' + params.toString());
    }

    function handleAggregation() {
        if (!reportList) return;
        const selectedRows = reportList.filter((row) =>
            selectedIds.includes(`${row.recordingSessionId}-${row.reportTime}`)
        );
        const paramsList = selectedRows.map((row) => pick(row, ['clientID', 'recordingSessionId', 'reportTime']));
        const params = paramsList
            .map((row) =>
                [
                    `clientID=${row.clientID}`,
                    `recordingSessionId=${row.recordingSessionId}`,
                    `reportTime=${row.reportTime}`,
                ].join('&')
            )
            .join('&');

        navigate('/metrics/details?' + params);
    }

    function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
        setSelectedIds(rowSelectionModel as string[]);
    }

    function isRowSelectable(params: GridRowParams<TMetricsOverviewReport>): boolean {
        if (selectedIds.length) {
            const selectedRecordingSessionId = reportList?.find(
                (row) => `${row.recordingSessionId}-${row.reportTime}` === selectedIds[0]
            )?.recordingSessionId;
            return params.row.recordingSessionId === selectedRecordingSessionId;
        }
        return true;
    }

    const columns: GridColDef<TMetricsOverviewReport>[] = [
        { field: 'clientID', headerName: 'Client ID' },
        { field: 'recordingSessionId', headerName: 'Recording Session ID' },
        { field: 'reportTime', headerName: 'Date', maxWidth: 200 },
        { field: 'reportPeriod', headerName: 'Report Period', maxWidth: 120 },
        { field: 'contentURI', headerName: 'Content URI' },
        {
            field: 'availableMetrics',
            headerName: 'Available Metrics',
            renderCell: (params: GridRenderCellParams) => {
                const availableMetrics = params.value as EMetricsType[];
                return (
                    <>
                        {availableMetrics.map((metricType: EMetricsType, index: number) => (
                            <MetricTypeIcon key={index} metricType={metricType} />
                        ))}
                    </>
                );
            },
            sortComparator: (v1: string[], v2: string[]) => v1.length - v2.length,
            cellClassName: 'icon-cell',
        },
    ];

    return (
        <div className="page-wrapper">
            <Button
                sx={{
                    alignSelf: 'center',
                    color: 'background.default',
                    size: 'large',
                    margin: '1rem',
                    inlineSize: '12rem',
                }}
                onClick={handleAggregation}
                variant="contained"
            >
                Aggregate {selectedIds.length} reports
            </Button>
            <ReloadButton action={onReload} topic={ESseTopic.METRICS} />
            <DataGrid
                rows={reportList}
                columns={columns.map((column) => defaults({}, column, { flex: 1 }))}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: ROWS_PER_PAGE },
                    },
                    sorting: {
                        sortModel: [{ field: 'reportTime', sort: ESortingOrder.ASC }],
                    },
                    columns: {
                        columnVisibilityModel: {
                            reportPeriod: false,
                            contentURI: false,
                        },
                    },
                }}
                pageSizeOptions={range(ROWS_PER_PAGE, MAX_ROWS_PER_PAGE + 1, ROWS_PER_PAGE)}
                getRowId={(row) => `${row.recordingSessionId}-${row.reportTime}`}
                autosizeOptions={{
                    expand: DEFAULT_GRID_AUTOSIZE_OPTIONS.expand,
                    includeHeaders: true,
                    includeOutliers: true,
                }}
                autosizeOnMount
                checkboxSelection
                onPaginationModelChange={(params) => {
                    // setCurrentPage(params.page);
                    // setLimit(params.pageSize);
                }}
                onRowClick={(params) => {
                    const filterQueryParams = pick(params.row, ['clientID', 'recordingSessionId', 'reportTime']);
                    handleClickMetric(filterQueryParams);
                }}
                isRowSelectable={isRowSelectable}
                onRowSelectionModelChange={handleRowSelection}
                getRowClassName={() => 'row'}
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    '& .icon-cell': {
                        display: 'flex',
                        alignContent: 'center',
                        alignItems: 'center',
                    },
                    '& .MuiDataGrid-toolbarContainer': {
                        button: {
                            padding: '0.75rem',
                            margin: '0.5rem',
                        },
                    },
                    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
                        display: 'none',
                    },
                }}
                loading={loading}
                slots={{ toolbar: GridToolbar }}
            />
        </div>
    );
}

export default Overview;
