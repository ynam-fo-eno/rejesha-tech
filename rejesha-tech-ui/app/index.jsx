import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
//import Logo from "../assets/img/rejesha-tech-logo.png"; 

export default function Index() {
  const { user, isLoading } = useAuth();

  // 1. The "Nice" Loading Screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>REJESHA TECH</Text>
        <ActivityIndicator size="large" color="#ff0101ff" />
        <Text style={styles.footerText}>Restoring Tech, Renewing Trust...</Text>
      </View>
    );
  }

  // 2. The Traffic Controller
  if (user) {
    // Corrected path to your new (tabs) group
    return <Redirect href="/profile" />;
  } else {
    // Redirects to your login page
    return <Redirect href="/repairs" />; 
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#899b9eff', // Your signature Rejesha Grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
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