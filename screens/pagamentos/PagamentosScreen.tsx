import { useCallback, useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { api } from '../../services/api';

type Pagamento = {
  id: number;
  reserva: number;
  valor: string;
  metodo: string;
  status: string;
  data_pagamento?: string | null;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function PagamentosScreen() {
  const navigation = useNavigation<Navigation>();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarPagamentos = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/pagamentos/pagamentos/');
      setPagamentos(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os pagamentos.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarPagamentos();
    }, [carregarPagamentos]),
  );

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pagamentos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum pagamento encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              Pagamento {item.id}
              {'\n'}
              Reserva: {item.reserva} | Valor: R$ {item.valor}
              {'\n'}
              Método: {item.metodo} | Status: {item.status}
              {'\n'}
              Data do pagamento: {item.data_pagamento || 'Não informada'}
            </Text>
          </View>
        )}
      />
      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate('CriarPagamento')}
      >
        <Text style={styles.textoAdicionar}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  descricao: {
    lineHeight: 20,
  },
  adicionar: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  textoAdicionar: {
    color: '#fff',
    fontSize: 30,
  },
});
