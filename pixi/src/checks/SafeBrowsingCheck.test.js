/**
 * @jest-environment jsdom
 */

import fetchMock from 'fetch-mock';

import SafeBrowsingCheck from './SafeBrowsingCheck.js';
import {
  apiResponsePass,
  apiResponseFail,
} from '../../mocks/safeBrowsingCheck/apiResponse.js';

import pixiConfig from '../../config.js';

beforeEach(() => {
  fetchMock.reset();
});

describe('Safe browsing check', () => {
  const apiEndpoint = pixiConfig['development'].API_ENDPOINT_SAFE_BROWSING;
  const safeBrowsingCheck = new SafeBrowsingCheck();

  it('returns empty object as report data for safe url', async () => {
    fetchMock.mock(`begin:${apiEndpoint}`, apiResponsePass);

    const report = await safeBrowsingCheck.run('http://example.com');
    expect(report.data.result).toBe(true);
  });

  it('returns threats for unsafe url', async () => {
    fetchMock.mock(`begin:${apiEndpoint}`, apiResponseFail);

    const report = await safeBrowsingCheck.run('http://example.com');
    expect(report.data.result).toBe(false);
  });

  it('throws for invalid API response', async () => {
    fetchMock.mock(`begin:${apiEndpoint}`, 500);

    const report = await safeBrowsingCheck.run('http://example.com');
    expect(report.error).toBeDefined();
    expect(report.data).toBe(undefined);
  });
});
