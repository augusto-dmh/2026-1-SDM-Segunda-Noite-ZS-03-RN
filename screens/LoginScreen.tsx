import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { cadastrar, entrar, SessaoLogin, TipoLogin } from '../services/api';

type Props = {
  onLogin: (sessao: SessaoLogin) => void;
};

type ModoFormulario = 'login' | 'cadastro';

export default function LoginScreen({ onLogin }: Props) {
  const [tipoLogin, setTipoLogin] = useState<TipoLogin | null>(null);
  const [modoFormulario, setModoFormulario] =
    useState<ModoFormulario>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    if (!username || !password) {
      Alert.alert('Atencao', 'Informe usuario e senha.');
      return;
    }

    try {
      setCarregando(true);
      const sessao = await entrar(username, password);
      onLogin(sessao);
    } catch {
      Alert.alert('Erro', 'Usuario ou senha invalidos.');
    } finally {
      setCarregando(false);
    }
  }

  async function fazerCadastro() {
    if (!tipoLogin) {
      Alert.alert('Atencao', 'Escolha o tipo de cadastro.');
      return;
    }

    if (!username || !email || !password) {
      Alert.alert('Atencao', 'Informe usuario, email e senha.');
      return;
    }

    try {
      setCarregando(true);
      const sessao = await cadastrar(username, password, email, tipoLogin);
      onLogin(sessao);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel criar o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  function selecionarTipo(tipo: TipoLogin) {
    setTipoLogin(tipo);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoFormulario === 'cadastro' ? 'Criar cadastro' : 'Login'}
      </Text>
      {modoFormulario === 'cadastro' && (
        <>
          <Text style={styles.subtitulo}>Escolha o tipo de cadastro</Text>
          <View style={styles.linhaOpcoes}>
            <Pressable
              style={[
                styles.botaoOpcao,
                tipoLogin === 'anfitriao' && styles.botaoOpcaoAtivo,
              ]}
              onPress={() => selecionarTipo('anfitriao')}
            >
              <Text style={styles.textoBotao}>Anfitriao</Text>
            </Pressable>

            <Pressable
              style={[
                styles.botaoOpcao,
                tipoLogin === 'hospede' && styles.botaoOpcaoAtivo,
              ]}
              onPress={() => selecionarTipo('hospede')}
            >
              <Text style={styles.textoBotao}>Hospede</Text>
            </Pressable>
          </View>
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      {modoFormulario === 'cadastro' && (
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        style={styles.botao}
        onPress={modoFormulario === 'cadastro' ? fazerCadastro : fazerLogin}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>
            {modoFormulario === 'cadastro' ? 'Cadastrar' : 'Entrar'}
          </Text>
        )}
      </Pressable>
      <Pressable
        style={styles.botaoSecundario}
        onPress={() => {
          setModoFormulario(
            modoFormulario === 'cadastro' ? 'login' : 'cadastro',
          );
          setTipoLogin(null);
        }}
        disabled={carregando}
      >
        <Text style={styles.textoVoltar}>
          {modoFormulario === 'cadastro'
            ? 'Ja tenho cadastro'
            : 'Criar cadastro'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f7f7f7',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 14,
    alignItems: 'center',
  },
  botaoOpcao: {
    backgroundColor: '#2563eb',
    borderRadius: 6,
    padding: 16,
    alignItems: 'center',
    flex: 1,
  },
  botaoOpcaoAtivo: {
    backgroundColor: '#1d4ed8',
  },
  botaoSecundario: {
    padding: 14,
    alignItems: 'center',
  },
  linhaOpcoes: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoVoltar: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
