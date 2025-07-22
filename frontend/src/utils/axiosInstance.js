import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post('http://localhost:8000/api/auth/refresh/', {
          refresh: localStorage.getItem('refreshToken'),
        });

        localStorage.setItem('accessToken', refreshResponse.data.access);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // optional redirect
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
