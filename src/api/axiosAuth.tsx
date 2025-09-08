import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_API_URL } from './environment';
import { jwtDecode } from 'jwt-decode';

const authAxios = axios.create({
    baseURL: AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch token once and set header on instance creation
const initializeAuthAxios = async () => {
    const token = await AsyncStorage.getItem('jwtToken');

    if (token) {
        authAxios.defaults.headers.common['Authorization'] = `${JSON.parse(token)}`;
    }
};

// Call this function once in your app initialization
initializeAuthAxios();

authAxios.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `${JSON.parse(token)}`;
        }
        // console.log("Request Headers:",token);  // Log headers for debugging
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default authAxios;
