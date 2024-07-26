import React, { ReactNode } from 'react';

import { GridFooterContainer, GridPagination } from '@mui/x-data-grid';

interface ButtonFooterProps {
    children?: ReactNode;
}

/**
 * FooterButton component allows to displays a button in the footer of the data grid. It also displays the pagination.
 *
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The children of the component.
 *
 * @example
 * <FooterButton>
 *    <Button variant="contained" color="primary" onClick={
 *       () => {
 *         // Do something
 *      }
 *   }>
 *     Button
 *  </Button>
 * </FooterButton>
 */
const FooterButton: React.FC<ButtonFooterProps> = ({ children }) => {
    return (
        <GridFooterContainer>
            <div style={{ display: 'flex', justifyContent: 'center' }}>{children}</div>
            <GridPagination />
        </GridFooterContainer>
    );
};

export default FooterButton;
