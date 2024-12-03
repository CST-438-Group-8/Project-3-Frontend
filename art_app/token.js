import axios from 'axios';

const IMGUR_CLIENT_ID = '114b305e3677bf6'; 

const uploadImageToImgur = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust based on your image type
      name: 'uploaded_image.jpg',
    });

    const response = await axios.post('https://api.imgur.com/3/upload', formData, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Image uploaded:', response.data);
    return response.data.data.link; // Return the image link
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    throw error;
  }
};
