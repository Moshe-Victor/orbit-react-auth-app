import React, {useState, createContext, useContext} from 'react';
import {useHistory} from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    const expiresAt = localStorage.getItem('expiresAt');

    const [authState, setAuthState] = useState({
        token: null,
        expiresAt,
        userInfo: userInfo ? JSON.parse(userInfo) : {}
    });

    const setAuthInfo = ({token, userInfo, expiresAt}) => {
        //localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('expiresAt', expiresAt);
        setAuthState({
                token,
                userInfo,
                expiresAt
            });
        history.push('/login');
    };

    const logout =  () => {
        //localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('expiresAt');

        setAuthState({
                token: null,
                userInfo: null,
                expiresAt: {}
            }
        );

    }

    const isAuthenticated = () => {
        if (!authState.token || !authState.expiresAt) {
            return false;
        }
        return new Date().getTime() / 1000 <  authState.expiresAt;
    }

    const isAdmin = () => {
        return authState.userInfo.role === 'admin';
    }

  return (
    <Provider
      value={{
        authState: authState,
          setAuthState: authInfo => setAuthInfo(authInfo),
          isAuthenticated,
          logout,
          isAdmin
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
