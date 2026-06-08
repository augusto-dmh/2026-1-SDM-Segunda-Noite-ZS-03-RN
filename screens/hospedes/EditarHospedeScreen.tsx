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

type Route = RouteProp<DrawerParamList, 'EditarHospede'>;

export default function EditarHospedeScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const hospede = route.params.item;
  const [nome, setNome] = useState(String(hospede.nome ?? ''));
  const [email, setEmail] = useState(String(hospede.email ?? ''));
  const [telefone, setTelefone] = useState(String(hospede.telefone ?? ''));
  const [documento, setDocumento] = useState(String(hospede.documento ?? ''));
  const [nacionalidade, setNacionalidade] = useState(
    String(hospede.nacionalidade ?? ''),
  );
  const [dataNascimento, setDataNascimento] = useState(
    String(hospede.data_nascimento ?? ''),
  );
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/hospedes/${hospede.id}/`, {
        nome,
        email,
        telefone,
        documento,
        nacionalidade,
        data_nascimento: dataNascimento,
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
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Documento</Text>
      <TextInput
        style={styles.input}
        value={documento}
        onChangeText={setDocumento}
      />
      <Text style={styles.label}>Nacionalidade</Text>
      <TextInput
        style={styles.input}
        value={nacionalidade}
        onChangeText={setNacionalidade}
      />
      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
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
