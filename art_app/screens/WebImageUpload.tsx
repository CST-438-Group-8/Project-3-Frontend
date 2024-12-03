import React, { useState, useContext } from 'react';
import { StyleSheet, View, Button, Image, Text, TextInput } from 'react-native';
import { UserContext } from '../components/UserInfo'; // Assuming you have a UserContext for user data

const WebImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imgurLink, setImgurLink] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const { userId } = useContext(UserContext); // Replace with actual user context

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Set local preview
      const link = await imgur_upload(file); // Upload image and get Imgur link
      if (link) {
        setImgurLink(link); // Only set the link, do not save the post yet
      }
    }
  };
  
  const imgur_upload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      setUploadStatus('Uploading to Imgur...');
  
      const response = await fetch('https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/upload/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setUploadStatus('Upload successful!');
        return data.data.link; // Return the Imgur link
      } else {
        const error = await response.json();
        console.error('Imgur upload failed:', error);
        setUploadStatus('Imgur upload failed!');
        return null;
      }
    } catch (error) {
      console.error('Error during Imgur upload:', error);
      setUploadStatus('Imgur upload failed!');
      return null;
    }
  };
  
  // Triggered only by the "Create Post" button
  const saveToDatabase = async () => {
    if (!imgurLink) {
      setUploadStatus('Please upload an image first.');
      return;
    }
    if (!caption.trim()) {
      setUploadStatus('Please enter a caption.');
      return;
    }
  
    try {
      setUploadStatus('Saving to database...');
  
      const response = await fetch(
        `https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/createPost/?user_id=${userId}&image=${encodeURIComponent(
          imgurLink
        )}&caption=${encodeURIComponent(caption)}`,
        { method: 'POST' }
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log('Post saved successfully:', data);
        setUploadStatus('Post saved successfully!');
      } else {
        const error = await response.json();
        console.error('Failed to save post:', error);
        setUploadStatus('Failed to save post!');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      setUploadStatus('Failed to save post!');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload an Image</Text>
      <View style={styles.separator} />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={styles.input}
      />
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <TextInput
        style={styles.textInput}
        placeholder="Enter a caption..."
        value={caption}
        onChangeText={setCaption}
      />
      {imgurLink && (
        <Button title="Create Post" onPress={saveToDatabase} />
      )}
      {uploadStatus && <Text>{uploadStatus}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#D1D5DB',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    fontSize: 16,
    padding: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 5,
    width: '80%',
  },
  image: {
    marginTop: 20,
    width: 400,
    height: 400,
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    objectFit: 'contain',
  },
  textInput: {
    marginTop: 20,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: '80%',
  },
});

export default WebImageUpload;
