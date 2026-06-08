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
import { api, TipoLogin } from '../../services/api';

type Props = {
  tipoLogin: TipoLogin;
};

type Avaliacao = {
  id: number;
  hospedagem: number;
  nome_hospede: string;
  email: string;
  nota: number;
  comentario?: string | null;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function AvaliacoesScreen({ tipoLogin }: Props) {
  const navigation = useNavigation<Navigation>();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const ehHospede = tipoLogin === 'hospede';

  const carregarAvaliacoes = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/avaliacoes/');
      setAvaliacoes(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as avaliações.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAvaliacoes();
    }, [carregarAvaliacoes]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir esta avaliação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/avaliacoes/${id}/`);
            carregarAvaliacoes();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a avaliação.');
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
        data={avaliacoes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma avaliação encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              Nota: {item.nota} - Hospedagem #{item.hospedagem}
              {'\n'}
              {item.nome_hospede} ({item.email})
              {'\n'}
              {item.comentario || 'Sem comentário'}
            </Text>
            {ehHospede && (
              <View style={styles.acoes}>
                <Pressable
                  style={[styles.botao, styles.editar]}
                  onPress={() => navigation.navigate('EditarAvaliacao', { item })}
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
            )}
          </View>
        )}
      />
      {ehHospede && (
        <Pressable
          style={styles.adicionar}
          onPress={() => navigation.navigate('CriarAvaliacao')}
        >
          <Text style={styles.textoAdicionar}>+</Text>
        </Pressable>
      )}
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
