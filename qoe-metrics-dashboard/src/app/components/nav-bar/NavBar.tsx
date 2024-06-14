import { Link, useLocation } from 'react-router-dom';

import { Theme } from '@emotion/react';
import { AppBar, Box, Container, Toolbar, useTheme } from '@mui/material';
import { styled, SxProps } from '@mui/material/styles';

import { NavBarLogo } from './NavBarLogo';
import { NAV_BAR_PORTAL_ID } from './token';

import './NavBar.scss';

const pages = [
    { label: 'Metrics Reports', route: '/metrics' },
    { label: 'Consumption Reports', route: '/consumption' },
];

const CustomNavLink = styled(Link, {
    name: 'MuiCustomNavLink',
    slot: 'root',
    shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
    padding: '1rem',
    textDecoration: 'none',
    color: theme.palette.background.default,
    textTransform: 'uppercase',
    fontFamily: 'Roboto',
    fontSize: 'smaller',
    borderRadius: '2rem',
    ...(isActive && {
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
    }),
}));

const wrapperSx: SxProps<Theme> = {
    height: '5rem',
};

function NavBar() {
    const theme = useTheme();
    const location = useLocation();

    return (
        <AppBar position="static" sx={wrapperSx}>
            <Container maxWidth="xl" sx={wrapperSx}>
                <Toolbar disableGutters sx={wrapperSx}>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            gap: '1rem',
                        }}
                    >
                        {pages.map((page) => (
                            <CustomNavLink
                                key={page.route}
                                to={page.route}
                                isActive={location.pathname.includes(page.route)}
                            >
                                {page.label}
                            </CustomNavLink>
                        ))}
                    </Box>
                    <NavBarLogo theme={theme} />
                    <div id={NAV_BAR_PORTAL_ID}></div>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
