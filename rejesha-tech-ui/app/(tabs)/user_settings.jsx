import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth'; 
import { useTheme } from '../../context/ThemeContext'; // The new Theme engine

export default function UserSettings() {
  const { user } = useAuth();
  const { isDarkMode, colors, toggleTheme } = useTheme();

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Configure Tech</Text>
        <Text style={[styles.subtitle, { color: colors.grey }]}>
          Settings for {user?.username || 'Guest'}
        </Text>
      </View>

      {/* --- THEME SECTION --- */}
      <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
        <View style={styles.settingInfo}>
          <MaterialCommunityIcons 
            name={isDarkMode ? "weather-night" : "weather-sunny"} 
            size={24} 
            color={isDarkMode ? "#f1c40f" : "#f39c12"} 
          />
          <View style={styles.textStack}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Appearance</Text>
            <Text style={styles.settingValue}>
              Currently in {isDarkMode ? 'Dark' : 'Light'} Mode
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.toggleBtn, 
            { backgroundColor: isDarkMode ? colors.primary : '#1D2A32' }
          ]} 
          onPress={toggleTheme}
        >
          <Text style={styles.toggleBtnText}>
            Switch to {isDarkMode ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- NOTIFICATIONS (PLACEHOLDER) --- */}
      <View style={[styles.settingCard, { backgroundColor: colors.card }]}>
        <View style={styles.settingInfo}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={colors.grey} />
          <View style={styles.textStack}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
            <Text style={styles.settingValue}>Manage Rejesha alerts</Text>
          </View>
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 5,
  },
  settingCard: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textStack: {
    marginLeft: 15,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 13,
    color: '#899b9eff',
    marginTop: 2,
  },
  toggleBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toggleBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});