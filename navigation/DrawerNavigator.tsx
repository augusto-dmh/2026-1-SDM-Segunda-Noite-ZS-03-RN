import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from './CustomDrawerContent';
import AnfitrioesScreen from '../screens/anfitrioes/AnfitrioesScreen';
import CriarAnfitriaoScreen from '../screens/anfitrioes/CriarAnfitriaoScreen';
import EditarAnfitriaoScreen from '../screens/anfitrioes/EditarAnfitriaoScreen';
import EnderecosScreen from '../screens/enderecos/EnderecosScreen';
import HomeScreen from '../screens/HomeScreen';
import CriarHospedeScreen from '../screens/hospedes/CriarHospedeScreen';
import EditarHospedeScreen from '../screens/hospedes/EditarHospedeScreen';
import HospedesScreen from '../screens/hospedes/HospedesScreen';
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
      <Drawer.Screen name="Hospedes" component={HospedesScreen} />
      <Drawer.Screen name="Anfitrioes" component={AnfitrioesScreen} />
      <Drawer.Screen name="Enderecos" component={EnderecosScreen} />
      <Drawer.Screen
        name="CriarAnfitriao"
        component={CriarAnfitriaoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Criar anfitrião' }}
      />
      <Drawer.Screen
        name="EditarAnfitriao"
        component={EditarAnfitriaoScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar anfitrião' }}
      />
      <Drawer.Screen
        name="CriarHospede"
        component={CriarHospedeScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Criar hóspede' }}
      />
      <Drawer.Screen
        name="EditarHospede"
        component={EditarHospedeScreen}
        options={{ drawerItemStyle: { display: 'none' }, title: 'Editar hóspede' }}
      />
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
