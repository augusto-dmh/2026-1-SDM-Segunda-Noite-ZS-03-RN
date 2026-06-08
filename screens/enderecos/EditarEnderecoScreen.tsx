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
} from 'react-native';

import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { api } from '../../services/api';

type Route = RouteProp<DrawerParamList, 'EditarEndereco'>;

export default function EditarEnderecoScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const endereco = route.params.item;
  const [logradouro, setLogradouro] = useState(String(endereco.logradouro ?? ''));
  const [numero, setNumero] = useState(String(endereco.numero ?? ''));
  const [complemento, setComplemento] = useState(
    String(endereco.complemento ?? ''),
  );
  const [bairro, setBairro] = useState(String(endereco.bairro ?? ''));
  const [cidade, setCidade] = useState(String(endereco.cidade ?? ''));
  const [estado, setEstado] = useState(String(endereco.estado ?? ''));
  const [cep, setCep] = useState(String(endereco.cep ?? ''));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/enderecos/${endereco.id}/`, {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
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
      <Text style={styles.label}>Logradouro</Text>
      <TextInput
        style={styles.input}
        value={logradouro}
        onChangeText={setLogradouro}
      />
      <Text style={styles.label}>Número</Text>
      <TextInput style={styles.input} value={numero} onChangeText={setNumero} />
      <Text style={styles.label}>Complemento</Text>
      <TextInput
        style={styles.input}
        value={complemento}
        onChangeText={setComplemento}
      />
      <Text style={styles.label}>Bairro</Text>
      <TextInput style={styles.input} value={bairro} onChangeText={setBairro} />
      <Text style={styles.label}>Cidade</Text>
      <TextInput style={styles.input} value={cidade} onChangeText={setCidade} />
      <Text style={styles.label}>Estado</Text>
      <TextInput style={styles.input} value={estado} onChangeText={setEstado} />
      <Text style={styles.label}>CEP</Text>
      <TextInput style={styles.input} value={cep} onChangeText={setCep} />
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
