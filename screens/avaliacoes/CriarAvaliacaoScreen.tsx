import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { api } from '../../services/api';

export default function CriarAvaliacaoScreen() {
  const navigation = useNavigation();
  const [hospedagem, setHospedagem] = useState('');
  const [nomeHospede, setNomeHospede] = useState('');
  const [email, setEmail] = useState('');
  const [nota, setNota] = useState('');
  const [comentario, setComentario] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.post('/avaliacoes/', {
        hospedagem: Number(hospedagem),
        nome_hospede: nomeHospede,
        email,
        nota: Number(nota),
        comentario,
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
      <Text style={styles.label}>Nome do Hóspede</Text>
      <TextInput
        style={styles.input}
        value={nomeHospede}
        onChangeText={setNomeHospede}
      />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Nota</Text>
      <TextInput
        style={styles.input}
        value={nota}
        onChangeText={setNota}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Comentário</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={comentario}
        onChangeText={setComentario}
        multiline
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
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
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
