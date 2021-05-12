import axios from 'axios';
import { getAuthToken } from './auth.repo';

const axiosConfig = {
    baseURL: 'https://xxx.zzz/',
    timeout: 1000
}

const client = axios.create(axiosConfig);
const authClient = axios.create(axiosConfig);

authClient.interceptors.request.use(
    async request => {
        const token = await getAuthToken();
        request.headers = {
            ...request.headers,
            Authorization: 'Bearer ' + token
        }
        return request;
    },
    err => err
)

authClient.interceptors.response.use(
    response => response,
    error => {
        const request = error.config;
        if (error.response.status === 401 && request.url == '<REFRESH_PATH>') {
            // TODO: Break infinite loop
        }
        if (error.response.status === 401) {
            // TODO: Refresh token and repeat original request 'return authClient(request);'
        }
    }
)


const testClient = axios.create({
    baseURL: 'https://randomuser.me/api/',
    timeout: 1000
});

export function fetchUsers(page: number, size: number = 30): Promise<any> {
    return testClient
        .get('', { params: { page: Math.trunc(page), results: Math.trunc(size), seed: 'abc' } })
        .then(r => r.data)
}

export function fetchAuth(login: string, password: string) {
    return client
        .get('/users/auth', { params: { login: login, password: password } })
        .then(r => r.data)
}