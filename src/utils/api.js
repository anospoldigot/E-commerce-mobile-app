import axios from 'axios';
import { AuthStore } from '../store/auth';

// Membuat instance Axios
const api = axios.create({
    baseURL: 'https://1eca-116-206-9-60.ngrok-free.app/api',
});

// Interceptor untuk penanganan kesalahan (error handling)
api.interceptors.response.use(
  response => {
    // Mengembalikan respons jika tidak ada kesalahan
    return response;
  },
  error => {
    // Menghandle kesalahan (error) dengan status kode 4xx atau 5xx
    if (error.response) {
      // Tangani kesalahan sesuai kode status respons
      if (error.response.status === 401) {
        
        AuthStore.logout();
      } else {
        // Tangani kesalahan lainnya
        console.log('Terjadi kesalahan:', error.response.data);
      }
    } else if (error.request) {
      // Tangani kesalahan ketika tidak ada respons dari server
      console.log('Tidak ada respons dari server:', error.request);
    } else {
      // Tangani kesalahan umum
      console.log('Terjadi kesalahan:', error.message);
    }

    // Lanjutkan lempar error agar bisa ditangani di tempat lain
    throw error;
  }
);

api.interceptors.request.use(
    config => {
      const token = AuthStore.token; // Ambil token akses dari penyimpanan lokal atau state aplikasi
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

export default api;
