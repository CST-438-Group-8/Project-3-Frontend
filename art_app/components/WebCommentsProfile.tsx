import React, { useContext, useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { theme } from './theme';
import { UserContext } from '../components/UserInfo';
import TextEdit from '../components/TextEdit';
import axios from 'axios';

interface WebCommentsProps {
    visible: boolean;
    onClose: (event?: GestureResponderEvent) => void;
    imageUrl: string;
    postUser: string;
    postUsername: string;
    postUser_id: number;
    caption: string;
    comments: string[];
    post_id: string;
    onAddComment: (comment: string) => Promise<void>;
    onLoadComments: () => Promise<void>;
    onDelComment: (comment_id: number) => Promise<void>;
    onChange: () => void;
    update: () => Promise<void>;
}

const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';

const WebCommentsProfile: React.FC<WebCommentsProps> = ({ visible, onClose, imageUrl, postUser, postUsername, caption, comments, post_id, postUser_id, onAddComment, onLoadComments, onChange, update ,onDelComment}) => {
    // const { email, username, userId } = useContext(UserContext);
    const { email, setEmail, setUsername, userId, setViewingUser,setUserId } = useContext(UserContext);
    const [newComment, setNewComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [load, setLoading] = useState<boolean>(true);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null); 
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editId, setEditId] = useState('');
    const [editCaption, setEditCaption] = useState('');

    useEffect(() => {
        if (visible) {
            try {
                onLoadComments();
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoading(false);
            }
        }
    }, [visible]);

    const editPost = async(caption : string, id : string) => {
        console.log(caption, id);
        const options = {
            method: 'PATCH',
            url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/editPost/',
            data: {
                post_id: id,
                caption: caption,
            }
        };
    
        try {
            const response = await axios.request(options);
            console.log(response.data);
            setDropdownVisible(false);
            await update();
            onChange();
        } catch(error) {
            console.log('Comment Error:', error);
        }
    }

    const deletePost = async(id : string) => {
        const options = {
            method: 'DELETE',
            url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/deletePost/',
            data: {
                post_id: id,
            }
        }
        try {
            const response = await axios.request(options);
            setDropdownVisible(false);
            await update();
            onChange();
            console.log(response.data);
        } catch(error) {
            console.log('Comment Error:',error);
        }
    }

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
            setIsSubmitting(true);
        try {
            await onAddComment(newComment.trim());
            setNewComment('');
            await onLoadComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        setIsSubmitting(true);
        console.log(commentId);
        try {
            await delComment(commentId);
            await onLoadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = () => {
        setEditModalVisible(true);
    }

    const editAction = (caption : string, id : string) => {
        setEditCaption(caption);
        setEditId(id);
        openEditModal();
    }

     const delComment = async(comment_id) => {
    const options = {
      method: 'DELETE',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/comments/delComment',
      data: {
        comment_id : comment_id,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch(error) {
      console.log('Comment Deletion Error:',error);
    }
  };
  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index)); // Toggle dropdown
};

const renderComments = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.commentContainer}>
        <Text style={styles.commentText}>
            <Text style={styles.bold}>{item.username ? item.username : "anonymous"}</Text>: {item.comment}
        </Text>

        <View style={styles.optionSection}>
            {/* {userId === postUser_id && ( */}
            {/* {userId === item.user_id || userId === postUser_id && ( */}
            {(userId === item.user_id || userId === postUser_id) && (
                <TouchableOpacity
                    style={styles.dropdownButtonComment}
                    onPress={() => toggleDropdown(index)} 
                >
                    <Text style={styles.dropdownButtonTextComment}>☰</Text>
                </TouchableOpacity>
            )}
            {activeDropdown === index && ( 
                <View style={styles.dropdownComments}>
                    <TouchableOpacity
                        key={1}
                        style={styles.dropdownItemComment}
                        // onPress={() => handleEditComment(item.comment_id)}
                        onPress={() => handleDeleteComment(item.comment_id)}
                        // onPress={handleDeleteComment}
                    >
                        {/* <Text>{'Edit'}</Text> */}
                        <Text>{'Delete'}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        key={2}
                        style={styles.dropdownItem}
                        // onPress={handleDeleteComment(item.id)}
                        onPress={() => handleDeleteComment(item.comment_id)}
                    >
                        <Text>{'Delete'}</Text>
                    </TouchableOpacity> */}
                </View>
            )}
        </View>
        
    </View>
);
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {onClose(), setDropdownVisible(false)}}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.imageSection}>
                        { userId === postUser && (
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setDropdownVisible(!dropdownVisible)}
                            >
                                <Text style={styles.dropdownButtonText}>☰</Text>
                            </TouchableOpacity>
                        )}
                        {dropdownVisible && (
                        <View style={styles.dropdown}>
                            <TouchableOpacity
                                key={1}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    editAction(caption, post_id); 
                                    update();
                                }}
                            >
                                <Text style={styles.dropdownItemText}>{'Edit'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={2}
                                style={styles.dropdownItem}
                                onPress={() => deletePost(post_id)}
                            >
                                <Text style={styles.dropdownItemText}>{'Delete'}</Text>
                            </TouchableOpacity>
                        </View>
                        )}
                        <Image
                            source={{ uri: imageUrl ? imageUrl: sampleImage }}
                            style={styles.image}
                        />
                    </View>

                    <View style={styles.commentSection}>
                        <Text style={styles.captionTitle}>Caption</Text>
                        <Text style={styles.captionText}>
                            <Text style={styles.bold}>{ postUsername || 'anonymous'}</Text>: {caption}
                        </Text>
                        <Text style={[styles.bold, { margin: 10 }]}></Text>

                        <Text style={styles.commentTitle}>Comments</Text>
                        {load ? (
                        <ActivityIndicator size="large" color="#0f0f0f" />
                        ) : (
                            <FlatList
                            data={comments}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderComments}
                        />
                        )}

                        <TextInput
                            style={styles.commentBox}
                            placeholder="Write your comment here..."
                            multiline={true}
                            numberOfLines={2}
                            value={newComment}
                            onChangeText={(text) => setNewComment(text)}
                        />

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isSubmitting && { backgroundColor: '#bbb' },
                            ]}
                            onPress={handleAddComment}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TextEdit
                    visible={editModalVisible}
                    onClose={() => {setEditModalVisible(false), setDropdownVisible(false)}}
                    caption={editCaption}
                    id={editId}
                    onEditComment={async (caption, id) => {
                        await editPost(caption, id);
                    }}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flexDirection: 'row',
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
    },
    imageSection: {
        width: '50%',
        alignItems: 'center',
        padding: 10,
        backgroundColor: theme.colors.primary,
    },
    dropdownButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
        zIndex: 2,
    },
    dropdownButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dropdown: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 2,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    caption: {
        marginTop: 10,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    commentSection: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
    },
    commentTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    captionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    comment: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    commentBox: {
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlignVertical: 'top',
        marginBottom: 10,
    },    
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    captionText: {
        fontSize: 14,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    closeButton: {
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: 10,
            borderRadius: 50,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
    },
    commentContainer:{
        // position : 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        // justifyContent: 'flex-start',
        alignItems: 'center',
    },
    optionSection: {
        // width: '50%',
        alignItems: 'center',
        // padding: 10,
        // backgroundColor: theme.colors.primary,
    },
    dropdownButtonComment: {
        color: 'red',
        position: 'absolute',
        top: 0,
        left: -15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 2,
        borderRadius: 2,
        zIndex: 2,
    },
    dropdownComments: {
        position: 'absolute',
        top: 0,
        left: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
        zIndex: 2,
    },
    dropdownItemComment: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownButtonTextComment: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
    },
});  

export default WebCommentsProfile;