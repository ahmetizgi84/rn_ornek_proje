import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const instance = axios.create({
    baseURL: "https://test.com/api/v2",
    timeout: 10000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("TOKEN");
        if (token) {
            instance.defaults.headers.common['x-csrf-token'] = token
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export default instance;
