import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen from './screens/LoginScreen';
import {
  carregarToken,
  obterPerfilLogin,
  registrarNaoAutorizado,
  sair,
  SessaoLogin,
  TipoLogin,
} from './services/api';

const TIPO_LOGIN_KEY = '@hospedaria:tipo-login';
const HOSPEDE_ID_KEY = '@hospedaria:hospede-id';
const ANFITRIAO_ID_KEY = '@hospedaria:anfitriao-id';

export default function App() {
  const sessao = useSessaoLogin();

  if (sessao.carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!sessao.token || !sessao.tipoLogin) {
    return <LoginScreen onLogin={sessao.aplicarSessao} />;
  }

  return (
    <NavigationContainer>
      <DrawerNavigator
        onLogout={sessao.fazerLogout}
        tipoLogin={sessao.tipoLogin}
        hospedeId={sessao.hospedeId}
        anfitriaoId={sessao.anfitriaoId}
      />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function useSessaoLogin() {
  const [token, setToken] = useState<string | null>(null);
  const [tipoLogin, setTipoLogin] = useState<TipoLogin | null>(null);
  const [hospedeId, setHospedeId] = useState<number | null>(null);
  const [anfitriaoId, setAnfitriaoId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    registrarNaoAutorizado(() => {
      setToken(null);
      setTipoLogin(null);
      setHospedeId(null);
      setAnfitriaoId(null);
    });

    async function carregarSessao() {
      const tokenSalvo = await carregarToken();

      if (!tokenSalvo) {
        setCarregando(false);
        return;
      }

      try {
        const perfil = await obterPerfilLogin();

        await aplicarSessao({
          token: tokenSalvo,
          tipoLogin: perfil.tipo_login,
          hospedeId: perfil.hospede_id,
          anfitriaoId: perfil.anfitriao_id,
        });
      } catch {
        await fazerLogout();
      } finally {
        setCarregando(false);
      }
    }

    carregarSessao();

    return () => registrarNaoAutorizado(null);
  }, []);

  async function aplicarSessao(sessao: SessaoLogin) {
    await AsyncStorage.setItem(TIPO_LOGIN_KEY, sessao.tipoLogin);

    if (sessao.hospedeId) {
      await AsyncStorage.setItem(HOSPEDE_ID_KEY, String(sessao.hospedeId));
    } else {
      await AsyncStorage.removeItem(HOSPEDE_ID_KEY);
    }

    if (sessao.anfitriaoId) {
      await AsyncStorage.setItem(ANFITRIAO_ID_KEY, String(sessao.anfitriaoId));
    } else {
      await AsyncStorage.removeItem(ANFITRIAO_ID_KEY);
    }

    setToken(sessao.token);
    setTipoLogin(sessao.tipoLogin);
    setHospedeId(sessao.hospedeId);
    setAnfitriaoId(sessao.anfitriaoId);
  }

  async function fazerLogout() {
    await sair();
    await AsyncStorage.removeItem(TIPO_LOGIN_KEY);
    await AsyncStorage.removeItem(HOSPEDE_ID_KEY);
    await AsyncStorage.removeItem(ANFITRIAO_ID_KEY);
    setToken(null);
    setTipoLogin(null);
    setHospedeId(null);
    setAnfitriaoId(null);
  }

  return {
    token,
    tipoLogin,
    hospedeId,
    anfitriaoId,
    carregando,
    aplicarSessao,
    fazerLogout,
  };
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
