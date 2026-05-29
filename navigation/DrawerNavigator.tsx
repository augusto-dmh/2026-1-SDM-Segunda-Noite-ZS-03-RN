import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';

import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

type Props = {
  onLogout: () => void;
};

function InicioTemporario() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Hospedaria</Text>
    </View>
  );
}

export default function DrawerNavigator({ onLogout }: Props) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen name="Inicio" component={InicioTemporario} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
