import React, { useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { UserContext } from 'components/UserInfo';

const webClientId = '763302642477-t7v8ppah1lfcbkfu4kmdj59fv06aig0t.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

export default function WebSplashScreen({ navigation }) {
    const { setEmail } = useContext(UserContext);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: webClientId,
        redirectUri: AuthSession.makeRedirectUri({
            useProxy: true,
        }),
    });

    useEffect(() => {
        const checkStoredToken = async () => {
            const token = localStorage.getItem('userToken');
            if (token) {
                fetchUserEmail(token);
            }
        };
        checkStoredToken();
    }, []);

    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            const { accessToken } = response.authentication;
            localStorage.setItem('userToken', accessToken); // Save token to localStorage
            fetchUserEmail(accessToken);
        }
    }, [response]);

    async function fetchUserEmail(token) {
        console.log(token);
        try {
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = await res.json();
            setEmail(userInfo.email);
            navigation.navigate('DrawerNavigator', { screen: 'Home' });
        } catch (error) {
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
