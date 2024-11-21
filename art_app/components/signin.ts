import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { UserContext } from '../components/UserInfo';
import React, { useContext, useState } from 'react';

export const signIn = async (setEmail, navigation) => {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (response.data?.user.email) {
            setEmail(response.data?.user.email);
            console.log(response.data?.user.email);
            navigation.navigate('SignUpScreen');
        } else {
        console.error("Sign in was cancelled by user");
        }
    } catch (error) {
        if (error.code) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                console.error("Operation (e.g., sign in) already in progress");
                break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                console.error("Android only, Play Services not available or outdated");
                break;
                default:
                    console.error("Some other error occurred", error);
            }
        } else {
        console.error("An error unrelated to Google Sign-In occurred", error);
        }
    }
};
