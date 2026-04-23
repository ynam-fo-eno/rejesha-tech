import { Platform } from 'react-native';

// Toggle this between local and production
const isProduction = true;

export const BASE_URL = isProduction 
  ? 'https://rejesha-tech.onrender.com' 
  : (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.206.76.60:3000');