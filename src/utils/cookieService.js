import Cookies from "universal-cookie";

const cookies = new Cookies();

const isProduction = () => {
    if (
        window.location.hostname !== "localhost" ||
        window.location.hostname.includes("192.168.")
    ) {
        return false;
    } else {
        return true;
    }
};

export const setCookie = (name, value, options = {}) => {
    cookies.set(name, value, {
        ...options,
        secure: isProduction(),
        path: "/",
        sameSite: "Strict",
    });
};

export const getCookie = (name) => {
    return cookies.get(name);
};

export const removeCookie = (name) => {
    cookies.remove(name, { path: "/" });
};
