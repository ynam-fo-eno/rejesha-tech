import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>REJESHA TECH</Text>
      <ActivityIndicator size="large" color="#29b639" />
      <Text style={styles.footerText}>Restoring Tech, Renewing Trust...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#074d59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D2A32',
    letterSpacing: 2,
    marginBottom: 10,
  },
  footerText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#fff',
  },
});