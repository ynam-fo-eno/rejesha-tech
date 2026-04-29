import { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if a token exists when the app opens
  useEffect(() => {
    
    const loadUser = async () => {
      console.log("Checking storage...");
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const userData = await AsyncStorage.getItem('userData');
        console.log("Token found:", token);
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        console.log("Loading finished!");
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Called from your login.jsx after a successful fetch
  const login = async (userData, token) => {
    await AsyncStorage.setItem('jwtToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData); // Fixed casing: setUser
  };

  const logout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    await AsyncStorage.removeItem('userData');
    setUser(null); // Fixed casing: setUser
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}