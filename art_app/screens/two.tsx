import React, { useState, useContext } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform,} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../components/theme';
import { UserContext } from '../components/UserInfo';
import { handleLogout } from '../components/NavigationFunctions';

export default function SettingsScreen({ navigation }) {
  const {setUsername, setEmail} = useContext(UserContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleLogout(AsyncStorage, setEmail, setUsername, Platform, navigation)} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: 15,
  },
  changePictureButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  changePictureText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signOutButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

