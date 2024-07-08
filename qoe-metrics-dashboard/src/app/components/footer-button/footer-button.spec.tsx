import { render } from '@testing-library/react';

import FooterButton from './footer-button';

describe('FooterButton', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<FooterButton/>);
        expect(baseElement).toBeTruthy();
    });
});
