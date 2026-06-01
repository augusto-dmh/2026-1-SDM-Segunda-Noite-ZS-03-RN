import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen, { TipoLogin } from './screens/LoginScreen';
import { carregarToken, registrarNaoAutorizado, sair } from './services/api';

const TIPO_LOGIN_KEY = '@hospedaria:tipo-login';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [tipoLogin, setTipoLogin] = useState<TipoLogin | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    registrarNaoAutorizado(() => {
      setToken(null);
      setTipoLogin(null);
    });

    Promise.all([
      carregarToken(),
      AsyncStorage.getItem(TIPO_LOGIN_KEY) as Promise<TipoLogin | null>,
    ]).then(([tokenSalvo, tipoLoginSalvo]) => {
      setToken(tokenSalvo);
      setTipoLogin(tipoLoginSalvo);
      setCarregando(false);
    });

    return () => registrarNaoAutorizado(null);
  }, []);

  async function fazerLogin(tokenRecebido: string, tipoLoginRecebido: TipoLogin) {
    await AsyncStorage.setItem(TIPO_LOGIN_KEY, tipoLoginRecebido);
    setToken(tokenRecebido);
    setTipoLogin(tipoLoginRecebido);
  }

  async function fazerLogout() {
    await sair();
    await AsyncStorage.removeItem(TIPO_LOGIN_KEY);
    setToken(null);
    setTipoLogin(null);
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
      <DrawerNavigator onLogout={fazerLogout} tipoLogin={tipoLogin} />
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
