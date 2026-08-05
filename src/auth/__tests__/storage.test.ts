import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../storage';

describe('token storage', () => {
  afterEach(async () => {
    await clearTokens();
  });

  it('returns null when nothing is stored', async () => {
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
  });

  it('persists and retrieves both tokens', async () => {
    await setTokens('access-1', 'refresh-1');
    expect(await getAccessToken()).toBe('access-1');
    expect(await getRefreshToken()).toBe('refresh-1');
  });

  it('clears both tokens', async () => {
    await setTokens('access-1', 'refresh-1');
    await clearTokens();
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
  });
});
