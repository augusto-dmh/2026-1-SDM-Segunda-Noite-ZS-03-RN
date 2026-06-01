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
import { TipoLogin } from '../LoginScreen';

type Props = {
  tipoLogin: TipoLogin;
};

type Reserva = {
  id: number;
  hospedagem: number;
  hospede: number;
  data_checkin: string;
  data_checkout: string;
  quantidade_hospedes: number;
  valor_total: string;
  status: string;
};

export default function ReservasScreen({ tipoLogin }: Props) {
  const navigation = useNavigation<any>();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carregando, setCarregando] = useState(true);
  const ehHospede = tipoLogin === 'hospede';

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/reservas/reservas/');
      setReservas(resposta.data);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel carregar as reservas.');
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
    Alert.alert('Excluir', 'Deseja excluir esta reserva?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/reservas/reservas/${id}/`);
            carregar();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel excluir a reserva.');
          }
        },
      },
    ]);
  }

  function irParaPagamento(reserva: Reserva) {
    navigation.navigate('CriarPagamento', {
      valoresIniciais: {
        reserva: reserva.id,
        valor: reserva.valor_total,
        status: 'pendente',
      },
    });
  }

  function mandarMensagem(reserva: Reserva) {
    navigation.navigate('CriarMensagem', {
      valoresIniciais: {
        hospedagem: reserva.hospedagem,
        assunto: `Reserva ${reserva.id}`,
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
        data={reservas}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma reserva encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>Reserva {item.id}</Text>
            <Text style={styles.descricao}>
              Hospedagem: {item.hospedagem} | Hospede: {item.hospede}
            </Text>
            <Text style={styles.descricao}>
              Check-in: {item.data_checkin} | Check-out: {item.data_checkout}
            </Text>
            <Text style={styles.descricao}>
              Hospedes: {item.quantidade_hospedes} | Total: R${' '}
              {item.valor_total}
            </Text>
            <Text style={styles.descricao}>Status: {item.status}</Text>

            <View style={styles.acoes}>
              {ehHospede ? (
                <>
                  <Pressable
                    style={[styles.botao, styles.pagamento]}
                    onPress={() => irParaPagamento(item)}
                  >
                    <Text style={styles.textoBotao}>Ir para pagamento</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.botao, styles.mensagem]}
                    onPress={() => mandarMensagem(item)}
                  >
                    <Text style={styles.textoBotao}>Mensagem</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[styles.botao, styles.editar]}
                    onPress={() => navigation.navigate('EditarReserva', { item })}
                  >
                    <Text style={styles.textoBotao}>Editar</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.botao, styles.excluir]}
                    onPress={() => confirmarExclusao(item.id)}
                  >
                    <Text style={styles.textoBotao}>Excluir</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}
      />

      {!ehHospede && (
        <Pressable
          style={styles.adicionar}
          onPress={() => navigation.navigate('CriarReserva')}
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
  titulo: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descricao: {
    lineHeight: 20,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  pagamento: {
    backgroundColor: '#16a34a',
  },
  mensagem: {
    backgroundColor: '#2563eb',
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
