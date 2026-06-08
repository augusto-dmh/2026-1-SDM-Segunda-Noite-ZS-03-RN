import { useState } from 'react';
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

const METODOS = [
  { valor: 'cartao_credito', nome: 'Cartão de crédito' },
  { valor: 'cartao_debito', nome: 'Cartão de débito' },
  { valor: 'pix', nome: 'PIX' },
  { valor: 'boleto', nome: 'Boleto' },
  { valor: 'dinheiro', nome: 'Dinheiro' },
];

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'pago', nome: 'Pago' },
  { valor: 'cancelado', nome: 'Cancelado' },
  { valor: 'reembolsado', nome: 'Reembolsado' },
];

type Route = RouteProp<DrawerParamList, 'EditarPagamento'>;

export default function EditarPagamentoScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const pagamento = route.params.item;
  const [reserva, setReserva] = useState(String(pagamento.reserva ?? ''));
  const [valor, setValor] = useState(String(pagamento.valor ?? ''));
  const [metodo, setMetodo] = useState(String(pagamento.metodo ?? ''));
  const [status, setStatus] = useState(String(pagamento.status ?? ''));
  const [dataPagamento, setDataPagamento] = useState(
    String(pagamento.data_pagamento ?? ''),
  );
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/pagamentos/pagamentos/${pagamento.id}/`, {
        reserva: Number(reserva),
        valor: Number(valor),
        metodo,
        status,
        data_pagamento: dataPagamento,
      });
      navigation.goBack();
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
        onChangeText={setReserva}
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
      <Text style={styles.label}>Data do Pagamento (AAAA-MM-DD HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={dataPagamento}
        onChangeText={setDataPagamento}
      />
      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Salvar</Text>
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
