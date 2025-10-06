import axios from "axios";
// import { MAIN_BACKEND_DOMAIN } from "./routing";
import { removeCookie } from "./cookieService";
import { useAuth } from "../store/authContext";
import { useCallback } from "react";

export const useAxiosCall = () => {
    const { AuthState } = useAuth();
    const { token } = AuthState;

    const axiosCall = useCallback(
        async (method, url, data = null, contentType, transformRequest) => {
            const headers = token
                ? {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': contentType || 'application/json',
                    ...(transformRequest && { transformRequest: [transformRequest] }),
                }
                : {};

            try {
                const response = await axios({
                    method,
                    url: `${url}`,
                    data,
                    headers,
                });
                return response;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    removeCookie("ceo_urid");
                    window.location.reload();
                }
                console.error("Axios error:", error);
                throw error;
            }
        },
        [token]
    );

    return axiosCall;
};
