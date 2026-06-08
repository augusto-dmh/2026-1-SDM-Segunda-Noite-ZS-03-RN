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

import { api } from '../../services/api';

type Mensagem = {
  id: number;
  hospedagem: number;
  nome: string;
  email: string;
  telefone?: string | null;
  assunto: string;
  mensagem: string;
  lida: boolean;
};

export default function MensagensScreen() {
  const navigation = useNavigation<any>();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/mensagens/mensagens/');
      setMensagens(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as mensagens.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir esta mensagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/mensagens/mensagens/${id}/`);
            carregar();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a mensagem.');
          }
        },
      },
    ]);
  }

  function responder(mensagem: Mensagem) {
    navigation.navigate('CriarMensagem', {
      valoresIniciais: {
        hospedagem: mensagem.hospedagem,
        email: mensagem.email,
        telefone: mensagem.telefone || '',
        assunto: `Resposta: ${mensagem.assunto}`,
        lida: false,
      },
    });
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
        data={mensagens}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma mensagem encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>Mensagem {item.id}</Text>
            <Text style={styles.descricao}>
              Hospedagem: {item.hospedagem} | De: {item.nome}
            </Text>
            <Text style={styles.descricao}>
              E-mail: {item.email} | Telefone: {item.telefone || 'Não informado'}
            </Text>
            <Text style={styles.descricao}>Assunto: {item.assunto}</Text>
            <Text style={styles.descricao}>{item.mensagem}</Text>
            <Text style={styles.descricao}>
              Lida: {item.lida ? 'Sim' : 'Não'}
            </Text>

            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.responder]}
                onPress={() => responder(item)}
              >
                <Text style={styles.textoBotao}>Responder</Text>
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
  titulo: {
    fontWeight: 'bold',
    marginBottom: 4,
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
  responder: {
    backgroundColor: '#2563eb',
  },
  excluir: {
    backgroundColor: '#dc2626',
  },
  textoBotao: {
    color: '#fff',
  },
});
