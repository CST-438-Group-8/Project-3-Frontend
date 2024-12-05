import { Ionicons } from '@expo/vector-icons';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../components/UserInfo';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Modal, ActivityIndicator } from 'react-native';
import { theme } from '../components/theme';
import { viewUserProfile } from '../components/NavigationFunctions';
import WebComments from '../components/WebComments';
import MobileComments from '../components/MobileComments';
import axios from 'axios';

const Home = ({ navigation }) => {
  const { email, setEmail, setUsername, userId, setViewingUser } = useContext(UserContext);
  const { width } = useWindowDimensions();
  const [webModalVisible, setWebModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(width > 768 ? 3 : 1)
  const [postInfo, setPostInfo] = useState([]);
  const [postId, setPostId] = useState(null);
  const [load, setLoad] = useState(true);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';

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
      setPosts(response.data);
      setLoad(false);
    } catch(error) {
      console.log('Fetching Posts:',error);
      setLoad(false);
    }
  }
  
  const addComment = async(comment) => {
    // https://group8-project3-09c9182c5047.herokuapp.com/comments/addComment?comment={}&user_id={}&post_id={}
    const options = {
      method: 'POST',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/comments/addComment',
      data: {
        comment: comment,
        user_id: userId,
        post_id: postId,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch(error) {
      console.log('Comment Error:',error);
    }
  }

  const getPostComments = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/comments/Comments/?post_id={}
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/comments/Comments/',
      params: {
        'post_id': postId,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setComments(response.data);
    } catch(error) {
      console.log('Comments Error:',error);
    }
  }

  const postViewAction = (act, postInfo) => {
    setPostInfo(postInfo);
    setComments([]);
    setPostId(postInfo.post_id);

    if (numColumns == 3){
      setWebModalVisible(true);
    } else {
      if (act == 1) {
        setImageModalVisible(true);
        setCommentModalVisible(true);
      }
      else {
        setImageModalVisible(true);
      }
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.postBox}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => viewUserProfile(navigation, item.user_id, setViewingUser, userId)}>
          <Text style={styles.info}>{item.username ? item.username: "anonymous" }</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity onPress={() => postViewAction(2, item)}>
        <Image source={{ uri: item.image ? item.image : sampleImage }} style={styles.image}/>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.caption}>
          <Text style={styles.bold}>{item.caption}</Text>
        </Text>
        <TouchableOpacity style={styles.commentBtn} onPress={() => postViewAction(1, item)}>
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
        posts.length > 0 ? (
          <FlatList
            data={posts}
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
        imageUrl={postInfo.image}
        caption={postInfo.caption}
        postUser={postInfo.username}
        comments={comments}
        onAddComment={addComment}
        onLoadComments={getPostComments}
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
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: postInfo.image ? postInfo.image : sampleImage }} style={styles.mobileimg} />
          <TouchableOpacity style={styles.commentBtn} onPress={() => postViewAction(1, postInfo)}>
            <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Mobile view Comments */}
      <MobileComments
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        caption={postInfo.caption}
        postUser={postInfo.username}
        comments={comments}
        onAddComment={addComment}
        onLoadComments={getPostComments}
      />
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
    backgroundColor: 'rgba(0, 0, 0, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileimg: {
    width: '95%',
    height: '85%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
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
});

export default Home;
