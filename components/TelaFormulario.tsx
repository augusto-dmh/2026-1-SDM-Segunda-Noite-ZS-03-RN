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
  numero?: boolean;
  selecao?: { valor: string; nome: string }[];
  separadoPorVirgula?: boolean;
};

type Props = {
  endpoint: string;
  campos: CampoFormulario[];
};

export default function TelaFormulario({ endpoint, campos }: Props) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item = route.params?.item;
  const [valores, setValores] = useState<Record<string, string | boolean>>(
    () =>
      campos.reduce(
        (dados, campo) => {
          let valorInicial = item?.[campo.nome] ?? campo.valorPadrao ?? '';
          if (campo.separadoPorVirgula && Array.isArray(valorInicial)) {
            valorInicial = (valorInicial as number[]).join(',');
          }
          return { ...dados, [campo.nome]: String(valorInicial) };
        },
        {} as Record<string, string | boolean>,
      ),
  );
  const [salvando, setSalvando] = useState(false);

  function alterar(nome: string, valor: string | boolean) {
    setValores({ ...valores, [nome]: valor });
  }

  async function salvar() {
    try {
      setSalvando(true);

      const dados: Record<string, any> = { ...valores };

      for (const campo of campos) {
        if (campo.numero && dados[campo.nome] !== '') {
          dados[campo.nome] = Number(dados[campo.nome]);
        }
        if (campo.separadoPorVirgula) {
          const texto = String(dados[campo.nome] || '');
          dados[campo.nome] = texto
            ? texto.split(',').map((v: string) => Number(v.trim()))
            : [];
        }
      }

      if (item) {
        await api.put(`${endpoint}${item.id}/`, dados);
      } else {
        await api.post(endpoint, dados);
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
      {campos.map((campo) => {
        if (campo.booleano) {
          return (
            <View key={campo.nome} style={styles.linha}>
              <Text style={styles.label}>{campo.label}</Text>
              <Switch
                value={Boolean(valores[campo.nome])}
                onValueChange={(valor) => alterar(campo.nome, valor)}
              />
            </View>
          );
        }

        if (campo.selecao) {
          return (
            <View key={campo.nome} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{campo.label}</Text>
              <View style={styles.selecaoContainer}>
                {campo.selecao.map((opcao) => (
                  <Pressable
                    key={opcao.valor}
                    style={[
                      styles.selecaoBotao,
                      valores[campo.nome] === opcao.valor &&
                        styles.selecaoAtivo,
                    ]}
                    onPress={() => alterar(campo.nome, opcao.valor)}
                  >
                    <Text
                      style={[
                        styles.selecaoTexto,
                        valores[campo.nome] === opcao.valor &&
                          styles.selecaoTextoAtivo,
                      ]}
                    >
                      {opcao.nome}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          );
        }

        return (
          <CampoTexto
            key={campo.nome}
            label={campo.label}
            value={String(valores[campo.nome])}
            onChangeText={(valor) => alterar(campo.nome, valor)}
            keyboardType={campo.keyboardType}
            multiline={campo.multiline}
          />
        );
      })}
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
    marginBottom: 4,
  },
  selecaoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
