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

type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function EnderecosScreen() {
  const navigation = useNavigation<Navigation>();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarEnderecos = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/enderecos/');
      setEnderecos(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os endereços.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarEnderecos();
    }, [carregarEnderecos]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir este endereço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/enderecos/${id}/`);
            carregarEnderecos();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o endereço.');
          }
        },
      },
    ]);
  }

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
        data={enderecos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum endereço encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              {item.logradouro}, {item.numero}
              {'\n'}
              {item.bairro}
              {'\n'}
              {item.cidade}/{item.estado} - {item.cep}
            </Text>
            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.editar]}
                onPress={() => navigation.navigate('EditarEndereco', { item })}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.botao, styles.excluir]}
                onPress={() => confirmarExclusao(item.id)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate('CriarEndereco')}
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
  acoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  botao: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editar: {
    backgroundColor: '#2563eb',
  },
  excluir: {
    backgroundColor: '#dc2626',
  },
  textoBotao: {
    color: '#fff',
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
