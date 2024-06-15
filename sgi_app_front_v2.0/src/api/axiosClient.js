import axios from 'axios'

const axiosClient = axios.create({
    baseURL: `http://localhost:8000/api`
})

axiosClient.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('ACCESS_TOKEN'));
    if (token) {
        config.headers['Content-Type'] = 'multipart/form-data'
        config.headers.Authorization = `Bearer ${token}`
    } else {
        console.log("No se encontro ningun token en el local storage")
    }
    return config
})

axiosClient.interceptors.response.use((response) => {
    return response
}, (error) => {
    const {response} = error
    if (response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN')
    }

    throw error;
}
)

export default axiosClient