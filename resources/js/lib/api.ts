import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // harmless same-origin; required if you ever split origins
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login'; // session expired
        }
        return Promise.reject(error);
    },
);