import { useEffect, useState } from 'react';
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

const TIPOS = [
  { valor: 'casa', nome: 'Casa' },
  { valor: 'apartamento', nome: 'Apartamento' },
  { valor: 'quarto', nome: 'Quarto' },
  { valor: 'hostel', nome: 'Hostel' },
  { valor: 'pousada', nome: 'Pousada' },
];

type Endereco = {
  id: number;
  logradouro: string;
  numero: string;
  cidade: string;
  estado: string;
};

type Comodidade = {
  id: number;
  nome: string;
};

type Route = RouteProp<DrawerParamList, 'EditarHospedagem'>;

export default function EditarHospedagemScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const hospedagem = route.params.item;
  const [titulo, setTitulo] = useState(String(hospedagem.titulo ?? ''));
  const [descricao, setDescricao] = useState(String(hospedagem.descricao ?? ''));
  const [tipo, setTipo] = useState(String(hospedagem.tipo ?? ''));
  const [endereco, setEndereco] = useState(String(hospedagem.endereco ?? ''));
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState<
    string[]
  >(
    Array.isArray(hospedagem.comodidades)
      ? hospedagem.comodidades.map((id: number) => String(id))
      : [],
  );
  const [precoDiaria, setPrecoDiaria] = useState(
    String(hospedagem.preco_diaria ?? ''),
  );
  const [capacidade, setCapacidade] = useState(String(hospedagem.capacidade ?? ''));
  const [quartos, setQuartos] = useState(String(hospedagem.quartos ?? ''));
  const [banheiros, setBanheiros] = useState(String(hospedagem.banheiros ?? ''));
  const [ativo, setAtivo] = useState(Boolean(hospedagem.ativo));
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [comodidades, setComodidades] = useState<Comodidade[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [respostaEnderecos, respostaComodidades] = await Promise.all([
          api.get('/enderecos/'),
          api.get('/comodidades/'),
        ]);
        setEnderecos(respostaEnderecos.data);
        setComodidades(respostaComodidades.data);
      } catch {
        Alert.alert('Erro', 'Não foi possível carregar as opções.');
      }
    }

    carregarOpcoes();
  }, []);

  function alternarComodidade(id: string) {
    if (comodidadesSelecionadas.includes(id)) {
      setComodidadesSelecionadas(
        comodidadesSelecionadas.filter((comodidade) => comodidade !== id),
      );
      return;
    }

    setComodidadesSelecionadas([...comodidadesSelecionadas, id]);
  }

  async function salvar() {
    try {
      setSalvando(true);
      await api.put(`/hospedagens/${hospedagem.id}/`, {
        titulo,
        descricao,
        tipo,
        endereco: Number(endereco),
        comodidades: comodidadesSelecionadas.map((id) => Number(id)),
        preco_diaria: Number(precoDiaria),
        capacidade: Number(capacidade),
        quartos: Number(quartos),
        banheiros: Number(banheiros),
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
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />
      <Text style={styles.label}>Tipo</Text>
      <View style={styles.selecaoContainer}>
        {TIPOS.map((opcao) => (
          <Pressable
            key={opcao.valor}
            style={[
              styles.selecaoBotao,
              tipo === opcao.valor && styles.selecaoAtivo,
            ]}
            onPress={() => setTipo(opcao.valor)}
          >
            <Text
              style={[
                styles.selecaoTexto,
                tipo === opcao.valor && styles.selecaoTextoAtivo,
              ]}
            >
              {opcao.nome}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Endereço</Text>
      <View style={styles.selecaoContainer}>
        {enderecos.map((opcao) => {
          const valor = String(opcao.id);
          const selecionado = endereco === valor;
          return (
            <Pressable
              key={opcao.id}
              style={[styles.selecaoBotao, selecionado && styles.selecaoAtivo]}
              onPress={() => setEndereco(valor)}
            >
              <Text
                style={[
                  styles.selecaoTexto,
                  selecionado && styles.selecaoTextoAtivo,
                ]}
              >
                {opcao.logradouro}, {opcao.numero} - {opcao.cidade}/
                {opcao.estado}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.label}>Comodidades</Text>
      <View style={styles.selecaoContainer}>
        {comodidades.map((opcao) => {
          const valor = String(opcao.id);
          const selecionado = comodidadesSelecionadas.includes(valor);
          return (
            <Pressable
              key={opcao.id}
              style={[styles.selecaoBotao, selecionado && styles.selecaoAtivo]}
              onPress={() => alternarComodidade(valor)}
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
      <Text style={styles.label}>Preço da diária (R$)</Text>
      <TextInput
        style={styles.input}
        value={precoDiaria}
        onChangeText={setPrecoDiaria}
        keyboardType="decimal-pad"
      />
      <Text style={styles.label}>Capacidade</Text>
      <TextInput
        style={styles.input}
        value={capacidade}
        onChangeText={setCapacidade}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Quartos</Text>
      <TextInput
        style={styles.input}
        value={quartos}
        onChangeText={setQuartos}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Banheiros</Text>
      <TextInput
        style={styles.input}
        value={banheiros}
        onChangeText={setBanheiros}
        keyboardType="numeric"
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
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  selecaoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
