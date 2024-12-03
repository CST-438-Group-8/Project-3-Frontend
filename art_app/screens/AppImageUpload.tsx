import React, { useState, useContext } from 'react';
import { View, Button, Image, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { UserContext } from '../components/UserInfo';

const AppImageUpload: React.FC = () => {
  const { userId } = useContext(UserContext);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'Images', allowsEditing: true, quality: 1, });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadToImgur = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    let retries = 3;
    let delay = 2000;

    while (retries > 0) {
      try {
        const response = await axios.post('https://api.imgur.com/3/image', formData, {
          headers: {
            Authorization: 'Client-ID 114b305e3677bf6',
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.data.link;
      } catch (error) {
        if (error.response?.status === 429 && retries > 0) {
          console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries--;
          delay *= 2;
        } else {
          console.error('Imgur Upload Error:', error.response?.data || error.message);
          throw error;
        }
      }
    }

    throw new Error('Failed to upload after multiple tries');
  };

  const createPost = async () => {
    if (!image || !caption) {
      Alert.alert('Error', 'Please select an image and provide a caption.');
      return;
    }

    setLoading(true);
    try {
      console.log('Uploading image...');
      const imgurLink = await uploadToImgur(image);
      console.log('Imgur link:', imgurLink);

      const response = await axios.post(
        `https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/createPost/`,
        null,
        {
          params: {
            user_id: userId,
            image: imgurLink,
            caption: caption,
          },
        }
      );

      console.log('Post created:', response.data);

      setLoading(false);
      Alert.alert('Success', 'Post created successfully!');
      setImage(null);
      setCaption('');
    } catch (error) {
      setLoading(false);
      console.error('Create Post Error:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Enter a caption"
        value={caption}
        onChangeText={setCaption}
      />
      <Button title="Create Post" onPress={createPost} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: 200, height: 200, marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 8,
  },
});

export default AppImageUpload;
