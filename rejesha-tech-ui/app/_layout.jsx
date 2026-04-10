import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../context/ThemeContext';

// This acts as the bouncer
const InitialLayout = () => {
  const { user, isLoading } = useAuth;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait until we check AsyncStorage

    const inProtectedGroup = segments[0] === '(protected)';

    if (!user && inProtectedGroup) {
      // Not logged in? Kick them to the login page
      router.replace('/(auth)/login');
    } else if (user && segments[0] === '(auth)') {
      // Already logged in? Kick them to the dashboard
      router.replace('/(tabs)/profile');
    }
  }, [user, isLoading, segments]);

  return <Slot />; // Slot renders whatever route we are currently on
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