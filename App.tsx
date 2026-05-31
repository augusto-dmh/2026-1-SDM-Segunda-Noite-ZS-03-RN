import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';

import DrawerNavigator from './navigation/DrawerNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator onLogout={() => {}} />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
