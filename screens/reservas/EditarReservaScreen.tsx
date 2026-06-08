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

const STATUS = [
  { valor: 'pendente', nome: 'Pendente' },
  { valor: 'confirmada', nome: 'Confirmada' },
  { valor: 'cancelada', nome: 'Cancelada' },
  { valor: 'finalizada', nome: 'Finalizada' },
];

type Route = RouteProp<DrawerParamList, 'EditarReserva'>;

export default function EditarReservaScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const reserva = route.params.item;
  const [hospedagem, setHospedagem] = useState(String(reserva.hospedagem ?? ''));
  const [hospede, setHospede] = useState(String(reserva.hospede ?? ''));
  const [dataCheckin, setDataCheckin] = useState(
    String(reserva.data_checkin ?? ''),
  );
  const [dataCheckout, setDataCheckout] = useState(
    String(reserva.data_checkout ?? ''),
  );
  const [quantidadeHospedes, setQuantidadeHospedes] = useState(
    String(reserva.quantidade_hospedes ?? ''),
  );
  const [valorTotal, setValorTotal] = useState(String(reserva.valor_total ?? ''));
  const [status, setStatus] = useState(String(reserva.status ?? ''));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/reservas/reservas/${reserva.id}/`, {
        hospedagem: Number(hospedagem),
        hospede: Number(hospede),
        data_checkin: dataCheckin,
        data_checkout: dataCheckout,
        quantidade_hospedes: Number(quantidadeHospedes),
        valor_total: Number(valorTotal),
        status,
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
        onChangeText={setValorTotal}
        keyboardType="decimal-pad"
      />
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
