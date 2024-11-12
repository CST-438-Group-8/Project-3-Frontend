import React, { createContext, useState } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [viewingUser, setViewingUser] = useState('');

  const value = {
    userId, setUserId,
    username, setUsername,
    password, setPassword,
    viewingUser, setViewingUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
