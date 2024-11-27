import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, GestureResponderEvent } from 'react-native';
import { theme } from '../components/theme';

interface WebCommentsProps {
    visible: boolean;
    onClose: (event?: GestureResponderEvent) => void;
    imageUrl: string;
    caption: string;
    comments: string[];
    onAddComment: (comment: string) => Promise<void>;
}

const WebComments: React.FC<WebCommentsProps> = ({ visible, onClose, imageUrl, postUser , caption, comments, onAddComment }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleAddComment = async () => {
        if (!newComment.trim()) return; 
            setIsSubmitting(true);
        try {
            await onAddComment(newComment.trim());
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>

                    <View style={styles.commentSection}>

                        <Text style={styles.commentTitle}>Comments</Text>
                        <Text>
                            <Text style={styles.bold}>{postUser}</Text>: {caption}
                        </Text>

                        <FlatList
                            data={comments}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                // <Text style={styles.comment}>
                                //     <Text style={styles.bold}>username: </Text>{item}
                                // </Text>
                                <Text style={styles.comment}>
                                    {item}
                                </Text>
                            )}
                        />

                        {/* Add New Comment */}
                        <TextInput
                            style={styles.commentBox}
                            placeholder="Write your comment here..."
                            multiline={true}
                            numberOfLines={2} // Restrict to two visible lines
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
});  

export default WebComments;
