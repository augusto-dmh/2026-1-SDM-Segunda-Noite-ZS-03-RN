import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from './CustomDrawerContent';
import HomeScreen from '../screens/HomeScreen';

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
    </Drawer.Navigator>
  );
}
