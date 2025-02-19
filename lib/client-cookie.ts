import Cookies from "js-cookie"

export const storeCookie = (key: string, plainText: string) => {
    Cookies.set(key, plainText, {expires: 1}) //menyimpan data ke cookie

} 
export const getCookie = (key: string) => {
    return Cookies.get(key) //mendapat data dari cookie
}

export const removeCookie = (key: string) => {
    Cookies.remove(key) //menghapus data dr cookie
}