import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen, { TipoLogin } from './screens/LoginScreen';
import {
  carregarToken,
  obterPerfilHospede,
  registrarNaoAutorizado,
  sair,
} from './services/api';

const TIPO_LOGIN_KEY = '@hospedaria:tipo-login';
const HOSPEDE_ID_KEY = '@hospedaria:hospede-id';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [tipoLogin, setTipoLogin] = useState<TipoLogin | null>(null);
  const [hospedeId, setHospedeId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    registrarNaoAutorizado(() => {
      setToken(null);
      setTipoLogin(null);
      setHospedeId(null);
    });

    Promise.all([
      carregarToken(),
      AsyncStorage.getItem(TIPO_LOGIN_KEY) as Promise<TipoLogin | null>,
      AsyncStorage.getItem(HOSPEDE_ID_KEY),
    ]).then(async ([tokenSalvo, tipoLoginSalvo, hospedeIdSalvo]) => {
      let hospedeIdAtual = hospedeIdSalvo ? Number(hospedeIdSalvo) : null;

      if (tokenSalvo && tipoLoginSalvo === 'hospede' && !hospedeIdAtual) {
        hospedeIdAtual = await obterPerfilHospede();
        await AsyncStorage.setItem(HOSPEDE_ID_KEY, String(hospedeIdAtual));
      }

      setToken(tokenSalvo);
      setTipoLogin(tipoLoginSalvo);
      setHospedeId(hospedeIdAtual);
      setCarregando(false);
    });

    return () => registrarNaoAutorizado(null);
  }, []);

  async function fazerLogin(tokenRecebido: string, tipoLoginRecebido: TipoLogin) {
    let hospedeIdRecebido: number | null = null;

    if (tipoLoginRecebido === 'hospede') {
      hospedeIdRecebido = await obterPerfilHospede();
      await AsyncStorage.setItem(HOSPEDE_ID_KEY, String(hospedeIdRecebido));
    } else {
      await AsyncStorage.removeItem(HOSPEDE_ID_KEY);
    }

    await AsyncStorage.setItem(TIPO_LOGIN_KEY, tipoLoginRecebido);
    setToken(tokenRecebido);
    setTipoLogin(tipoLoginRecebido);
    setHospedeId(hospedeIdRecebido);
  }

  async function fazerLogout() {
    await sair();
    await AsyncStorage.removeItem(TIPO_LOGIN_KEY);
    await AsyncStorage.removeItem(HOSPEDE_ID_KEY);
    setToken(null);
    setTipoLogin(null);
    setHospedeId(null);
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token || !tipoLogin) {
    return <LoginScreen onLogin={fazerLogin} />;
  }

  return (
    <NavigationContainer>
      <DrawerNavigator
        onLogout={fazerLogout}
        tipoLogin={tipoLogin}
        hospedeId={hospedeId}
      />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
