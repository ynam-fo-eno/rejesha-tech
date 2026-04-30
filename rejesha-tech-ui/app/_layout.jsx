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
    // 1. Wait for the 'Elephant' to check the local storage
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const atRoot = segments.length === 0 || segments[0] === 'index' || segments[0] === '';

    // 🎯 THE "OPEN DOOR" LOGIC
    if (atRoot) {
      // Land everyone on Repairs by default, regardless of auth status
      router.replace('/(tabs)/repairs');
    } else if (user && inAuthGroup) {
      // If they are ALREADY logged in but try to go to Login/Register, 
      // kick them back to the dashboard.
      router.replace('/(tabs)/repairs');
    }
    
    // NOTE: We removed the "if (!user) redirect to login" block.
    // This allows unauthenticated users to stay in the (tabs) group.
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