import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_KEY = 'voleypro_access_token';
const REFRESH_KEY = 'voleypro_refresh_token';

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY);
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(ACCESS_KEY, access),
    AsyncStorage.setItem(REFRESH_KEY, refresh),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_KEY),
    AsyncStorage.removeItem(REFRESH_KEY),
  ]);
}
