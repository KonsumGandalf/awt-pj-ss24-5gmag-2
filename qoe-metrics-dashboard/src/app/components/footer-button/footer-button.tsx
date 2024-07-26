import React, { ReactNode } from 'react';

import { GridFooterContainer, GridPagination } from '@mui/x-data-grid';

interface ButtonFooterProps {
    children?: ReactNode;
}

const FooterButton: React.FC<ButtonFooterProps> = ({ children }) => {
    return (
        <GridFooterContainer>
            <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
            <GridPagination />
        </GridFooterContainer>
    );
};

export default FooterButton;
