import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../context/ThemeContext';

const InitialLayout = () => {
  const { user, isLoading } = useAuth();

  //Expo splits your path name into segments with this hook
  const segments = useSegments();

  const router = useRouter();

 useEffect(() => {
    
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const atRoot = segments.length === 0 || segments[0] === 'index' || segments[0] === '';

    if (atRoot) {
      // Land everyone on Repairs by default, regardless of auth status
      router.replace('/(tabs)/repairs');
    } else if (user && inAuthGroup) {
      // If they are ALREADY logged in but try to go to Login/Register, 
      // kick them back to the dashboard.
      router.replace('/(tabs)/repairs');
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Explicitly define index so the Stack knows it's the home base */}
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: 'modal'}} />
      {/*Look at the hassle of repeating pages route groups like tha above saves us from.
      Imagine if we had to list EVERY SINGLE MODAL PAGE LIKE SO! * This is instead done 
      in each route group's respective _layout.jsx*/}
      {/*  <Stack.Screen 
        name="(modals)/add_products" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'List New Part',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="(modals)/add_edu" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'Add Educational Content',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="(modals)/geuza_password" 
        options={{ 
          presentation: 'modal', 
          headerTitle: 'Change Password Here',
          headerShown: true 
        }} 
      />*/}

    
    </Stack>
  );
};


//Notice we embed the InitialLayout above into a SafeAreaProvider
//which just helps with putting all components within the confines
//of one's phone's dimensions without overflow
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