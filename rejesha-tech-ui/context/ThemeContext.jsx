import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load the saved preference when the app starts
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) setIsDarkMode(savedTheme === 'dark');
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
  };

  // Define colors here so you don't have to rewrite them in every file
  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#1D2A32' : '#f5f5f5',
      text: isDarkMode ? '#ecf0f1' : '#1D2A32',
      card: isDarkMode ? '#2c3e50' : '#fff',
      primary: '#ff0101', // Rejesha Red
      grey: '#899b9eff',
    },
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);