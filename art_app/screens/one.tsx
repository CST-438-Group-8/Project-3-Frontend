import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../components/UserInfo';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import ProfileRender from '../components/ProfileRender'

export default function TabOneScreen({ navigation }) {
  const { email, username, userId } = useContext(UserContext);
  const [posts, SetPosts] = useState([]);
  const [load, setLoad] = useState(true);
  const [reload, setReload] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused || reload) {
      console.log('Screen is focused');
      setLoad(true);
      setReload(false);
      getPosts();
    }
  }, [isFocused, reload]);

  const reloadScreen = async() => {
    console.log('reload');
    setReload(true);
  }
  
  const getPosts = async() => {
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/getUserPosts/',
      params: {
        'user_id':userId,
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data.Posts);
      SetPosts(response.data.Posts);
      setLoad(false);
    } catch(error) {
      console.log('Fetching User Posts:',error);
      setLoad(false);
    }
  }

  return (
    <ProfileRender
      viewing={false}
      load={load}
      posts={posts}
      username={username}
      email={email}
      userId={userId}
      handleUpdate={reloadScreen}
    />
  );
}