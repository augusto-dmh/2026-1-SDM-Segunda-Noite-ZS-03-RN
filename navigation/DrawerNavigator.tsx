import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';
import CriarUsuarioScreen from '../screens/usuarios/CriarUsuarioScreen';
import EditarUsuarioScreen from '../screens/usuarios/EditarUsuarioScreen';
import UsuariosScreen from '../screens/usuarios/UsuariosScreen';

const Drawer = createDrawerNavigator();

type Props = {
  onLogout: () => void;
};

export default function DrawerNavigator({ onLogout }: Props) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} onLogout={onLogout} />
      )}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Usuarios" component={UsuariosScreen} />
      <Drawer.Screen
        name="CriarUsuario"
        component={CriarUsuarioScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Criar usuário' }}
      />
      <Drawer.Screen
        name="EditarUsuario"
        component={EditarUsuarioScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar usuário' }}
      />
    </Drawer.Navigator>
  );
}
