import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../services/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = authApi.getStoredUser();
      if (storedUser && authApi.isAuthenticated()) {
        // Verify token with backend
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.data);
        } else {
          authApi.logout();
          setUser(null);
        }
      }
    } catch (err) {
      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      if (response.success) {
        authApi.storeAuthData(response.data);
        setUser(response.data);
        
        // Redirect based on role
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return { success: true, message: 'Login successful!' };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.signup(userData);
      if (response.success) {
        authApi.storeAuthData(response.data);
        setUser(response.data);
        navigate('/');
        return { success: true, message: 'Account created successfully!' };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;