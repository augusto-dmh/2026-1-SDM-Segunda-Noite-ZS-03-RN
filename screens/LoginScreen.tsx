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

import { cadastrar, entrar } from '../services/api';

type Props = {
  onLogin: (token: string, tipoLogin: TipoLogin) => void;
};

export type TipoLogin = 'anfitriao' | 'hospede';
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
    if (!tipoLogin) {
      return;
    }

    if (!username || !password) {
      Alert.alert('Atencao', 'Informe usuario e senha.');
      return;
    }

    try {
      setCarregando(true);
      const token = await entrar(username, password);
      onLogin(token, tipoLogin);
    } catch {
      Alert.alert('Erro', 'Usuario ou senha invalidos.');
    } finally {
      setCarregando(false);
    }
  }

  async function fazerCadastro() {
    if (!tipoLogin) {
      return;
    }

    if (!username || !password) {
      Alert.alert('Atencao', 'Informe usuario e senha.');
      return;
    }

    try {
      setCarregando(true);
      const token = await cadastrar(username, password, email, tipoLogin);
      onLogin(token, tipoLogin);
    } catch {
      Alert.alert('Erro', 'Nao foi possivel criar o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  function selecionarTipo(tipo: TipoLogin) {
    setTipoLogin(tipo);
    setModoFormulario('login');
    setUsername('');
    setEmail('');
    setPassword('');
  }

  if (!tipoLogin) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Hospedaria</Text>
        <Text style={styles.subtitulo}>Como voce deseja entrar?</Text>

        <Pressable
          style={styles.botaoOpcao}
          onPress={() => selecionarTipo('anfitriao')}
        >
          <Text style={styles.textoBotao}>Logar como anfitriao</Text>
        </Pressable>

        <Pressable
          style={styles.botaoOpcao}
          onPress={() => selecionarTipo('hospede')}
        >
          <Text style={styles.textoBotao}>Logar como hospede</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoFormulario === 'cadastro'
          ? 'Criar cadastro'
          : tipoLogin === 'anfitriao'
            ? 'Login do anfitriao'
            : 'Login do hospede'}
      </Text>
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
        onPress={() =>
          setModoFormulario(
            modoFormulario === 'cadastro' ? 'login' : 'cadastro',
          )
        }
        disabled={carregando}
      >
        <Text style={styles.textoVoltar}>
          {modoFormulario === 'cadastro'
            ? 'Ja tenho cadastro'
            : 'Criar cadastro'}
        </Text>
      </Pressable>
      <Pressable
        style={styles.botaoVoltar}
        onPress={() => setTipoLogin(null)}
        disabled={carregando}
      >
        <Text style={styles.textoVoltar}>Voltar</Text>
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
    marginBottom: 12,
  },
  botaoVoltar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoSecundario: {
    padding: 14,
    alignItems: 'center',
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
