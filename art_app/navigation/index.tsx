import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import DrawerNavigator from './drawer-navigator';
import Modal from '../screens/modal';
import viewUser from '../screens/viewUser';
import SplashScreen from '../screens/SplashScreen';
import WebSplashScreen from '../screens/WebSplashScreen';
import SignUpScreen from '../screens/SignUp';
import WebImageUpload from '../screens/WebImageUpload';
import AppImageUpload from '../screens/AppImageUpload';

export type RootStackParamList = {
  DrawerNavigator: undefined;
  Modal: undefined;
  TabNavigator: undefined;
  ViewUser: undefined;
  SplashScreen: undefined;
  WebSplashScreen: undefined;
  WebImageUpload: undefined;
  AppImageUpload: undefined;
  SignUpScreen: undefined;
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
        <Stack.Screen
          name="ViewUser"
          component={viewUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
