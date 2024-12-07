import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../components/UserInfo';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import ProfileRender from '../components/ProfileRender'

export default function TabOneScreen({ navigation }) {
  const { viewingUser, userId } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState([]);
  const [posts, SetPosts] = useState([]);
  const [load, setLoad] = useState(true);
  const [loadScreen, setLoadScreen] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('Screen is focused');
      setLoadScreen(true);
      getInfo();
      setLoad(true);
      getPosts();
    }
  }, [isFocused]);

  const getInfo = async() => {
    // http://group8-project3-09c9182c5047.herokuapp.com/user/users/{user_id}/
    const options = {
      method: 'GET',
      url: `http://group8-project3-09c9182c5047.herokuapp.com/user/users/${viewingUser}/`
    };
    try {
      const response = await axios.request(options);
      setUserInfo(response.data);
      setLoadScreen(false);
    } catch(error) {
      console.log('Fetching User Posts:',error);
    }
  }
  
  const getPosts = async() => {
    // https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/getUserPosts/?user_id={}
    const options = {
      method: 'GET',
      url: 'https://group8-project3-09c9182c5047.herokuapp.com/user-post/posts/getUserPosts/',
      params: {
        'user_id':viewingUser,
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
      viewing={true}
      load={load}
      posts={posts}
      username={userInfo.username}
      email={userInfo.email}
      userId={userId}
    />
  );
}