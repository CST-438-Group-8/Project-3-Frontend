import React, { useState, useEffect , useContext} from 'react';
import { Modal, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, GestureResponderEvent, ActivityIndicator } from 'react-native';
import { theme } from '../components/theme';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../components/UserInfo';
interface WebCommentsProps {
    visible: boolean;
    onClose: (event?: GestureResponderEvent) => void;
    imageUrl: string;
    postUser: string;
    postUser_id: number;
    caption: string;
    comments: string[];
    onAddComment: (comment: string) => Promise<void>;
    onLoadComments: () => Promise<void>;
    onDelComment: (comment_id: number) => Promise<void>;
    onEditComment: (comment_id: number) => Promise<void>;
}

const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';
const WebComments: React.FC<WebCommentsProps> = ({ visible, onClose, postUser_id, imageUrl, postUser , caption, comments, onAddComment, onLoadComments, onDelComment, onEditComment}) => {
    const [newComment, setNewComment] = useState<string>('');
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null); 
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [load, setLoading] = useState<boolean>(true);
    const { email, setEmail, setUsername, userId, setViewingUser,setUserId } = useContext(UserContext);
    useEffect(() => {
        if (visible) {
            try {
                onLoadComments();
                console.log("Comments: " + comments);
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoading(false); // Set loading state after fetch attempt
            }
            console.log("THIS WHAT U NEED TO SEE MAN");
            console.log(userId);
            console.log(postUser_id);
        }
    }, [visible]);

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
            await onDelComment(commentId);
            await onLoadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

        
    // const handleEditComment = async (commentId: number) => {
    //     if (!newComment.trim()) return; 
    //     setIsSubmitting(true);
    //     try {
    //         await onEditComment(commentId); //change
    //         // setNewComment('');
    //         await onLoadComments();
    //     } catch (error) {
    //         console.error('Error updating comment:', error);
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };
    



//right here

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
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown(index)} 
                >
                    <Text style={styles.dropdownButtonText}>☰</Text>
                </TouchableOpacity>
            )}
            {activeDropdown === index && ( 
                <View style={styles.dropdown}>
                    <TouchableOpacity
                        key={1}
                        style={styles.dropdownItem}
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

    const renderCaption = ({item}) => (
        <Text style={styles.captionText}>
            <Text style={styles.bold}>{item.username ? item.username: "anonymous" }</Text>: {item.comment}
        </Text>
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
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.imageSection}>
                        <Image source={{ uri: imageUrl ? imageUrl : sampleImage }}  style={styles.image} />
                    </View>

                    <View style={styles.commentSection}>
                        <Text style={styles.captionTitle}>Caption</Text>

                        <Text style={styles.captionText}>
                            <Text style={styles.bold}>{postUser ? postUser: "anonymous" }</Text>: {caption}
                        </Text>
                        <Text style={[styles.bold, { margin: 10 }]}></Text>

                        <Text style={styles.commentTitle}>Comments</Text>

                        <Text style={styles.commentText}>
                
                        </Text>

                        

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
                            <Text style={styles.submitButtonText}> {isSubmitting ? 'Submitting...' : 'Submit'} </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        width: '90%', // 90% of the screen width
        height: '90%', // 90% of the screen height
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
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
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
        height: 60, // Height for approximately two lines of text
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10, // Horizontal padding for text
        paddingVertical: 5, // Adjusted vertical padding for proper alignment
        textAlignVertical: 'top', // Keeps the text aligned at the top
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
    delButton: {
        // backgroundColor: '#2196F3',
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 2,
        alignItems: 'center',
    },
    delButtonText: {
        color: 'red',
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
    dropdownButtonText: {
        color: 'red',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dropdownButton: {
        color: 'red',
        position: 'absolute',
        top: 0,
        left: -15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 2,
        borderRadius: 2,
        zIndex: 2,
    },
    optionSection: {
        // width: '50%',
        alignItems: 'center',
        // padding: 10,
        // backgroundColor: theme.colors.primary,
    },
    dropdown: {
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
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});  

export default WebComments;
