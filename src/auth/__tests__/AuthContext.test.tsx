import React from 'react';
import { Text } from 'react-native';
import { render, screen, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../../api/client';
import { AuthProvider, useAuth } from '../AuthContext';
import { getAccessToken, clearTokens } from '../storage';

// AuthContext cikis yaparken react-query onbellegini temizliyor, bu yuzden bir
// QueryClientProvider icinde calismasi gerekiyor. Her test kendi client'iyla
// baslasin: onbellek testler arasinda sizmasin.
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{ui}</AuthProvider>
    </QueryClientProvider>,
  );
}

function Probe() {
  const { user, loading, signIn, signOut } = useAuth();
  return (
    <>
      <Text testID="loading">{String(loading)}</Text>
      <Text testID="email">{user?.email ?? 'none'}</Text>
      <Text testID="signIn" onPress={() => signIn('a@b.com', 'pw')}>signIn</Text>
      <Text testID="signOut" onPress={() => signOut()}>signOut</Text>
    </>
  );
}

describe('AuthContext', () => {
  let mock: MockAdapter;

  beforeEach(async () => {
    mock = new MockAdapter(apiClient);
    await clearTokens();
  });

  afterEach(() => {
    mock.restore();
  });

  it('starts as logged out when there is no valid session', async () => {
    mock.onGet('/auth/me').reply(401);

    renderWithProviders(<Probe />);

    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    expect(screen.getByTestId('email').props.children).toBe('none');
  });

  it('signs in, stores tokens, and exposes the fetched user', async () => {
    mock.onGet('/auth/me').replyOnce(401);
    mock.onPost('/auth/login').reply(200, {
      access_token: 'access-1',
      refresh_token: 'refresh-1',
    });
    mock.onGet('/auth/me').reply(200, { id: '1', email: 'a@b.com' });

    renderWithProviders(<Probe />);

    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));

    await act(async () => {
      screen.getByTestId('signIn').props.onPress();
    });

    await waitFor(() => expect(screen.getByTestId('email').props.children).toBe('a@b.com'));
    expect(await getAccessToken()).toBe('access-1');
  });

  it('signs out and clears tokens', async () => {
    mock.onGet('/auth/me').replyOnce(401);
    mock.onPost('/auth/login').reply(200, {
      access_token: 'access-1',
      refresh_token: 'refresh-1',
    });
    mock.onGet('/auth/me').reply(200, { id: '1', email: 'a@b.com' });

    renderWithProviders(<Probe />);

    await waitFor(() => expect(screen.getByTestId('loading').props.children).toBe('false'));
    await act(async () => {
      screen.getByTestId('signIn').props.onPress();
    });
    await waitFor(() => expect(screen.getByTestId('email').props.children).toBe('a@b.com'));

    await act(async () => {
      screen.getByTestId('signOut').props.onPress();
    });

    await waitFor(() => expect(screen.getByTestId('email').props.children).toBe('none'));
    expect(await getAccessToken()).toBeNull();
  });
});
