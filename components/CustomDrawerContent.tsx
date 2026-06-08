import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';

type Props = DrawerContentComponentProps & {
  onLogout: () => void;
};

export default function CustomDrawerContent(props: Props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nome}>Hospedaria</Text>
      </View>
      <View style={styles.itens}>
        <DrawerItemList {...props} />
      </View>
      <DrawerItem label="Sair" onPress={props.onLogout} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#4B7BE5',
    alignItems: 'center',
  },
  nome: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  itens: {
    flex: 1,
    paddingTop: 10,
  },
});
