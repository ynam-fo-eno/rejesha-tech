import { Platform } from 'react-native';

// The 'Elephant' (Expo) looks for the prefix EXPO_PUBLIC_ to allow access on the client side
const cloudURL = process.env.EXPO_PUBLIC_API_URL;

// Local fallbacks for when you are coding in your room
const localWeb = 'http://localhost:3000';
const localMobile = 'http://10.206.189.60:3000'; // Your current local IP

export const BASE_URL = cloudURL 
  ? cloudURL 
  : (Platform.OS === 'web' ? localWeb : localMobile);

console.log("Connecting to:", BASE_URL);