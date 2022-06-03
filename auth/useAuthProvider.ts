import { useContext } from 'react';
import AuthContext from './AuthContext';
import { AuthProvider } from './types';

export const defaultAuthParams = {
  loginUrl: '/login',
  afterLoginUrl: '/',
};

/**
 * Get the authProvider stored in the context
 */
const useAuthProvider = (): AuthProvider => useContext(AuthContext);

export default useAuthProvider;
