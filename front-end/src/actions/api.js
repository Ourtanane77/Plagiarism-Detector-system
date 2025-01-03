import axios from "axios";
import { BASE_URL } from "../components/config/keys";

export const apiClient = () => {
    const options = {
        baseURL: BASE_URL,
        responseType: 'json',
        headers: {
            Accept: "application/json",
            'Access-Control-Allow-Origin': "*/*"
        },
    }
    const instance = axios.create(options);

    // Remove the request interceptor that toggles loading
    instance.interceptors.request.use((request) => {
        // No longer dispatching TOGGLE_LOADING
        return request;
    });

    instance.interceptors.response.use(
        (response) => {
            // No longer dispatching TOGGLE_LOADING
            return response;
        },
        (error) => {
            console.error("error", error.response?.data);
            // No longer dispatching TOGGLE_LOADING
            return Promise.reject(error);
        },
    );

    return instance;
};