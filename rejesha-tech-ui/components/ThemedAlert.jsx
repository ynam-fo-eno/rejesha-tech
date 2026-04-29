import { Platform, Alert } from 'react-native';

const themedAlert = (title, message) => {
  if (Platform.OS === 'web') {
    // Standard browser alert for web
    window.alert(`${title}: ${message}`);
  } else {
    // Native mobile alert
    Alert.alert(title, message);
  }
};

export default themedAlert;