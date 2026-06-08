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

type Comodidade = {
  id: number;
  nome: string;
  descricao: string;
  icone?: string;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function ComodidadesScreen() {
  const navigation = useNavigation<Navigation>();
  const [comodidades, setComodidades] = useState<Comodidade[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarComodidades = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/comodidades/');
      setComodidades(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as comodidades.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarComodidades();
    }, [carregarComodidades]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir esta comodidade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/comodidades/${id}/`);
            carregarComodidades();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a comodidade.');
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
        data={comodidades}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma comodidade encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              {item.nome}
              {item.icone ? ` (${item.icone})` : ''}
              {'\n'}
              {item.descricao}
            </Text>
            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.editar]}
                onPress={() => navigation.navigate('EditarComodidade', { item })}
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
        onPress={() => navigation.navigate('CriarComodidade')}
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
