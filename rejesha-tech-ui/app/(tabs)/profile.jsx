import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth'; 
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ThemedLoader from '../../components/ThemedLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../constants/config';

export default function Profile() {
  const { user, login, logout } = useAuth(); // We use 'login' to update the local user state
  const { colors, isDarkMode } = useTheme();
  const [uploading, setUploading] = useState(false);

  // 🎨 THEME OVERRIDES (Cyan/Blue/Beige)
  const brandCyan = '#00E5FF';
  const brandBlue = '#0077B6';
  const brandBeige = isDarkMode ? '#1A1A1A' : '#F5F5DC';

 const changeProfilePicture = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Needed', 'Gallery access is required!');
    return;
  }

// In profile.jsx
let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5, // You have this
  base64: true,
  width: 500, // Optional: Scales the image down to 500px to save bandwidth
});

  if (!result.canceled) {
    uploadToBackend(result.assets[0].base64);
  }
};

const uploadToBackend = async (base64) => {
  setUploading(true);
  try {
    const token = await AsyncStorage.getItem('jwtToken'); 

    const response = await fetch(`${BASE_URL}/api/users/update-dp`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        imageBase64: `data:image/jpeg;base64,${base64}` 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // 🛡️ SAFETY CHECK: If the backend hasn't been pushed to Render yet, 
      // data.user will be undefined. We build a fallback so it doesn't crash.
      if (data.user) {
        // This is the ideal path (New Backend)
        login(data.user, token); 
      } else {
        // This is the "Emergency Path" (Old Backend)
        // It keeps your existing roles but adds the new image link
        const fallbackUser = { ...user, image_url: data.imageUrl || user.image_url };
        login(fallbackUser, token);
      }

      Alert.alert('Success', 'Profile picture updated!');
      
    } else {
      console.log("Server Error:", data);
      Alert.alert('Error', data.error || 'Failed to update');
    }
  } catch (error) {
    console.error("Upload Error:", error);
    Alert.alert('Upload Error', 'Could not connect to server.');
  } finally {
    setUploading(false);
  }
};

  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons name="account-lock" size={80} color={brandBlue} />
        <Text style={[styles.loginText, { color: colors.text }]}>Identity hidden. Please sign in.</Text>
        <TouchableOpacity style={[styles.loginBtn, { backgroundColor: brandBlue }]} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (uploading) return <ThemedLoader message="Updating your look..." />;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={changeProfilePicture} style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, { backgroundColor: brandBlue, borderColor: brandCyan }]}>
            {user.image_url ? (
              <Image source={{ uri: user.image_url }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarLetter}>
                {user.username?.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={[styles.editBadge, { backgroundColor: brandCyan }]}>
            <MaterialCommunityIcons name="camera" size={16} color="#000" />
          </View>
        </TouchableOpacity>
        
        <Text style={[styles.userName, { color: colors.text }]}>{user.username}</Text>
        <Text style={[styles.userRole, { color: brandCyan }]}>
          {user.role1 || 'Member'} | Rejesha Tech
        </Text>
      </View>

      {/* --- STATS SECTION --- */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: brandCyan }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.grey }]}>Repairs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.statNumber, { color: brandCyan }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.grey }]}>Parts</Text>
        </View>
      </View>

      {/* --- INFO LIST --- */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color={brandCyan} />
          <Text style={[styles.infoText, { color: colors.text }]}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color={brandCyan} />
          <Text style={[styles.infoText, { color: colors.text }]}>Joined April 2026</Text>
        </View>
      </View>

      {/* --- LOGOUT --- */}
      <TouchableOpacity style={[styles.logoutBtn, { borderColor: brandCyan }]} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={20} color={brandCyan} />
        <Text style={[styles.logoutBtnText, { color: brandCyan }]}>Sign Out of Tech</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  profileHeader: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: { position: 'relative' },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarLetter: { color: '#fff', fontSize: 50, fontWeight: 'bold' },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: { fontSize: 26, fontWeight: '800', marginTop: 15 },
  userRole: { fontSize: 14, marginTop: 5, fontWeight: '600', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, marginTop: 4, fontWeight: '600' },

  infoSection: { width: '100%', padding: 25, borderRadius: 20, marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },

  logoutBtn: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: { fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  loginText: { fontSize: 18, marginTop: 10, textAlign: 'center' },
  loginBtn: { marginTop: 30, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});