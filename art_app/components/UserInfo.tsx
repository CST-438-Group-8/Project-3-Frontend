import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

function UserInfo({ children }) {
  const [userId, setUserId] = useState<number>(-1);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [viewingUser, setViewingUser] = useState<number>(-1);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedViewingUser = await AsyncStorage.getItem('viewingUser');

        if (storedUserId) setUserId(Number(storedUserId));
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
        if (storedViewingUser) setViewingUser(Number(storedViewingUser));
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem('userId', String(userId));
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('viewingUser', String(viewingUser));
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    };
    saveUserData();
  }, [userId, username, email, viewingUser]);

  const value = {
    userId, setUserId,
    username, setUsername,
    email, setEmail,
    viewingUser, setViewingUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export {UserContext, UserInfo};