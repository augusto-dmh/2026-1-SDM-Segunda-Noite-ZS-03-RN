import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen from './screens/LoginScreen';
import { carregarToken, sair } from './services/api';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarToken().then((tokenSalvo) => {
      setToken(tokenSalvo);
      setCarregando(false);
    });
  }, []);

  async function fazerLogout() {
    await sair();
    setToken(null);
  }

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  return (
    <NavigationContainer>
      <DrawerNavigator onLogout={fazerLogout} />
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
