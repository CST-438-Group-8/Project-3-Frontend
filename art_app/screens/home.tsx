import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { UserContext } from '../components/UserInfo';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Dimensions, Modal, Button, Platform, ActivityIndicator } from 'react-native';
import { theme } from '../components/theme';
import { handleUploadScreen, handleLogout, viewUserProfile } from '../components/NavigationFunctions';
import WebComments from 'components/WebComments';
import MobileComments from 'components/MobileComments';
import axios from 'axios';

//example item type
interface Item {
  caption: string;
  img: string;
  user: string;
  datePosted: string;
}

const { width, height } = Dimensions.get("window");

const Home = ({ navigation }) => {
  const { email, setEmail, setUsername, user_id } = useContext(UserContext);
  const { width, height } = useWindowDimensions();
  const [webModalVisible, setWebModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(width > 768 ? 3 : 1)
  const [viewImg, setViewImg] = useState('');
  const [viewCaption, setCaption] = useState('');
  const [postUser, setPostUser] = useState('');
  const [postId, setPostId] = useState(null);
  const [load, setLoad] = useState(true);

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
  ];

  useEffect(() => {
    if(load){
      getPosts();
    }
  }, [])
  
  const getPosts = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/',
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setLoad(false);
    } catch(error) {
      console.log('Fetching Posts:',error);
      setLoad(false);
    }
  }
  
  const addComment = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/comments/addComment?comment={}&user_id={}&post_id={}
    const options = {
      method: 'POST',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/comments/addComment',
      params: {
        'comment':'',
        'user_id': user_id,
        'post_id': postId,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch(error) {
      console.log('Fetching Posts:',error);
    }
  }

  const getPostComments = async() => {
    // link
  }

  const postViewAction = (user, cap, img, act, postId) => {
    setCaption(cap);
    setViewImg(img);
    setPostId(postId);
    setPostUser(user);

    if (numColumns == 3){
      setWebModalVisible(true);
      console.log(viewImg);
    } else {
      if (act == 1) {
        setCommentModalVisible(true)
      }
      else {
        setImageModalVisible(true);
      }
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.postBox}>
      <View style={styles.row}>
        {/* <TouchableOpacity onPress={() => viewUserProfile(navigation)}> */}
          <Text style={styles.info}>{item.user}</Text>
        {/* </TouchableOpacity> */}

        <Text style={styles.info}>{item.datePosted}</Text>
      </View>

      <TouchableOpacity onPress={() => postViewAction(item.user, item.caption, item.img, 2, 0)}>
        <Image source={{ uri: item.img }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.caption}>
          <Text style={styles.bold}>{item.caption}</Text>
        </Text>
        <TouchableOpacity style={styles.commentBtn} onPress={() => postViewAction(item.user, item.caption, item.img, 1, 0)}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.container}>
      {load ? (
        <ActivityIndicator size="large" color="#f0f0f0" />
      ) : (
        itemData.length > 0 ? (
          <FlatList
            data={itemData}
            renderItem={renderItem}
            keyExtractor={(item) => item.datePosted}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          />
        ) : (
          <Text>No posts available</Text>
        )
      )}

      </View>
      
      {/* Web view Comments/Image */}
      <WebComments
        visible={webModalVisible}
        onClose={() => setWebModalVisible(false)}
        imageUrl={viewImg}
        caption={viewCaption}
        postUser={postUser}
        // comments={comments}
        // onAddComment={handleAddComment}
      />

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
      <MobileComments
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        caption={viewCaption}
        postUser={postUser}
        // comments={comments}
        // onAddComment={handleAddComment}
      />

      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
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
    elevation: 3, // Simplified shadow properties for Android/iOS compatibility
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
    resizeMode: 'contain',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  caption: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.tertiary,
    fontWeight: '400',
  },
  bold: {
    fontWeight: 'bold',
  },
  commentBtn: {
    padding: 10,
    borderRadius: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileimg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  info: {
    fontSize: 14,
    color: theme.colors.cap,
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    color: theme.colors.secondary,
    fontSize: 14,
    marginTop: 20,
  },
});

export default Home;
