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

type Hospede = {
  id: number;
  nome: string;
  email: string;
  documento: string;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function HospedesScreen() {
  const navigation = useNavigation<Navigation>();
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarHospedes = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/hospedes/');
      setHospedes(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os hóspedes.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarHospedes();
    }, [carregarHospedes]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir este hóspede?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/hospedes/${id}/`);
            carregarHospedes();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o hóspede.');
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
        data={hospedes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum hóspede encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              {item.nome}
              {'\n'}
              {item.email}
              {'\n'}
              Documento: {item.documento}
            </Text>
            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.editar]}
                onPress={() => navigation.navigate('EditarHospede', { item })}
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
        onPress={() => navigation.navigate('CriarHospede')}
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
