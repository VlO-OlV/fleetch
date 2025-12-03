import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
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
    });

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
      (error) => {
        console.log(error);
        toast.error('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        });
        return Promise.reject(error);
      },
    );
  }

  public async get<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  public async create<T, D>(
    url: string,
    data: D,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public async patch<T, D>(
    url: string,
    data: D,
    config: AxiosRequestConfig<D> = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }

  public async delete<T>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  public async upload(
    url: string,
    file: File,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  }
}

const apiService = new ApiService();
export default apiService;
