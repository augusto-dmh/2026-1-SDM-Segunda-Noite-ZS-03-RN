import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = '@hospedaria:token';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000',
});

function aplicarToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export async function entrar(username: string, password: string) {
  const resposta = await api.post('/token-autenticacao/', {
    username,
    password,
  });
  const token = resposta.data.token;

  await AsyncStorage.setItem(TOKEN_KEY, token);
  aplicarToken(token);

  return token;
}

export async function carregarToken() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  aplicarToken(token);

  return token;
}

export async function sair() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  aplicarToken(null);
}
