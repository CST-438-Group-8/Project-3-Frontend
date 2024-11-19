import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert, Platform,} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../components/theme';

export default function SettingsScreen({ navigation }) {
  const [profilePicture, setProfilePicture] = useState(
    'https://via.placeholder.com/100' // Default profile picture
  );

  const handleSignOut = async () => {
    //need function
  };

  const handleChangeProfilePicture = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        setProfilePicture(selectedImage);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <TouchableOpacity onPress={handleChangeProfilePicture} style={styles.changePictureButton}>
          <Text style={styles.changePictureText}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
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

