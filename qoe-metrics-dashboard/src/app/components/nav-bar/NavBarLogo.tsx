import { Box, Theme } from '@mui/material';

import logo from '../../../assets/Logo_5G_MAG.png';

export const NavBarLogo = ({ theme }: { theme: Theme }) => (
    <Box
        sx={{
            background: theme.palette.background.default,
            padding: '0.5rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <img src={logo} className="logo" alt="The 5G MAG logo"></img>
    </Box>
);
