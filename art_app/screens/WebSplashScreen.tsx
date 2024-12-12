import React, { useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { UserContext } from '../components/UserInfo';
import { theme } from 'components/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const webClientId = '763302642477-t7v8ppah1lfcbkfu4kmdj59fv06aig0t.apps.googleusercontent.com';

WebBrowser.maybeCompleteAuthSession();

export default function WebSplashScreen({ navigation }) {
    const { setEmail, setUsername } = useContext(UserContext);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: webClientId,
        redirectUri: AuthSession.makeRedirectUri(),
    });

    useEffect(() => {
        if (response?.type === 'success' && response.authentication) {
            const { accessToken } = response.authentication;
            handleUserAuthentication(accessToken);
        }
    }, [response]);

    async function handleUserAuthentication(token) {
        try {
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userInfo = await res.json();
            console.log(userInfo);
            setEmail(userInfo.email);
            navigation.navigate("SignUpScreen"); 
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user information. Please try again.');
            console.error('Failed to fetch user email:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Svg width="100%" height="100%" style={styles.svg}>
                <Defs>
                <RadialGradient
                    id="grad1"
                    cx="50%" cy="50%" r="50%" fx="50%" fy="50%" // Center of the gradient
                    gradientUnits="userSpaceOnUse">
                    <Stop offset="0%" stopColor="#5b5f61" />
                    <Stop offset="50%" stopColor="#5b5f61" />
                    <Stop offset="100%" stopColor="#2c3134" />
                </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad1)" />
            </Svg>

            <View style={styles.signin}>
                <Text style={styles.title}>Creatify</Text>
                <Button
                    title="Sign in with Google"
                    disabled={!request}
                    onPress={() => promptAsync()}
                    accessibilityLabel="Sign in with Google"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', 
    },
    signin: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: '3%',
        marginVertical: '10%',
        elevation: 3, 
        flex: 1,
        backgroundColor: '#FFFBF5',
    },
    title: {
        fontSize: 132,           
        fontWeight: 'bold',      
        textAlign: 'center',   
        color: '#ff6347 ',     
        textShadowColor: '#000', 
        textShadowOffset: { width: 1, height: 1 },
        marginBottom: 20,        
        letterSpacing: 1,        
        fontFamily: 'Verdana', 
      },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
  });