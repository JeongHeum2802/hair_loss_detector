import React, { useState, useEffect } from 'react';

// context 구조 정의
const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  records: [],
  login: (token) => { },
  logout: () => { },
  setRecords: (records) => { },
});

// Provider
export const AuthContextProvider = (props) => {
  // 초기값: 로컬 스토리지에 토큰이 있으면 가져오고 없으면 null
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [records, setRecords] = useState([]);

  const userIsLoggedIn = !!token; // null을 false로

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token');
  };


  useEffect(() => {
    const fetchRecords = async () => {
      const response = await fetch("http://localhost:3000/predict/viewRecords/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accessToken: token })
      });
      if (response.ok) {
        const resdata = await response.json();
        setRecords(resdata);
      }
      else {
        console.log("fetchRecords error");
      }
    }
    fetchRecords();
  }, [token]);


  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    records,
    setRecords,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

