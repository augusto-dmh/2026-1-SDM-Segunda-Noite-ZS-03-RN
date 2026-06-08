import { useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { api } from '../../services/api';

type Route = RouteProp<DrawerParamList, 'EditarUsuario'>;

export default function EditarUsuarioScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const usuario = route.params.item;
  const [nome, setNome] = useState(String(usuario.nome ?? ''));
  const [email, setEmail] = useState(String(usuario.email ?? ''));
  const [telefone, setTelefone] = useState(String(usuario.telefone ?? ''));
  const [cpf, setCpf] = useState(String(usuario.cpf ?? ''));
  const [dataNascimento, setDataNascimento] = useState(
    String(usuario.data_nascimento ?? ''),
  );
  const [ativo, setAtivo] = useState(Boolean(usuario.ativo));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/usuarios/${usuario.id}/`, {
        nome,
        email,
        telefone,
        cpf,
        data_nascimento: dataNascimento,
        ativo,
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
      <Text style={styles.label}>CPF</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      <View style={styles.linha}>
        <Text style={styles.label}>Ativo</Text>
        <Switch value={ativo} onValueChange={setAtivo} />
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
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
