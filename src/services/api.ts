import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

type UnauthorizedHandler = () => void;

// API base URL: configurable via Vite env, defaults to production API
// const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || 'https://api.controladoria.net.br/v1';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('Using API base URL:', import.meta.env);

// Helper to extract API error messages (API shape: { data, errors: [{ message: string }] })
export function extractApiErrorMessage(error: unknown): string {
  const fallback = 'Ocorreu um erro. Tente novamente.';
  if (axios.isAxiosError(error)) {
    const resp = error.response?.data as any;
    const message = resp?.errors?.[0]?.message || resp?.message;
    return message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

class ApiService {
  private static _instance: ApiService | null = null;
  private axios: AxiosInstance;

  private isRefreshing = false;
  private unauthorizedHandler: UnauthorizedHandler | null = null;
  private subscribers: Array<(success: boolean) => void> = [];

  private constructor() {
    this.axios = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // send HttpOnly cookies on every request
      headers: {
        Accept: 'application/json',
      },
    });

    // Response interceptor to handle 401 and perform refresh
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const originalConfig: any = error.config || {};
        const url = (originalConfig?.url as string) || '';

        if (status === 401) {
          const isLogin = url.includes('/session/login');
          const isRefresh = url.includes('/session/refresh');

          // If login or refresh itself failed with 401, do not retry
          if (isLogin) {
            return Promise.reject(error);
          }

          if (isRefresh) {
            // Session cannot be refreshed; force logout
            this.notifyRefreshSubscribers(false);
            this.unauthorizedHandler?.();
            return Promise.reject(error);
          }

          // Avoid infinite loops: only retry once per request
          if (originalConfig._retry) {
            return Promise.reject(error);
          }
          originalConfig._retry = true;

          // If a refresh is already in progress, wait for it
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.subscribeRefresh((success: boolean) => {
                if (success) {
                  resolve(this.axios(originalConfig as AxiosRequestConfig));
                } else {
                  this.unauthorizedHandler?.();
                  reject(error);
                }
              });
            });
          }

          // Start a refresh flow
          try {
            this.isRefreshing = true;
            await this.refreshSession();
            this.notifyRefreshSubscribers(true);
            return this.axios(originalConfig as AxiosRequestConfig);
          } catch (refreshError) {
            this.notifyRefreshSubscribers(false);
            // If refresh also failed with 401, redirect to login
            const refreshStatus = (refreshError as AxiosError)?.response
              ?.status;
            if (refreshStatus === 401) {
              this.unauthorizedHandler?.();
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  static getInstance(): ApiService {
    if (!ApiService._instance) {
      ApiService._instance = new ApiService();
    }
    return ApiService._instance;
  }

  static setOnUnauthorized(handler: UnauthorizedHandler) {
    ApiService.getInstance().unauthorizedHandler = handler;
  }

  get client(): AxiosInstance {
    return this.axios;
  }

  // Perform refresh using cookies; no token juggling required
  private async refreshSession() {
    await this.axios.post('/session/refresh');
  }

  private subscribeRefresh(cb: (success: boolean) => void) {
    this.subscribers.push(cb);
  }

  private notifyRefreshSubscribers(success: boolean) {
    this.subscribers.forEach(cb => cb(success));
    this.subscribers = [];
  }
}

// Export a ready-to-use Axios instance and the class for configuration
export const api = ApiService.getInstance().client;
export { ApiService };
