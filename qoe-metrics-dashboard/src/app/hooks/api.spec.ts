import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { act, renderHook } from '@testing-library/react-hooks';

import { useAxiosGet } from './api';

const mockAxios = new MockAdapter(axios);

describe('useAxiosGet', () => {
    beforeEach(() => {
        mockAxios.reset();
    });

    it('should return data on successful fetch', async () => {
        const mockData = { data: 'test data' };
        const url = '/api/test';
        const params = { param1: 'value1' };

        mockAxios.onGet(url, { params }).reply(200, mockData);

        const { result, waitForNextUpdate } = renderHook(() => useAxiosGet<{ data: string }>({ url, params }));

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.response).toEqual(mockData);
    });

    it('should return an error on failed fetch', async () => {
        const mockError = new Error('Network Error');
        const url = '/api/test';
        const params = { param1: 'value1' };

        mockAxios.onGet(url, { params }).reply(500, mockError);

        const { result, waitForNextUpdate } = renderHook(() => useAxiosGet<{ data: string }>({ url, params }));

        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBe(null);

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeTruthy();
        expect(result.current.response).toBeUndefined();
    });
});
