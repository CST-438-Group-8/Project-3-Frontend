import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react';
import Toast from 'react-native-toast-message';
import { UserContext }  from '../components/UserProvider';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Modal, Button } from 'react-native';

// Define the interface for the example item type
interface Item {
  caption: string;
  img: string;
  user: string;
  datePosted: string;
}

// Sample image URL to be used for each item
const sampleImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=2048x2048&w=is&k=20&c=CJLIU6nIISsrHLTVO04nxIH2zVaKbnUeUXp7PnpM2h4=';

const itemData: Item[] = [
  {
    caption: 'A beautiful sunrise over the mountains',
    img: sampleImage,
    user: 'User1',
    datePosted: '2024-11-01',
  },
  {
    caption: 'Exploring the forest trails',
    img: sampleImage,
    user: 'User2',
    datePosted: '2024-11-02',
  },
  {
    caption: 'Chilling by the beach on a sunny day',
    img: sampleImage,
    user: 'User3',
    datePosted: '2024-11-03',
  },
  {
    caption: 'A cozy campfire evening',
    img: sampleImage,
    user: 'User4',
    datePosted: '2024-11-04',
  },
  {
    caption: 'Mountain biking adventure',
    img: sampleImage,
    user: 'User5',
    datePosted: '2024-11-05',
  },
  {
    caption: 'Exploring a hidden waterfall',
    img: sampleImage,
    user: 'User6',
    datePosted: '2024-11-06',
  },
];

const Home = ({ navigation }) => {
  // const { userId, username, ViewUser} = useContext(UserContext);
  const { width } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const numColumns = width > 768 ? 3 : 1;

  const renderItem = ({ item }) => (
    <View style={styles.postBox}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => viewUserProfile()}>
          <Text style={styles.info}>{item.user}</Text>
        </TouchableOpacity>

        <Text style={styles.info}>{item.datePosted}</Text>
      </View>

      <Image source={{ uri: item.img }} style={styles.image} />

      <View style={styles.row}>
        <Text style={styles.caption}>
          <Text style={styles.bold}>{item.user}: </Text>
          {item.caption}
        </Text>
        <TouchableOpacity style={styles.commentBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const viewUserProfile = () => {
    // setViewingUser(user);
    navigation.navigate('ViewUser');
  };

  return (
    <View style={styles.container}>

      {itemData.length > 0 ? (
        <FlatList
          data={itemData}
          renderItem={renderItem}
          keyExtractor={(item) => item.datePosted}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
        />
      ) : (
        <Text>No posts available</Text>
      )}

      <Modal
        visible={modalVisible}
        onRequestClose={() => { 
          setModalVisible(false);
        }}
        animationType='fade'
        transparent={true}
        >
          <View style={styles.overlay}> 
            <View style={styles.modalView}> 
              <Text style={styles.modalText}>Hello, I am a modal!</Text> 
              <Button title="Close" onPress={() => setModalVisible(false)} /> 

            </View>
          </View>
        </Modal>

      <Toast/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#f2f2f2',
  },
  postBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background 
    justifyContent: 'center', 
    alignItems: 'center',
   }, 
  modalView: { 
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 35, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2, },
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5, 
  }, 
    modalText: { 
      marginBottom: 15, 
      textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  caption: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  commentBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  commentBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default Home;
