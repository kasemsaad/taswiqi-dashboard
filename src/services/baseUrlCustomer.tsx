import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "multipart/form-data",
    "Accept-Language": "ar",
  },
});

Api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);

    const status = error.response?.status;

    if (status === 403) {
      console.warn("Redirecting to /login due to", status);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default Api;
