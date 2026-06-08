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

type Route = RouteProp<DrawerParamList, 'CriarMensagem'>;

export default function CriarMensagemScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const valoresIniciais = route.params?.valoresIniciais ?? {};
  const ocultarHospedagem = Boolean(valoresIniciais.hospedagem);
  const [hospedagem, setHospedagem] = useState(
    String(valoresIniciais.hospedagem ?? ''),
  );
  const [nome, setNome] = useState(String(valoresIniciais.nome ?? ''));
  const [email, setEmail] = useState(String(valoresIniciais.email ?? ''));
  const [telefone, setTelefone] = useState(String(valoresIniciais.telefone ?? ''));
  const [assunto, setAssunto] = useState(String(valoresIniciais.assunto ?? ''));
  const [mensagem, setMensagem] = useState(String(valoresIniciais.mensagem ?? ''));
  const [lida, setLida] = useState(Boolean(valoresIniciais.lida));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.post('/mensagens/mensagens/', {
        hospedagem: Number(hospedagem),
        nome,
        email,
        telefone,
        assunto,
        mensagem,
        lida,
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
      {!ocultarHospedagem && (
        <>
          <Text style={styles.label}>ID da Hospedagem</Text>
          <TextInput
            style={styles.input}
            value={hospedagem}
            onChangeText={setHospedagem}
            keyboardType="numeric"
          />
        </>
      )}
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
      <Text style={styles.label}>Assunto</Text>
      <TextInput style={styles.input} value={assunto} onChangeText={setAssunto} />
      <Text style={styles.label}>Mensagem</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={mensagem}
        onChangeText={setMensagem}
        multiline
      />
      {!ocultarHospedagem && (
        <View style={styles.linha}>
          <Text style={styles.label}>Lida</Text>
          <Switch value={lida} onValueChange={setLida} />
        </View>
      )}
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
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
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
