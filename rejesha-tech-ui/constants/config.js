import { Platform } from 'react-native';

// This will now look at the Expo Dashboard first, then fall back to local if empty
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL 
  ? process.env.EXPO_PUBLIC_API_URL 
  : (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.7.7.110:3000');

console.log("Connecting to:", BASE_URL); // Helps you debug on your phone later