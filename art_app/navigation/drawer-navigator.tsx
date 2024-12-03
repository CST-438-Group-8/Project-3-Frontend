import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderButton } from 'components/HeaderButton';

import { RootStackParamList } from '.';
import TabNavigator from './tab-navigator';
import Home from '../screens/home';
import AppImageUpload from 'screens/AppImageUpload';
import WebImageUpload from 'screens/WebImageUpload';
type Props = StackScreenProps<RootStackParamList, 'DrawerNavigator'>;

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ navigation }: Props) {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: ({ size, color }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={TabNavigator}
        options={{
          // headerRight: () => <HeaderButton onPress={() => navigation.navigate('Modal')} />,
          drawerIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
          name="Image Upload"
          component={AppImageUpload}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="image-outline" size={size} color={color} />
            ),
          }}
        />
    </Drawer.Navigator>
  );
}
