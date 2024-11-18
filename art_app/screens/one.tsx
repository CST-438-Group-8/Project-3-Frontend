// import { ScreenContent } from 'components/ScreenContent';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, useWindowDimensions, Dimensions, Button, Platform } from 'react-native';
import { UserContext } from 'components/UserInfo';
import { theme } from '../components/theme';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleUploadScreen, handleLogout } from '../components/NavigationFunctions';
import {styles} from '../components/styles';

export default function TabOneScreen({navigation}) {
  const { email, setEmail, setUsername } = useContext(UserContext);

  return (
    <View style={styles.container}>
        <Text>Welcome to the home screen!</Text>
        <Text>Email: {email}</Text>
        <Button title="Logout" onPress={() => handleLogout(AsyncStorage, setEmail, setUsername, Platform, navigation)} />
        <Button title="upload" onPress={() => handleUploadScreen(Platform ,navigation)} />
      </View>
  );
}
