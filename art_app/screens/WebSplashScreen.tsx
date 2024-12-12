import React, { useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../components/UserInfo';

const webClientId = '763302642477-t7v8ppah1lfcbkfu4kmdj59fv06aig0t.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

export default function WebSplashScreen({ navigation }) {
    const { setEmail } = useContext(UserContext);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: webClientId,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            const { accessToken } = response.authentication;
            AsyncStorage.setItem('userToken', accessToken) // Save token to AsyncStorage
                .catch(err => console.error('Failed to save token:', err));
            handleUserAuthentication(accessToken);
        }
    }, [response]);

    async function handleUserAuthentication(token) {
        try {
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = await res.json();
            setEmail(userInfo.email); // Save the user's email using setEmail
            navigation.reset({
                index: 0,
                routes: [{ name: "SignUpScreen" }],
              });
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user information. Please try again.');
            console.error('Failed to fetch user email:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text>Login to app</Text>
            <Button
                title="Sign in with Google"
                disabled={!request}
                onPress={() => promptAsync({ useProxy: true })}
                accessibilityLabel="Sign in with Google"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
});
