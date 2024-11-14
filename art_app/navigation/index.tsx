import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import DrawerNavigator from './drawer-navigator';
import Modal from '../screens/modal';
import SplashScreen from '../screens/SplashScreen';
import WebSplashScreen from '../screens/WebSplashScreen';
import { SignUpScreen } from 'components/SignUpScreenContent';
import WebImageUpload from 'components/WebImageUpload';
import AppImageUpload from 'components/AppImageUpload';

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Modal: undefined;
  TabNavigator: undefined;
  SplashScreen: undefined;
  WebSplashScreen: undefined;
  WebImageUpload: undefined;
  AppImageUpload: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Platform.OS === 'web' ? 'WebSplashScreen' : 'SplashScreen'}>
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebSplashScreen"
          component={WebSplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WebImageUpload"
          component={WebImageUpload}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppImageUpload"
          component={AppImageUpload}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{ presentation: 'modal', headerLeft: () => null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
