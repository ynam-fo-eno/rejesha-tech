import { Platform, Alert } from 'react-native';

const themedAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    // 🌐 Web Logic: Browser alerts are limited
    if (buttons && buttons.length > 0) {
      // We look for the "Sign In" button or any button that isn't a cancel style
      const primaryButton = buttons.find(b => b.text === 'Sign In' || b.style !== 'cancel') || buttons[0];
      
      const confirmed = window.confirm(`${title}\n\n${message}\n\nProceed to ${primaryButton.text}?`);
      
      if (confirmed && primaryButton.onPress) {
        primaryButton.onPress();
      }
    } else {
      window.alert(`${title}: ${message}`);
    }
  } else {
    // 📱 Native Mobile Logic: Supports full button arrays
    Alert.alert(title, message, buttons);
  }
};

export default themedAlert;