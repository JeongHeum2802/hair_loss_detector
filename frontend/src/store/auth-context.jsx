import React, { useState, useEffect } from 'react';

// context 구조 정의
const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => { },
  logout: () => { },
});

// Provider
export const AuthContextProvider = (props) => {
  // 초기값: 로컬 스토리지에 토큰이 있으면 가져오고 없으면 null
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // null을 false로

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

