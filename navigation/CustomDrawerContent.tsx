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
    <DrawerContentScrollView {...props}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Hospedaria</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Sair" onPress={props.onLogout} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
