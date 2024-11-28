import React, { useContext, useState } from 'react';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { StyleSheet, Text, View, Platform, Image} from 'react-native';
import { signIn } from '../components/signin';
import { UserContext } from '../components/UserInfo';

const webClientId = '763302642477-t7v8ppah1lfcbkfu4kmdj59fv06aig0t.apps.googleusercontent.com';
const AndroidClientId = '763302642477-2i0f9s1o4882a9tj1b4e3v7ng7cvvojs.apps.googleusercontent.com';
const iosWebClientId = '763302642477-dh5ocljskbjomeb5jlouo5jeq87qlv80.apps.googleusercontent.com';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: webClientId,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    offlineAccess: true,
    forceCodeForRefreshToken: true,
    iosClientId: iosWebClientId,
});

export default function SplashScreen({navigation}) {
    const { setEmail } = useContext(UserContext);

    return (
        <View style={styles.container}>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={() => signIn(setEmail, navigation)}
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
