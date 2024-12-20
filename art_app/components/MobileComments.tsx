import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, GestureResponderEvent, ActivityIndicator } from 'react-native';

interface MobileCommentsProps {
    visible: boolean;
    onClose: (event?: GestureResponderEvent) => void;
    caption: string;
    postUser: string;
    comments: string[];
    onAddComment: (comment: string) => Promise<void>;
    onLoadComments: () => Promise<void>;
}

const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';

const MobileComments: React.FC<MobileCommentsProps> = ({ visible, onClose, postUser, caption, comments, onAddComment, onLoadComments }) => {
    const [newComment, setNewComment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [load, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (visible) {
            try {
                onLoadComments();
            } catch(error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoading(false)
            }
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

    const renderComments = ({item}) => (
        <Text style={styles.commentText}>
            <Text style={styles.bold}>{item.username ? item.username: "anonymous" }</Text>: {item.comment}
        </Text>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalContent}
                >
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    <View style={styles.commentSection}>
                        <Text style={styles.commentTitle}>Comments</Text>
                        <Text style={styles.commentText}>
                            <Text style={styles.bold}>{postUser ? postUser: "anonymous" }</Text>: {caption}
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
                            <Text style={styles.submitButtonText}>{isSubmitting ? 'Submitting...' : 'Submit'}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 15,
        borderRadius: 50,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    commentSection: {
        flex: 1,
        padding: 15,
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
    },
    commentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    emptyState: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
        fontSize: 14,
    },
    commentContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
        elevation: 1,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    commentBox: {
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlignVertical: 'top',
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
    bold: {
        fontWeight: 'bold',
    },
});

export default MobileComments;