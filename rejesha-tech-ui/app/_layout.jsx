import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../context/ThemeContext';

// This acts as the bouncer
const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

 useEffect(() => {
    if (isLoading) return;

    const inProtectedGroup = segments.includes("(tabs)");

    if (!user && inProtectedGroup) {
      router.replace("/(auth)/login");
    } else if (user && segments[0] === "(auth)") {
      router.replace("/(tabs)/products");
    }
  }, [user, isLoading, segments]);

  return (
    <Stack>
      {/* This handles your main app flow */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* This is the magic part for the modal */}
      <Stack.Screen 
        name="(modals)/add_products" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'List New Part',
          headerShown: true, // Shows the "X" or "Back" button automatically
        }} 
      />
    </Stack>
  ); // Slot renders whatever route we are currently on
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