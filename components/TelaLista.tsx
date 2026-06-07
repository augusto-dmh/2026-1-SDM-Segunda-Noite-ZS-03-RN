import { useCallback, useState } from 'react';
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

import { api } from '../services/api';

type Registro = {
  id: number;
};

type Props = {
  endpoint: string;
  rotaCadastro: string;
  rotaEdicao: string;
  descricao: (item: any) => string;
  permiteExcluir?: boolean;
  exibeAcoes?: boolean;
};

export default function TelaLista({
  endpoint,
  rotaCadastro,
  rotaEdicao,
  descricao,
  permiteExcluir = true,
  exibeAcoes = true,
}: Props) {
  const navigation = useNavigation<any>();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get(endpoint);
      setRegistros(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }, [endpoint]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`${endpoint}${id}/`);
            carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o registro.');
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
        data={registros}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum registro encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>{descricao(item)}</Text>
            {exibeAcoes && (
              <View style={styles.acoes}>
                <Pressable
                  style={[styles.botao, styles.editar]}
                  onPress={() => navigation.navigate(rotaEdicao, { item })}
                >
                  <Text style={styles.textoBotao}>Editar</Text>
                </Pressable>
                {permiteExcluir && (
                  <Pressable
                    style={[styles.botao, styles.excluir]}
                    onPress={() => confirmarExclusao(item.id)}
                  >
                    <Text style={styles.textoBotao}>Excluir</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      />
      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate(rotaCadastro)}
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
