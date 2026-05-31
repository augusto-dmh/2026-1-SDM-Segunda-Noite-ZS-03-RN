import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Alert,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import CampoTexto from './CampoTexto';
import { api } from '../services/api';

export type CampoFormulario = {
  nome: string;
  label: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  booleano?: boolean;
  valorPadrao?: string | boolean;
};

type Props = {
  endpoint: string;
  campos: CampoFormulario[];
};

export default function TelaFormulario({ endpoint, campos }: Props) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item = route.params?.item;
  const [valores, setValores] = useState<Record<string, string | boolean>>(() =>
    campos.reduce(
      (dados, campo) => ({
        ...dados,
        [campo.nome]: item?.[campo.nome] ?? campo.valorPadrao ?? '',
      }),
      {},
    ),
  );
  const [salvando, setSalvando] = useState(false);

  function alterar(nome: string, valor: string | boolean) {
    setValores({ ...valores, [nome]: valor });
  }

  async function salvar() {
    try {
      setSalvando(true);

      if (item) {
        await api.put(`${endpoint}${item.id}/`, valores);
      } else {
        await api.post(endpoint, valores);
      }

      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {campos.map((campo) =>
        campo.booleano ? (
          <View key={campo.nome} style={styles.linha}>
            <Text style={styles.label}>{campo.label}</Text>
            <Switch
              value={Boolean(valores[campo.nome])}
              onValueChange={(valor) => alterar(campo.nome, valor)}
            />
          </View>
        ) : (
          <CampoTexto
            key={campo.nome}
            label={campo.label}
            value={String(valores[campo.nome])}
            onChangeText={(valor) => alterar(campo.nome, valor)}
            keyboardType={campo.keyboardType}
            multiline={campo.multiline}
          />
        ),
      )}
      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        <Text style={styles.textoBotao}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
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
