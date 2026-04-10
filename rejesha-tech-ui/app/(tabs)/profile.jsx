import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth'; 
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext'; // Your new power grid

export default function Profile() {
  const { user, logout } = useAuth();
  const { colors, isDarkMode } = useTheme(); // Pulling global colors

  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons 
          name="account-lock" 
          size={80} 
          color={isDarkMode ? colors.grey : "#1D2A32"} 
        />
        <Text style={[styles.loginText, { color: colors.text }]}>Identity hidden. Please sign in.</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.btnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.profileHeader}>
        <View style={[styles.avatarCircle, { backgroundColor: isDarkMode ? colors.card : '#1D2A32' }]}>
          <Text style={styles.avatarLetter}>
            {user.username?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user.username}</Text>
        <Text style={styles.userRole}>{user.role1} | Rejesha Tech Member</Text>
      </View>

      {/* --- TECH STATS SECTION --- */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={[styles.statLabel, { color: colors.grey }]}>Repairs</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={[styles.statLabel, { color: colors.grey }]}>Parts</Text>
        </View>
      </View>

      {/* --- INFO LIST --- */}
      <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="email-outline" size={20} color={colors.grey} />
          <Text style={[styles.infoText, { color: colors.text }]}>{user.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.grey} />
          <Text style={[styles.infoText, { color: colors.text }]}>Joined April 2026</Text>
        </View>
      </View>

      {/* --- LOGOUT --- */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutBtnText}>Sign Out of Tech</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  profileHeader: { alignItems: 'center', marginVertical: 30 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarLetter: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  userName: { fontSize: 24, fontWeight: '800' },
  userRole: { fontSize: 14, color: '#899b9eff', marginTop: 5, fontStyle: 'italic' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#ff0101ff' },
  statLabel: { fontSize: 12 },

  infoSection: { width: '100%', padding: 20, borderRadius: 15, marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { marginLeft: 15, fontSize: 16 },

  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff0101ff',
    width: '100%',
    padding: 15,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  loginText: { fontSize: 18, marginTop: 10 },
  loginBtn: { marginTop: 20, padding: 10 },
  btnText: { color: '#ff0101ff', fontWeight: 'bold', fontSize: 16 }
});