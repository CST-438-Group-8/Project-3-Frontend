import React, { useState, useEffect } from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Dimensions, ActivityIndicator} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../components/theme';
import WebComments from '../components/WebComments';
import MobileComments from '../components/MobileComments';
import { useNavigation } from '@react-navigation/native';

interface ProfileRenderProps {
    viewing: boolean;
    load: boolean;
    posts: any[];
    username: string;
    email: string;
    userId: number;
}

const {width} = Dimensions.get("window");;

const ProfileRender: React.FC<ProfileRenderProps> = ({viewing, load, posts, username, email, userId}) => {
    const [viewImg, setViewImg] = useState('');
    const sampleImg = 'https://i.pinimg.com/originals/08/4a/92/084a925dd6a5cc7c47ea3b916efcd259.gif'
    const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';
    const [webModalVisible, setWebModalVisible] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [postInfo, setPostInfo] = useState([]);
    const [postId, setPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const navigation = useNavigation();

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
        // https://group8-project3-09c9182c5047.herokuapp.com/comments/userComments?post_id={}
        const options = {
            method: 'GET',
            url: 'https://group8-project3-09c9182c5047.herokuapp.com/comments/userComments',
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
    
        if (width > 768){
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

    const openImageModal = (img) => {
        setViewImg(img);
        setImageModalVisible(true);
      };
    
    const renderPost = ({ item }) => (
        <TouchableOpacity onPress={() => postViewAction(2, item)}>
            <Image source={{ uri: item.image ? item.image : sampleImage }} style={styles.postImage} resizeMode="cover" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                { viewing? (
                    <TouchableOpacity style={styles.returnBtn} onPress={() => navigation.navigate("DrawerNavigator", {screen: "Home"})}>
                        <Ionicons name="arrow-back-sharp" size={20} color="#fff" />
                    </TouchableOpacity>
                ):(
                    <Text></Text>
                )
                }

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
                posts.length > 0 ? (
                    <FlatList
                        data={posts}
                        renderItem={renderPost}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.postsGrid}
                    />
                ) : (
                    <Text>No posts available</Text>
                )
            )}
    
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
        marginRight: 5,
    },
    postImage: {
        width: (width - 20) / 3,
        height: (width - 20) / 3,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 1)',
        justifyContent: 'center',
        alignItems: 'center',
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
    mobileimg: {
        width: '95%',
        height: '85%',
        resizeMode: 'contain',
    },
    commentBtn: {
        padding: 10,
        borderRadius: 20,
    },
    returnBtn: {
        position: 'absolute',
        top: 20,
        left: 5,
        zIndex: 10,
        padding: 10,
    }
});

export default ProfileRender;