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

type Anfitriao = {
  id: number;
  nome: string;
  email: string;
  avaliacao_media: string;
};

type Navigation = DrawerNavigationProp<DrawerParamList>;

export default function AnfitrioesScreen() {
  const navigation = useNavigation<Navigation>();
  const [anfitrioes, setAnfitrioes] = useState<Anfitriao[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarAnfitrioes = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get('/anfitrioes/');
      setAnfitrioes(resposta.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os anfitriões.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarAnfitrioes();
    }, [carregarAnfitrioes]),
  );

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
        data={anfitrioes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text>Nenhum anfitrião encontrado.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.descricao}>
              {item.nome}
              {'\n'}
              {item.email}
              {'\n'}
              Avaliação: {item.avaliacao_media}
            </Text>
            <View style={styles.acoes}>
              <Pressable
                style={[styles.botao, styles.editar]}
                onPress={() => navigation.navigate('EditarAnfitriao', { item })}
              >
                <Text style={styles.textoBotao}>Editar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Pressable
        style={styles.adicionar}
        onPress={() => navigation.navigate('CriarAnfitriao')}
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
