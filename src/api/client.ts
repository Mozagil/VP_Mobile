import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../auth/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.2.30:8081/api';
export const MEDIA_BASE_URL = BASE_URL.replace(/\/api\/?$/, '');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

// Sunucu 402 dondugunde abonelik durumunu yeniden okumak icin cagrilir.
// PurchasesContext kendini buraya kaydediyor; api katmani React'e bagimli
// olmadan abonelik durumunun tazelenmesini tetikleyebiliyor.
let paymentRequiredHandler: (() => Promise<void>) | null = null;
let paymentRefreshInFlight: Promise<void> | null = null;

export function setPaymentRequiredHandler(fn: (() => Promise<void>) | null) {
  paymentRequiredHandler = fn;
}

function refreshSubscriptionState(): Promise<void> {
  if (!paymentRequiredHandler) return Promise.resolve();
  // Ayni anda birden fazla istek 402 alabiliyor; hepsi tek tazelemeyi beklesin.
  if (!paymentRefreshInFlight) {
    paymentRefreshInFlight = paymentRequiredHandler().finally(() => {
      paymentRefreshInFlight = null;
    });
  }
  return paymentRefreshInFlight;
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // 402 = sunucu aboneligi kapali goruyor. Iki sebebi olabilir:
    //   1. Abonelik gercekten bitti — bu durumda tazeleme sonrasi isPro false
    //      olur ve RootNavigator kullaniciyi paywall'a alir.
    //   2. Satin alma yeni yapildi ve RevenueCat webhook'u sunucuya henuz
    //      ulasmadi — bu durumda kisa bir bekleyisin ardindan tekrar denemek
    //      yetiyor.
    // 402 istegi sunucuda hicbir sey yapmadan reddedildigi icin tekrar deneme
    // guvenli; ayni kayit iki kez olusmaz.
    if (error.response?.status === 402 && original) {
      await refreshSubscriptionState();
      if (!original._retry402) {
        original._retry402 = true;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return apiClient(original);
      }
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      await setTokens(data.access_token, data.refresh_token ?? refreshToken);

      refreshQueue.forEach((cb) => cb(data.access_token));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${data.access_token}`;
      return apiClient(original);
    } catch {
      refreshQueue = [];
      await clearTokens();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
