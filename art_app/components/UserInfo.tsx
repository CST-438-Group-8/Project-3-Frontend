import React, { createContext, useState } from 'react';

const UserContext = createContext();

function UserInfo({ children }) {
  const [userId, setUserId] = useState<number>(-1);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [viewingUser, setViewingUser] = useState<string>('');

  const value = {
    userId, setUserId,
    username, setUsername,
    email, setEmail,
    viewingUser, setViewingUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export {UserContext, UserInfo};