import { useEffect, useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { api } from '../../services/api';

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'confirmada', nome: 'Confirmada' },
  { valor: 'cancelada', nome: 'Cancelada' },
  { valor: 'finalizada', nome: 'Finalizada' },
];

type Navigation = DrawerNavigationProp<DrawerParamList>;
type Route = RouteProp<DrawerParamList, 'CriarReserva'>;

export default function CriarReservaScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const valoresIniciais = route.params?.valoresIniciais ?? {};
  const deveOcultarIds = Boolean(
    valoresIniciais.hospedagem && valoresIniciais.hospede,
  );
  const [hospedagem, setHospedagem] = useState(
    String(valoresIniciais.hospedagem ?? ''),
  );
  const [hospede, setHospede] = useState(String(valoresIniciais.hospede ?? ''));
  const [dataCheckin, setDataCheckin] = useState('');
  const [dataCheckout, setDataCheckout] = useState('');
  const [quantidadeHospedes, setQuantidadeHospedes] = useState(
    String(valoresIniciais.quantidade_hospedes ?? ''),
  );
  const [valorTotal, setValorTotal] = useState(
    String(valoresIniciais.valor_total ?? ''),
  );
  const [status, setStatus] = useState(
    String(valoresIniciais.status ?? 'pendente'),
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const precoDiaria = Number(valoresIniciais.preco_diaria);

    if (!precoDiaria || !dataCheckin || !dataCheckout) {
      return;
    }

    const checkin = new Date(`${dataCheckin}T00:00:00`);
    const checkout = new Date(`${dataCheckout}T00:00:00`);
    const dias = (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24);

    if (dias > 0) {
      setValorTotal((dias * precoDiaria).toFixed(2));
    }
  }, [dataCheckin, dataCheckout, valoresIniciais.preco_diaria]);

  async function salvar() {
    try {
      setSalvando(true);
      const dados = {
        hospedagem: Number(hospedagem),
        hospede: Number(hospede),
        data_checkin: dataCheckin,
        data_checkout: dataCheckout,
        quantidade_hospedes: Number(quantidadeHospedes),
        valor_total: Number(valorTotal),
        status,
      };
      const resposta = await api.post('/reservas/reservas/', dados);

      navigation.navigate('CriarPagamento', {
        valoresIniciais: {
          reserva: resposta.data.id,
          hospedagem: resposta.data.hospedagem ?? dados.hospedagem,
          valor: resposta.data.valor_total ?? dados.valor_total,
          status: 'pago',
        },
      });
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!deveOcultarIds && (
        <>
          <Text style={styles.label}>ID da Hospedagem</Text>
          <TextInput
            style={styles.input}
            value={hospedagem}
            onChangeText={setHospedagem}
            keyboardType="numeric"
          />
          <Text style={styles.label}>ID do hóspede</Text>
          <TextInput
            style={styles.input}
            value={hospede}
            onChangeText={setHospede}
            keyboardType="numeric"
          />
        </>
      )}
      <Text style={styles.label}>Data de Check-in (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={dataCheckin}
        onChangeText={setDataCheckin}
      />
      <Text style={styles.label}>Data de Check-out (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={dataCheckout}
        onChangeText={setDataCheckout}
      />
      <Text style={styles.label}>Quantidade de hóspedes</Text>
      <TextInput
        style={styles.input}
        value={quantidadeHospedes}
        onChangeText={setQuantidadeHospedes}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Valor Total (R$)</Text>
      <TextInput
        style={styles.input}
        value={valorTotal}
        onChangeText={deveOcultarIds ? undefined : setValorTotal}
        keyboardType="decimal-pad"
      />
      {!deveOcultarIds && (
        <>
          <Text style={styles.label}>Status</Text>
          <View style={styles.selecaoContainer}>
            {STATUS.map((opcao) => (
              <Pressable
                key={opcao.valor}
                style={[
                  styles.selecaoBotao,
                  status === opcao.valor && styles.selecaoAtivo,
                ]}
                onPress={() => setStatus(opcao.valor)}
              >
                <Text
                  style={[
                    styles.selecaoTexto,
                    status === opcao.valor && styles.selecaoTextoAtivo,
                  ]}
                >
                  {opcao.nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Ir para pagamento</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  selecaoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selecaoBotao: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  selecaoAtivo: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  selecaoTexto: {
    color: '#333',
  },
  selecaoTextoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
