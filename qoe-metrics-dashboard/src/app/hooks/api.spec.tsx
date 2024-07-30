import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { render, screen, waitFor } from '@testing-library/react';

import { useAxiosGet } from './api';

const mockAxios = new MockAdapter(axios);

describe('useAxiosGet', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    afterEach(() => {
        mockAxios.restore();
    });

    interface TestComponentProps {
        url: string;
        params: Record<string, any>;
        rerender?: any;
    }

    function TestComponent({ url, params, rerender }: TestComponentProps) {
        const { response, error, loading } = useAxiosGet({ url, params, rerender });
        return (
            <div>
                <p data-testid="loading">{loading.toString()}</p>
                <p data-testid="error">{error ? (error as Error).message || 'Error occurred' : 'null'}</p>
                <p data-testid="response">{response ? JSON.stringify(response) : 'null'}</p>
            </div>
        );
    }

    it('should return data on successful fetch', async () => {
        const mockData = { data: 'test data' };
        const url = '/api/test';
        const params = { param1: 'value1' };

        mockAxios.onGet(url, { params }).reply(200, mockData);

        render(<TestComponent url={url} params={params} />);

        expect(screen.getByTestId('loading').textContent).toBe('true');
        expect(screen.getByTestId('error').textContent).toBe('null');

        await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
        expect(screen.getByTestId('error').textContent).toBe('null');
        expect(screen.getByTestId('response').textContent).toBe(JSON.stringify(mockData));
    });
});
