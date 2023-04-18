import { AppError } from '@utils/AppError';
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.68.141:3333'
});


// api.interceptors.request.use((config) =>{
//     return config;
// }, (error) =>{
//     return Promise.reject(error);
// });

api.interceptors.response.use((response) => response, (error) =>{
    if(error.response && error.response.data)
        return Promise.reject(new AppError(error.response.data.message));
    else
        return Promise.reject(error);
});


export {
    api
}