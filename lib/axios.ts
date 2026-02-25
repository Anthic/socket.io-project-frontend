import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true
})

//request interceptor 
api.interceptors.request.use((config)=>{
const authData = localStorage.getItem("auth-storage")
if (authData) {
    const {state}= JSON.parse(authData)
    if (state.accessToken) {
         config.headers.Authorization = state.accessToken;
    }
}
return config;
})

//response interceptor
api.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if (error.response?.status === 401) {
            localStorage.removeItem("auth-storage")
            window.location.href = "/auth/login"
        }
        return Promise.reject(error)
    }
)
export default api;