import React, { useState, useContext, useEffect} from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, Modal, Dimensions, Platform, ActivityIndicator} from 'react-native';
import { UserContext } from '../components/UserInfo';
import { theme } from '../components/theme';
import Toast from 'react-native-toast-message';
import { handleUploadScreen } from '../components/NavigationFunctions';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function TabOneScreen({ navigation }) {
  const { email, username, userId } = useContext(UserContext);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [viewImg, setViewImg] = useState('');
  const sampleImg = 'https://i.pinimg.com/originals/08/4a/92/084a925dd6a5cc7c47ea3b916efcd259.gif'
  const [posts, SetPosts] = useState([]);
  const [load, setLoad] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('Screen is focused');
      setLoad(true);
      getPosts();
    }
  }, [isFocused]);
  // useEffect(() => {
  //   const isFocused = useIsFocused();
  
  //   if (isFocused) {
  //     setLoad(true);
  //     getPosts();
  //   }
  // }, [useIsFocused]);
  
  const getPosts = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/getUserPosts/?user_id={}
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/getUserPosts/',
      params: {
        'user_id':userId,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data.Posts);
      SetPosts(response.data.Posts);
      setLoad(false);
    } catch(error) {
      console.log('Fetching User Posts:',error);
      setLoad(false);
    }
  }

  const openImageModal = (img) => {
    setViewImg(img);
    setImageModalVisible(true);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity onPress={() => openImageModal(item.img)}>
      <Image source={{ uri: item.img }} style={styles.postImage} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.row}>
          <Image source={{ uri: sampleImg }} style={styles.profilePicture} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>

      {load ? (
        <ActivityIndicator size="large" color="#f0f0f0" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.postsGrid}
        />
      )}

      <View style={styles.welcomeSection}>
        <Button title="Upload" onPress={() => handleUploadScreen(Platform, navigation)} />
      </View>

      <Modal
        visible={imageModalVisible}
        transparent
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.closeModal} onPress={() => setImageModalVisible(false)}>
            <Text style={styles.closeModalText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: viewImg }} style={styles.modalImage} />
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  welcomeSection: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  profileInfo: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.cap,
  },
  email: {
    fontSize: 14,
    color: '#888', 
    marginTop: 4,
  },
  postsGrid: {
    marginHorizontal: 5,
  },
  postImage: {
    width: (width - 20) / 3,
    height: (width - 20) / 3,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeModal: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  closeModalText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
