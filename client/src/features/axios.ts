import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_TARGET,
    withCredentials : true
})

export default api;

// import axios from "axios";

// const api = axios.create({
//     baseURL: 'http://localhost:5000/api/',
//     withCredentials : true
// })

// export default api;