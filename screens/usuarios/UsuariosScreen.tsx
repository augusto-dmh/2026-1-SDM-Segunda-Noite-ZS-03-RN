import { useCallback, useState } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { DrawerParamList } from '../../navigation/DrawerNavigator';
import { api } from '../../services/api';

type Usuario = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function UsuariosScreen() {
  const navigation = useNavigation<Navigation>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/usuarios/');
      setUsuarios(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarUsuarios();
    }, [carregarUsuarios]),
  );

  function confirmarExclusao(id: number) {
    Alert.alert('Excluir', 'Deseja excluir este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/usuarios/${id}/`);
            carregarUsuarios();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir o usuário.');
          }
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum usuário encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              {item.nome}
              {'\n'}
              {item.email}
              {'\n'}
              CPF: {item.cpf}
            </Text>
            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.editar]}
                onPress={() => navigation.navigate('EditarUsuario', { item })}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.botao, styles.excluir]}
                onPress={() => confirmarExclusao(item.id)}
              >
                <Text style={styles.textoBotao}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate('CriarUsuario')}
      >
        <Text style={styles.textoAdicionar}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
  },
  descricao: {
    lineHeight: 20,
  },
  acoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  botao: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editar: {
    backgroundColor: '#2563eb',
  },
  excluir: {
    backgroundColor: '#dc2626',
  },
  textoBotao: {
    color: '#fff',
  },
  adicionar: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  textoAdicionar: {
    color: '#fff',
    fontSize: 30,
  },
});
