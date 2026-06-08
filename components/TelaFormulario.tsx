import { useEffect, useState } from 'react';
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
  selecaoEndpoint?: string;
  selecaoNome?: (item: any) => string;
  multipla?: boolean;
  separadoPorVirgula?: boolean;
  oculto?: boolean;
  somenteLeitura?: boolean;
};

type Props = {
  endpoint: string;
  campos: CampoFormulario[];
  textoBotao?: string;
  textoSalvando?: string;
  aoSalvarSucesso?: (
    itemSalvo: any,
    dadosEnviados: Record<string, any>,
  ) => void | Promise<void>;
};

export default function TelaFormulario({
  endpoint,
  campos,
  textoBotao = 'Salvar',
  textoSalvando = 'Salvando...',
  aoSalvarSucesso,
}: Props) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const item = route.params?.item;
  const valoresIniciais = route.params?.valoresIniciais ?? {};
  const [valores, setValores] = useState<
    Record<string, string | boolean | string[]>
  >(
    () =>
      campos.reduce(
        (dados, campo) => {
          let valorInicial =
            item?.[campo.nome] ??
            valoresIniciais[campo.nome] ??
            campo.valorPadrao ??
            '';
          if (campo.separadoPorVirgula && Array.isArray(valorInicial)) {
            valorInicial = (valorInicial as number[]).join(',');
          }
          if (campo.multipla && Array.isArray(valorInicial)) {
            return {
              ...dados,
              [campo.nome]: valorInicial.map((valor) => String(valor)),
            };
          }
          return { ...dados, [campo.nome]: String(valorInicial) };
        },
        {} as Record<string, string | boolean | string[]>,
      ),
  );
  const [opcoesRemotas, setOpcoesRemotas] = useState<
    Record<string, { valor: string; nome: string }[]>
  >({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const precoDiaria = Number(valoresIniciais.preco_diaria);
    const checkin = String(valores.data_checkin || '');
    const checkout = String(valores.data_checkout || '');

    if (!precoDiaria || !checkin || !checkout || !('valor_total' in valores)) {
      return;
    }

    const dataCheckin = new Date(`${checkin}T00:00:00`);
    const dataCheckout = new Date(`${checkout}T00:00:00`);
    const diferenca = dataCheckout.getTime() - dataCheckin.getTime();
    const dias = diferenca / (1000 * 60 * 60 * 24);

    if (dias > 0) {
      const valorCalculado = (dias * precoDiaria).toFixed(2);

      if (valores.valor_total !== valorCalculado) {
        setValores((valoresAtuais) => ({
          ...valoresAtuais,
          valor_total: valorCalculado,
        }));
      }
    }
  }, [
    valores.data_checkin,
    valores.data_checkout,
    valores.valor_total,
    valoresIniciais.preco_diaria,
  ]);

  useEffect(() => {
    campos
      .filter((campo) => campo.selecaoEndpoint)
      .forEach(async (campo) => {
        try {
          const resposta = await api.get(campo.selecaoEndpoint as string);
          setOpcoesRemotas((opcoesAtuais) => ({
            ...opcoesAtuais,
            [campo.nome]: resposta.data.map((item: any) => ({
              valor: String(item.id),
              nome: campo.selecaoNome ? campo.selecaoNome(item) : String(item.id),
            })),
          }));
        } catch {
          Alert.alert('Erro', `Não foi possível carregar ${campo.label}.`);
        }
      });
  }, [campos]);

  function alterar(nome: string, valor: string | boolean | string[]) {
    setValores({ ...valores, [nome]: valor });
  }

  function alternarMultipla(nome: string, valor: string) {
    const valoresAtuais = Array.isArray(valores[nome])
      ? (valores[nome] as string[])
      : [];

    if (valoresAtuais.includes(valor)) {
      alterar(
        nome,
        valoresAtuais.filter((item) => item !== valor),
      );
      return;
    }

    alterar(nome, [...valoresAtuais, valor]);
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
        if (campo.selecaoEndpoint) {
          if (campo.multipla) {
            dados[campo.nome] = Array.isArray(dados[campo.nome])
              ? dados[campo.nome].map((valor: string) => Number(valor))
              : [];
          } else if (dados[campo.nome] !== '') {
            dados[campo.nome] = Number(dados[campo.nome]);
          }
        }
      }

      let resposta;

      if (item) {
        resposta = await api.put(`${endpoint}${item.id}/`, dados);
      } else {
        resposta = await api.post(endpoint, dados);
      }

      if (aoSalvarSucesso) {
        await aoSalvarSucesso(resposta.data, dados);
        return;
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
        if (campo.oculto) {
          return null;
        }

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

        const opcoes = campo.selecao ?? opcoesRemotas[campo.nome];

        if (opcoes) {
          return (
            <View key={campo.nome} style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{campo.label}</Text>
              <View style={styles.selecaoContainer}>
                {opcoes.map((opcao) => {
                  const selecionado = campo.multipla
                    ? Array.isArray(valores[campo.nome]) &&
                      (valores[campo.nome] as string[]).includes(opcao.valor)
                    : valores[campo.nome] === opcao.valor;

                  return (
                    <Pressable
                      key={opcao.valor}
                      style={[
                        styles.selecaoBotao,
                        selecionado && styles.selecaoAtivo,
                      ]}
                      onPress={() =>
                        campo.multipla
                          ? alternarMultipla(campo.nome, opcao.valor)
                          : alterar(campo.nome, opcao.valor)
                      }
                    >
                      <Text
                        style={[
                          styles.selecaoTexto,
                          selecionado && styles.selecaoTextoAtivo,
                        ]}
                      >
                        {opcao.nome}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }

        return (
          <CampoTexto
            key={campo.nome}
            label={campo.label}
            value={String(valores[campo.nome])}
            onChangeText={(valor) =>
              campo.somenteLeitura ? undefined : alterar(campo.nome, valor)
            }
            keyboardType={campo.keyboardType}
            multiline={campo.multiline}
          />
        );
      })}
      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        <Text style={styles.textoBotao}>
          {salvando ? textoSalvando : textoBotao}
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
