import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../context/ThemeContext';

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the AuthProvider finishes checking AsyncStorage
    if (isLoading) return;

    // Determine current location
    const inAuthGroup = segments[0] === '(auth)';
    const atRoot = segments.length === 0;

    if (!user && !inAuthGroup) {
      // 1. Not logged in? Send them to Login
      router.replace('/(auth)/login');
    } else if (user && (inAuthGroup || atRoot)) {
      // 2. Logged in? Don't let them stay on Login or Splash
      router.replace('/(tabs)/products');
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Explicitly define index so the Stack knows it's the home base */}
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen 
        name="(modals)/add_products" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'List New Part',
          headerShown: true 
        }} 
      />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <InitialLayout />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}