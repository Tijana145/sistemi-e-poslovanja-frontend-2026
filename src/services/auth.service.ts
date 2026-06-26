import type { AuthModel } from "@/models/auth.model";
const AUTH_KEY = 'psep_2026_auth'

export class AuthService {
    static getAuth(): AuthModel | null {
    const data = localStorage.getItem(AUTH_KEY)
    if (!data) return null
    return JSON.parse(data)
}
    static hasAuth(){
        return localStorage.getItem(AUTH_KEY) != null
    }
    static saveAuth(auth: AuthModel){
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    }
    static clearAuth(){
        localStorage.removeItem(AUTH_KEY)
    }
    static getAccessToken(){
        return this.getAuth()?.access ?? null
    }
    static getRefreshToken(){
        return this.getAuth()?.refresh ?? null
    }
}