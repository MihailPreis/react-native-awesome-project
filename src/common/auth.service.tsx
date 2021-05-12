import { removeAuthToken } from './auth.repo';
import { fetchAuth } from './network';

export async function logout() {
    await removeAuthToken();
}

export function auth(login: string, password: string) {
    fetchAuth(login, password)
        .then(d => {
            // TODO: Save tokens
        })
        .catch(err => {
            // TODO: Fuck off
        })
}

export function refresh() {
    // TODO: Get refresh token / check is alive / request refresh / save new tokens if success
}