import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient, setPaymentRequiredHandler } from '../client';
import { setTokens, getAccessToken, clearTokens } from '../../auth/storage';

describe('apiClient', () => {
  let mock: MockAdapter;
  let rawMock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(apiClient);
    rawMock = new MockAdapter(axios);
    await clearTokens();
  });

  afterEach(() => {
    mock.restore();
    rawMock.restore();
    setPaymentRequiredHandler(null);
  });

  it('attaches the stored access token as a bearer header', async () => {
    await setTokens('valid-access', 'valid-refresh');
    mock.onGet('/profiles/me').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer valid-access');
      return [200, { ok: true }];
    });

    const { data } = await apiClient.get('/profiles/me');
    expect(data).toEqual({ ok: true });
  });

  it('refreshes the access token once on a 401 and retries the original request', async () => {
    await setTokens('expired-access', 'good-refresh');

    let callCount = 0;
    mock.onGet('/profiles/me').reply(() => {
      callCount += 1;
      return callCount === 1 ? [401] : [200, { ok: true }];
    });
    rawMock.onPost(/\/auth\/refresh$/).reply(200, {
      access_token: 'new-access',
      refresh_token: 'new-refresh',
    });

    const { data } = await apiClient.get('/profiles/me');

    expect(data).toEqual({ ok: true });
    expect(callCount).toBe(2);
    expect(await getAccessToken()).toBe('new-access');
  });

  it('refreshes the subscription state on a 402 and retries the request once', async () => {
    await setTokens('valid-access', 'valid-refresh');

    let callCount = 0;
    let refreshed = 0;
    setPaymentRequiredHandler(async () => { refreshed += 1; });
    mock.onPost('/training-plans').reply(() => {
      callCount += 1;
      // Webhook gecikmesi: ilk istek reddediliyor, abonelik durumu
      // tazelendikten sonraki deneme geciyor.
      return callCount === 1 ? [402] : [200, { id: 'plan-1' }];
    });

    const { data } = await apiClient.post('/training-plans', { name: 'Test' });

    expect(data).toEqual({ id: 'plan-1' });
    expect(callCount).toBe(2);
    expect(refreshed).toBe(1);
  });

  it('gives up after one 402 retry so an expired subscription surfaces', async () => {
    await setTokens('valid-access', 'valid-refresh');

    let callCount = 0;
    setPaymentRequiredHandler(async () => {});
    mock.onGet('/training-plans').reply(() => {
      callCount += 1;
      return [402];
    });

    await expect(apiClient.get('/training-plans')).rejects.toBeTruthy();
    expect(callCount).toBe(2);
  });

  it('clears tokens and rejects when the refresh call itself fails', async () => {
    await setTokens('expired-access', 'bad-refresh');

    mock.onGet('/profiles/me').reply(401);
    rawMock.onPost(/\/auth\/refresh$/).reply(401);

    await expect(apiClient.get('/profiles/me')).rejects.toBeTruthy();
    expect(await getAccessToken()).toBeNull();
  });
});
