import {deleteCookie, setCookie, getCookie} from "cookies-next";

export const addCookie = (name: string, content: string, path: string = "/") => {
    setCookie(name, content, { path })
}

export const getCookieByName = (name: string, path: string = "/"): string => {
    return getCookie(name, { path }) as string || ""
}

export const removeCookie = (name: string, path: string = "/") => {
    deleteCookie(name, { path })
}