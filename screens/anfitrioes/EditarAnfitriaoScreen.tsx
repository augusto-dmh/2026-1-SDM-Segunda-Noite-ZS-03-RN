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

type Route = RouteProp<DrawerParamList, 'EditarAnfitriao'>;

export default function EditarAnfitriaoScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const anfitriao = route.params.item;
  const [nome, setNome] = useState(String(anfitriao.nome ?? ''));
  const [email, setEmail] = useState(String(anfitriao.email ?? ''));
  const [telefone, setTelefone] = useState(String(anfitriao.telefone ?? ''));
  const [documento, setDocumento] = useState(String(anfitriao.documento ?? ''));
  const [bio, setBio] = useState(String(anfitriao.bio ?? ''));
  const [avaliacaoMedia, setAvaliacaoMedia] = useState(
    String(anfitriao.avaliacao_media ?? ''),
  );
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/anfitrioes/${anfitriao.id}/`, {
        nome,
        email,
        telefone,
        documento,
        bio,
        avaliacao_media: avaliacaoMedia,
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
      <Text style={styles.label}>Biografia</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Text style={styles.label}>Avaliação média</Text>
      <TextInput
        style={styles.input}
        value={avaliacaoMedia}
        onChangeText={setAvaliacaoMedia}
        keyboardType="decimal-pad"
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
