import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const TOKEN_KEY = '@hospedaria:token';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000';
let aoNaoAutorizado: (() => void) | null = null;

export type TipoLogin = 'anfitriao' | 'hospede';

type PerfilLogin = {
  tipo_login: TipoLogin;
  hospede_id: number | null;
  anfitriao_id: number | null;
};

export type SessaoLogin = {
  token: string;
  tipoLogin: TipoLogin;
  hospedeId: number | null;
  anfitriaoId: number | null;
};

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    if (erro.response?.status === 401) {
      await sair();
      aoNaoAutorizado?.();
    }

    return Promise.reject(erro);
  },
);

export function registrarNaoAutorizado(callback: (() => void) | null) {
  aoNaoAutorizado = callback;
}

function aplicarToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Token ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

function criarSessao(token: string, perfil: PerfilLogin): SessaoLogin {
  return {
    token,
    tipoLogin: perfil.tipo_login,
    hospedeId: perfil.hospede_id,
    anfitriaoId: perfil.anfitriao_id,
  };
}

export async function obterPerfilLogin() {
  const resposta = await api.get('/perfil-login/');

  return resposta.data as PerfilLogin;
}

export async function entrar(username: string, password: string) {
  const resposta = await api.post('/token-autenticacao/', {
    username,
    password,
  });
  const token = resposta.data.token;

  await AsyncStorage.setItem(TOKEN_KEY, token);
  aplicarToken(token);

  const perfil = await obterPerfilLogin();

  return criarSessao(token, perfil);
}

export async function cadastrar(
  username: string,
  password: string,
  email: string,
  tipoLogin: TipoLogin,
) {
  const resposta = await api.post('/cadastro/', {
    username,
    password,
    email,
    tipo_login: tipoLogin,
  });
  const token = resposta.data.token;

  await AsyncStorage.setItem(TOKEN_KEY, token);
  aplicarToken(token);

  return criarSessao(token, resposta.data as PerfilLogin);
}

export async function obterPerfilHospede() {
  const resposta = await api.get('/perfil-hospede/');
  return resposta.data.id as number;
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
