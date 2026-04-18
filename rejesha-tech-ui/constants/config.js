import { Platform } from 'react-native';

// Toggle this between local and production
const isProduction = false; 

export const BASE_URL = isProduction 
  ? 'https://rejesha-tech.onrender.com' 
  : (Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.34.96.60:3000');