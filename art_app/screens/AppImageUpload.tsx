import React, { useState, useContext } from 'react';
import { StyleSheet, View, Button, Image, Text, TextInput, ScrollView } from 'react-native';
import { UserContext } from '../components/UserInfo'; 

const AppImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imgurLink, setImgurLink] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const { userId } = useContext(UserContext); 

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      const link = await imgur_upload(file); // Upload image and get Imgur link
      if (link) {
        setImgurLink(link);
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
        return data.data.link;
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
    <ScrollView contentContainerStyle={styles.container}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Allow scrolling from the top
    paddingHorizontal: 20,
    paddingVertical: 20, // Add spacing for scroll content
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
    width: '100%', // Make the image width responsive
    height: undefined,
    aspectRatio: 1, // Maintain aspect ratio
    borderRadius: 10,
    borderColor: '#D1D5DB',
    borderWidth: 1,
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

export default AppImageUpload;
