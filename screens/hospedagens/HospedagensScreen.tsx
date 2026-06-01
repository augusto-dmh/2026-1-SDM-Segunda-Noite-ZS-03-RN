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

type Hospedagem = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  endereco: number;
  comodidades: number[];
  preco_diaria: string;
  capacidade: number;
  quartos: number;
  banheiros: number;
};

type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type Comodidade = {
  id: number;
  nome: string;
};

export default function HospedagensScreen({ tipoLogin }: Props) {
  const navigation = useNavigation<any>();
  const [hospedagens, setHospedagens] = useState<Hospedagem[]>([]);
  const [enderecos, setEnderecos] = useState<Record<number, Endereco>>({});
  const [comodidades, setComodidades] = useState<Record<number, Comodidade>>({});
  const [carregando, setCarregando] = useState(true);

  const ehAnfitriao = tipoLogin === 'anfitriao';
  const ehHospede = tipoLogin === 'hospede';

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      const [respostaHospedagens, respostaEnderecos, respostaComodidades] =
        await Promise.all([
          api.get('/hospedagens/'),
          api.get('/enderecos/'),
          api.get('/comodidades/'),
        ]);

      setHospedagens(respostaHospedagens.data);
      setEnderecos(
        Object.fromEntries(
          respostaEnderecos.data.map((endereco: Endereco) => [
            endereco.id,
            endereco,
          ]),
        ),
      );
      setComodidades(
        Object.fromEntries(
          respostaComodidades.data.map((comodidade: Comodidade) => [
            comodidade.id,
            comodidade,
          ]),
        ),
      );
    } catch {
      Alert.alert('Erro', 'Nao foi possivel carregar as hospedagens.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function descreverEndereco(id: number) {
    const endereco = enderecos[id];

    if (!endereco) {
      return `Endereco: ${id}`;
    }

    return `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} - CEP ${endereco.cep}`;
  }

  function descreverComodidades(ids: number[]) {
    const nomes = ids
      .map((id) => comodidades[id]?.nome)
      .filter(Boolean)
      .join(', ');

    return nomes || 'Nenhuma comodidade informada';
  }

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir esta hospedagem?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/hospedagens/${id}/`);
            carregar();
          } catch {
            Alert.alert('Erro', 'Nao foi possivel excluir a hospedagem.');
          }
        },
      },
    ]);
  }

  function reservar(hospedagem: Hospedagem) {
    navigation.navigate('CriarReserva', {
      valoresIniciais: {
        hospedagem: hospedagem.id,
        quantidade_hospedes: 1,
        valor_total: hospedagem.preco_diaria,
        status: 'pendente',
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
        data={hospedagens}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhuma hospedagem encontrada.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.descricao}>
              Tipo: {item.tipo} | Diaria: R$ {item.preco_diaria}
            </Text>
            <Text style={styles.descricao}>
              Capacidade: {item.capacidade} | Quartos: {item.quartos} |
              Banheiros: {item.banheiros}
            </Text>
            <Text style={styles.descricao}>
              Endereco: {descreverEndereco(item.endereco)}
            </Text>
            <Text style={styles.descricao}>
              Comodidades: {descreverComodidades(item.comodidades)}
            </Text>

            <View style={styles.acoes}>
              {ehAnfitriao && (
                <>
                  <Pressable
                    style={[styles.botao, styles.editar]}
                    onPress={() =>
                      navigation.navigate('EditarHospedagem', { item })
                    }
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

              {ehHospede && (
                <Pressable
                  style={[styles.botao, styles.reservar]}
                  onPress={() => reservar(item)}
                >
                  <Text style={styles.textoBotao}>Reservar</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      />

      {ehAnfitriao && (
        <Pressable
          style={styles.adicionar}
          onPress={() => navigation.navigate('CriarHospedagem')}
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
  reservar: {
    backgroundColor: '#16a34a',
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
