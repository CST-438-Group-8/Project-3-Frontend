import { useContext } from 'react';
import { UserContext } from '../components/UserInfo';

export const handleLogout = async (AsyncStorage, setEmail, setUsername, Platform, navigation) => {
  await AsyncStorage.removeItem('userToken');
  setEmail('');
  setUsername('');
    
  if (Platform.OS === 'web') {
    localStorage.removeItem('userToken'); // Clear token from localStorage
    navigation.navigate('WebSplashScreen');
  } else {
    navigation.navigate('SplashScreen');
  }
}

export const handleUploadScreen = (Platform ,navigation) => {
  if (Platform.OS === 'web') {
    navigation.navigate('WebImageUpload');
  } else {
    navigation.navigate('AppImageUpload');
  }
}

export const viewUserProfile = (navigation, user_id, setViewingUser, userId) => {
  if (user_id == userId){
    navigation.navigate("DrawerNavigator", {screen: "Profile"});
  } else {
    setViewingUser(user_id);
    navigation.navigate('ViewUser');
  }
}