import { useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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

const METODOS = [
  { valor: 'cartao_credito', nome: 'Cartão de crédito' },
  { valor: 'cartao_debito', nome: 'Cartão de débito' },
  { valor: 'pix', nome: 'PIX' },
  { valor: 'boleto', nome: 'Boleto' },
  { valor: 'dinheiro', nome: 'Dinheiro' },
];

type Navigation = DrawerNavigationProp<DrawerParamList>;
type Route = RouteProp<DrawerParamList, 'CriarPagamento'>;

export default function CriarPagamentoScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const valoresIniciais = route.params?.valoresIniciais ?? {};
  const bloquearReserva = Boolean(valoresIniciais.reserva);
  const [reserva, setReserva] = useState(String(valoresIniciais.reserva ?? ''));
  const [valor, setValor] = useState(String(valoresIniciais.valor ?? ''));
  const [metodo, setMetodo] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.post('/pagamentos/pagamentos/', {
        reserva: Number(reserva),
        valor: Number(valor),
        metodo,
        status: 'pago',
      });
      await api.patch(`/reservas/reservas/${reserva}/`, {
        status: 'confirmada',
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Reservas' }],
        }),
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>ID da Reserva</Text>
      <TextInput
        style={styles.input}
        value={reserva}
        onChangeText={bloquearReserva ? undefined : setReserva}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
      />
      <Text style={styles.label}>Método</Text>
      <View style={styles.selecaoContainer}>
        {METODOS.map((opcao) => (
          <Pressable
            key={opcao.valor}
            style={[
              styles.selecaoBotao,
              metodo === opcao.valor && styles.selecaoAtivo,
            ]}
            onPress={() => setMetodo(opcao.valor)}
          >
            <Text
              style={[
                styles.selecaoTexto,
                metodo === opcao.valor && styles.selecaoTextoAtivo,
              ]}
            >
              {opcao.nome}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Pagar</Text>
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
