import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'admin' | 'staff' | 'dentist';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@dental_clinic_auth';

// Mock users database - replace with actual API
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: 'admin' as UserRole,
    name: 'Quản trị viên',
  },
  {
    id: '2',
    username: 'staff',
    password: 'staff',
    role: 'staff' as UserRole,
    name: 'Nhân viên',
  },
  {
    id: '3',
    username: 'dentist',
    password: 'dentist',
    role: 'dentist' as UserRole,
    name: 'Bác sĩ',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate input
      if (!username.trim() || !password.trim()) {
        return {
          success: false,
          error: 'Vui lòng nhập đầy đủ thông tin đăng nhập.',
        };
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Find user
      const foundUser = MOCK_USERS.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return {
          success: false,
          error: 'Sai tên đăng nhập hoặc mật khẩu.',
        };
      }

      // Create user object without password
      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name,
      };

      // Store in AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

