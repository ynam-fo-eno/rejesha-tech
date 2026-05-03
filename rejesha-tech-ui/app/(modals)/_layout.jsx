import { Stack, router } from 'expo-router';
import { Pressable, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function ModalsLayout() {
  return (
    <Stack
      // screenOptions applies this rule to every Stack.Screen inside this file!
      screenOptions={{
        headerLeft: () => (
          // We only force this custom button on the Web. 
          // Native iOS/Android will keep their beautiful default back animations.
          Platform.OS === 'web' ? (
            <Pressable 
              onPress={() => {if (router.canGoBack()) {
                    router.back();
                } else {
                    // Failsafe: send them to the main dashboard or home
                    router.replace('/(tabs)/repairs');} // Change this to your main route!
                }} 
              style={{ marginRight: 15, marginLeft: 5, padding: 5 }}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
            </Pressable>
          ) : undefined 
        )
      }}
    >
      <Stack.Screen 
        name="geuza_password" 
        options={{ headerTitle: 'Change Password Here' }} 
      />
      <Stack.Screen 
        name="add_products" 
        options={{ headerTitle: 'Product Management Page' }} 
      />
      <Stack.Screen 
        name="add_edu" 
        options={{ headerTitle: 'Add Educational Content' }} 
      />
    </Stack>
  );
}