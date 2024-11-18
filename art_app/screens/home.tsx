import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from 'components/UserInfo';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Dimensions, Modal, Button, Platform } from 'react-native';
import { theme } from '../components/theme';
import { handleUploadScreen, handleLogout, viewUserProfile } from '../components/NavigationFunctions';

//example item type
interface Item {
  caption: string;
  img: string;
  user: string;
  datePosted: string;
}

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { email, setEmail, setUsername } = useContext(UserContext);
  const { width, height } = useWindowDimensions();
  const [webModalVisible, setWebModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(width > 768 ? 3 : 1)
  const [viewImg, setViewImg] = useState('');
  const [postId, setPostId] = useState(null)

  const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';
  const sapmle2 = 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  const itemData: Item[] = [
    {
      caption: 'A beautiful sunrise over the mountains',
      img: sampleImage,
      user: 'User1',
      datePosted: '2024-11-01',
    },
    {
      caption: 'Exploring the forest trails',
      img: sapmle2,
      user: 'User2',
      datePosted: '2024-11-02',
    },
    {
      caption: 'Chilling by the beach on a sunny day',
      img: sampleImage,
      user: 'User3',
      datePosted: '2024-11-03',
    },
    {
      caption: 'A cozy campfire evening',
      img: sapmle2,
      user: 'User4',
      datePosted: '2024-11-04',
    },
    {
      caption: 'Mountain biking adventure',
      img: sampleImage,
      user: 'User5',
      datePosted: '2024-11-05',
    },
    {
      caption: 'Exploring a hidden waterfall',
      img: sapmle2,
      user: 'User6',
      datePosted: '2024-11-06',
    },
  ];

  const postViewAction = ( img, act, postId) => {
    if (numColumns == 3){
      setPostId(postId);
      setViewImg(img);
      setWebModalVisible(true);
      console.log(viewImg);
    } else {
      if (act == 1) {
        setPostId(postId);
        setCommentModalVisible(true)
      }
      else {
        setViewImg(img);
        setImageModalVisible(true);
      }
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.postBox}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => viewUserProfile(navigation)}>
          <Text style={styles.info}>{item.user}</Text>
        </TouchableOpacity>

        <Text style={styles.info}>{item.datePosted}</Text>
      </View>

      <TouchableOpacity onPress={() => postViewAction(item.img, 2, 0)}>
        <Image source={{ uri: item.img }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.caption}>
          <Text style={styles.bold}>{item.caption}</Text>
        </Text>
        <TouchableOpacity style={styles.commentBtn} onPress={() => postViewAction(item.img, 1, 0)}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      {/* <View style={styles.container}>
        <Text>Welcome to the home screen!</Text>
        <Text>Email: {email}</Text>
        <Button title="Logout" onPress={() => handleLogout(AsyncStorage, setEmail, setUsername, Platform, navigation)} />
        <Button title="upload" onPress={() => handleUploadScreen(Platform ,navigation)} />
      </View> */}

      <View style={styles.container}>
        {itemData.length > 0 ? (
          <FlatList
            data={itemData}
            renderItem={renderItem}
            keyExtractor={(item) => item.datePosted}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          />
        ) : (
          <Text>No posts available</Text>
        )}
      </View>
      
      {/* Web view Comments/Image */}
      <Modal
        visible={webModalVisible}
        onRequestClose={() => {
          setWebModalVisible(false);
        }}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.row2}>
              <Image source={{ uri: viewImg }} style={styles.imageSideBySide} />
              <View style={styles.commentContainer}>
                <Text style={styles.modalText}>This is the comment section</Text>
                <TouchableOpacity onPress={() => setWebModalVisible(false)}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mobile view Image */}
      <Modal
        visible={imageModalVisible}
        onRequestClose={() => {
          setImageModalVisible(false);
        }}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setImageModalVisible(false)}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        
          <Image source={{ uri: viewImg }} style={styles.mobileimg} />
        </View>
      </Modal>

      {/* Mobile view Comments */}
      <Modal
        visible={commentModalVisible}
        onRequestClose={() => {
          setCommentModalVisible(false);
        }}
        animationType="slide"
        transparent={true}
      >
        {/* <View style={styles.overlay}> */}
          <View style={styles.mobileCommentContainer}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Comments</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            

          </View>
        {/* </View> */}
      </Modal>

      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "white",
    flex: 1,
    height: 'auto',
    width: width * 0.2,
  },
  mobileCommentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    maxHeight: '80%',
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  commentModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: theme.colors.background,
  },
  postBox: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageSideBySide: {
    width: width * 0.4,
    height: height * 0.8, 
    resizeMode: 'contain',
    marginRight: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  mobileimg: {
    width: width,
    height: height,
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center', 
    alignItems: 'center',
   }, 
  modalView: { 
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 35, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5, 
  }, 
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: { 
    marginBottom: 15, 
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: theme.colors.cap,
    fontWeight: '600',
  },
  image: {
    width: 'auto',
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  bold: {
    fontWeight: 'bold',
  },
  caption: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.tertiary,
    fontWeight: '400',
  },
  commentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  commentBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default Home;
