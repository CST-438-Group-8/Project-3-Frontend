import React, { useState } from 'react';
import { StyleSheet, View, Button, Image, Text } from 'react-native';

const WebImageUpload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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
      {image && 
      <Image 
      source={{ uri: image }} 
      style={styles.image}
      resizeMode="contain"
      />}
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
});

export default WebImageUpload;