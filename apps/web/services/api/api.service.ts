import { ApiEndpoint, StorageKey } from '@/lib/consts';
import { LoginResponse } from '@/types/auth';
import { FileMetadataResponse } from '@/types/file';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

class ApiService {
  private api;

  public constructor(
    private readonly baseURL = process.env.NEXT_PUBLIC_BACKEND_URL as string,
  ) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    let isRefreshing = false;

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        const errorData = error.response?.data as {
          message: string;
          statusCode: number;
        };
        if (errorData?.statusCode === 401) {
          if (isRefreshing) {
            return Promise.reject(error);
          }
          isRefreshing = true;
          try {
            const response = await this.post<LoginResponse, void>(
              ApiEndpoint.REFRESH,
              undefined,
            );
            const token = response.data.accessToken;
            localStorage.setItem(StorageKey.ACCESS_TOKEN, token);
            this.api.defaults.headers.common.Authorization = `Bearer ${token}`;
            isRefreshing = false;
            return this.api(originalRequest);
          } catch (refreshError) {
            if (
              !('hideToast' in originalRequest) ||
              !originalRequest.hideToast
            ) {
              toast.error('Something went wrong', {
                description: errorData.message,
              });
            }
            localStorage.removeItem(StorageKey.ACCESS_TOKEN);
            isRefreshing = false;
            return Promise.reject(error);
          }
        }
        if (!('hideToast' in originalRequest) || !originalRequest.hideToast) {
          toast.error('Something went wrong', {
            description: errorData.message,
          });
        }
        return Promise.reject(error);
      },
    );
  }

  private buildQueryParams(
    params: Record<string, string | number | boolean | null | undefined>,
  ): string {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  public async get<T>(
    url: string | ApiEndpoint,
    config: AxiosRequestConfig & {
      hideToast?: boolean;
      queryParams?: Record<
        string,
        string | number | boolean | null | undefined
      >;
    } = {},
  ): Promise<AxiosResponse<T>> {
    const query = config.queryParams
      ? `?${this.buildQueryParams(config.queryParams)}`
      : '';
    return this.api.get<T>(url + query, config);
  }

  public async post<T, D>(
    url: string | ApiEndpoint,
    data: D,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public async patch<T, D>(
    url: string | ApiEndpoint,
    data: D,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  public async delete<T>(
    url: string | ApiEndpoint,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  public async upload(
    file: File,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<FileMetadataResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<FileMetadataResponse>(ApiEndpoint.FILES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  }
}

const apiService = new ApiService();
export default apiService;
