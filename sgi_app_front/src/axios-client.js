import axios from 'axios'

const axiosClient = axios.create({
    baseURL: `http://localhost:8000/api`
})

axiosClient.interceptors.request.use((config, ) => {
    config.headers.Authorization = 'Bearer '+localStorage.getItem('ACESS_TOKEN')
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