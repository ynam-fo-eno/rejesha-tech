import { View, Text, StyleSheet } from 'react-native';

export default function MapComponent() {
  return (
    <View style={styles.webPlaceholder}>
      <Text style={styles.text}>🗺️ Map view is optimized for Mobile devices.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webPlaceholder: { 
    height: 200, 
    borderRadius: 15, 
    backgroundColor: '#2c3e50', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30 
  },
  text: { color: '#fff', fontWeight: '600' }
});