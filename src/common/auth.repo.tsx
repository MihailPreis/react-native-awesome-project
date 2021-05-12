import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = "SECAUTHTKN";

export async function getAuthToken(): Promise<string> {
    let token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token === null) throw new TokenNotFoundError();
    return token;
}

export async function removeAuthToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveAuthToken(newToken: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
}

export class TokenNotFoundError extends Error { }