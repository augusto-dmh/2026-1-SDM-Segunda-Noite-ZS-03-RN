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

type Route = RouteProp<DrawerParamList, 'EditarComodidade'>;

export default function EditarComodidadeScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const comodidade = route.params.item;
  const [nome, setNome] = useState(String(comodidade.nome ?? ''));
  const [descricao, setDescricao] = useState(String(comodidade.descricao ?? ''));
  const [icone, setIcone] = useState(String(comodidade.icone ?? ''));
  const [ativo, setAtivo] = useState(Boolean(comodidade.ativo));
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/comodidades/${comodidade.id}/`, {
        nome,
        descricao,
        icone,
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
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Text style={styles.label}>Ícone</Text>
      <TextInput style={styles.input} value={icone} onChangeText={setIcone} />
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
