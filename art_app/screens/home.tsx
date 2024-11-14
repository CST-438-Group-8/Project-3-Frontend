import React, { useContext } from 'react';
import { Button, View, Text, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from 'components/UserInfo';

export default function HomeScreen({ navigation }) {
    const { email, setEmail, setUsername } = useContext(UserContext);
    
    const handleUploadScreen = () => {
      if (Platform.OS === 'web') {
        navigation.navigate('WebImageUpload');
      } else {
        navigation.navigate('AppImageUpload');
      }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        setEmail('');
        setUsername('');
        
        if (Platform.OS === 'web') {
            localStorage.removeItem('userToken'); // Clear token from localStorage
            navigation.navigate('WebSplashScreen');
        } else {
            navigation.navigate('SplashScreen');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Welcome to the home screen!</Text>
            <Text>Email: {email}</Text>
            <Button title="Logout" onPress={handleLogout} />

            <Button title="upload" onPress={handleUploadScreen} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
