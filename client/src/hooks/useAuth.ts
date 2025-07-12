import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false
        });
        return;
      }

      const response = await apiRequest('GET', '/api/auth/me', null, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.success) {
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: response.user.role === 'admin'
        });
      } else {
        localStorage.removeItem('authToken');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false
      });
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', {
        username,
        password
      });

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setAuthState({
          user: response.user,
          isLoading: false,
          isAuthenticated: true,
          isAdmin: response.user.role === 'admin'
        });
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await apiRequest('POST', '/api/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false
    });
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth
  };
}