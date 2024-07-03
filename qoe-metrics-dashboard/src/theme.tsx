import { createTheme } from '@mui/material';

export const graphColors = ['#0F4776', '#FFC145', '#B8B8D1', '#ff6b6c', '#C4F1BE'];

export const theme = createTheme({
    typography: {
        fontFamily: 'Roboto',
    },
    palette: {
        primary: {
            main: '#0F4776',
            light: '#A5D0F3',
        },
        background: {
            paper: '#fff',
            default: '#faf9f6',
        },
        text: {
            primary: '#0b1215',
        },
    },
    components: {
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': {
                        borderBottom: 0,
                    },
                },
            },
        },
    },
});
