import React, { useState, useContext } from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Button, Modal, Dimensions, Platform,} from 'react-native';
import { UserContext } from '../components/UserInfo';
import { theme } from '../components/theme';
import Toast from 'react-native-toast-message';
import { handleUploadScreen } from '../components/NavigationFunctions';

const { width } = Dimensions.get('window');

export default function TabOneScreen({ navigation }) {
  const { email, username } = useContext(UserContext);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [viewImg, setViewImg] = useState('');

  const samplePosts = [
    { id: '1', img: 'https://i.pinimg.com/736x/a9/ce/58/a9ce582aa9af058f46f4d68a2f82d2db.jpg' },
    { id: '2', img: 'https://wallpapers.com/images/hd/beautiful-amazing-oc3t2l6g6fahorhm.jpg' },
    { id: '3', img: 'https://wallpapers.com/images/high/harry-potter-halloween-1920-x-1080-3d939fixt9dskr2q.webp' },
    { id: '4', img: 'https://wallpapers.com/images/high/back-of-white-jdm-car-g0f7uwy6478rkox0.webp' },
    { id: '5', img: 'https://wallpapers.com/images/high/traditional-japanese-art-5ct3ftw11yj6nmxb.webp' },
    { id: '6', img: 'https://wallpapers.com/images/high/thorough-forest-city-2e3rc39qh4luus2m.webp' },
  ];
  const sampleImg = 'https://i.pinimg.com/originals/08/4a/92/084a925dd6a5cc7c47ea3b916efcd259.gif'
  const profileData = {
    profilePicture: sampleImg,
    posts: 42,
    followers: 1200,
    following: 180,
  };

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
          <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>
      </View>


      <FlatList
        data={samplePosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.postsGrid}
      />

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
    color: '#888', // Lighter color for email
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
