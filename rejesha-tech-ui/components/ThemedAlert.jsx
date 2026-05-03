import { Platform, Alert } from 'react-native';

const themedAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    //  Web Logic: Browser alerts are limited, so we adapt based on button count
    const webMessage = `${title ? title + '\n\n' : ''}${message}`;

    // Case 1: No buttons provided
    if (!buttons || buttons.length === 0) {
      window.alert(webMessage);
      return;
    }

    // Case 2: Exactly ONE button (e.g., just an "OK" acknowledgment)
    if (buttons.length === 1) {
      window.alert(webMessage); // Pauses execution until the user clicks the browser's "OK"
      if (buttons[0].onPress) {
        buttons[0].onPress();
      }
      return;
    }

    // Case 3: TWO or more buttons (Requires a choice)
    // Browsers only support an OK/Cancel UI via window.confirm
    const cancelButton = buttons.find(b => b.style === 'cancel');
    const confirmButton = buttons.find(b => b.style !== 'cancel') || buttons[0];

    const userConfirmed = window.confirm(webMessage);

    if (userConfirmed) {
      // User clicked the browser's native "OK"
      if (confirmButton && confirmButton.onPress) confirmButton.onPress();
    } else {
      // User clicked the browser's native "Cancel"
      if (cancelButton && cancelButton.onPress) cancelButton.onPress();
    }

  } else {
    // 📱 Native Mobile Logic: React Native handles the array perfectly
    Alert.alert(title, message, buttons);
  }
};

export default themedAlert;