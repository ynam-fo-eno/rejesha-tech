import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; // Import the power grid
import MapComponent from '../../components/MapComponent';

export default function Repairs() {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); // Pull dynamic colors
  const [deviceImage, setDeviceImage] = useState(null);
  const [description, setDescription] = useState('');

  const pickDeviceImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setDeviceImage(result.assets[0].uri);
  };

  // --- CLIENT VIEW ---
  const ClientView = () => (
    <ScrollView style={[styles.viewContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Diagnose Your Device</Text>
      
      <TouchableOpacity 
        style={[styles.imagePlaceholder, { backgroundColor: colors.card, borderColor: colors.grey }]} 
        onPress={pickDeviceImage}
      >
        {deviceImage ? (
          <Image source={{ uri: deviceImage }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.uploadPrompt}>
            <MaterialCommunityIcons name="camera-plus" size={40} color={colors.grey} />
            <Text style={[styles.uploadText, { color: colors.grey }]}>Attach Photo of Faulty Device</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Tell us what's wrong (e.g., 'Screen flickers when charging')"
        placeholderTextColor={isDarkMode ? "#929292" : "#666"}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.aiBtn, { backgroundColor: isDarkMode ? colors.grey : '#1D2A32' }]}>
          <Text style={styles.btnTextWhite}>Ask AI Diagnostic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.techBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.btnTextWhite}>Send to Technician</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Nearby Rejesha Shops</Text>
        <MapComponent/>
    </ScrollView>
  );

  // --- TECHNICIAN VIEW ---
  const TechnicianView = () => (
    <View style={[styles.viewContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Repair Requests</Text>
      <FlatList
        data={[{ id: '1', user: 'kenyanMinato', device: 'Laptop', issue: 'Keyboard not working' }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.requestCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.requestUser, { color: colors.text }]}>{item.user} - {item.device}</Text>
            <Text style={[styles.requestIssue, { color: colors.grey }]}>{item.issue}</Text>
            <TouchableOpacity style={[styles.emailBtn, { backgroundColor: colors.grey }]}>
              <Text style={styles.btnTextWhite}>Contact via Email</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );

  return user?.role1 === 'Technician' ? <TechnicianView /> : <ClientView />;
}

const styles = StyleSheet.create({
  viewContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 15 },
  imagePlaceholder: { 
    height: 180, 
    borderRadius: 15, 
    borderStyle: 'dashed', 
    borderWidth: 2, 
    justifyContent: 'center', 
    alignItems: 'center', 
    overflow: 'hidden' 
  },
  uploadedImage: { width: '100%', height: '100%' },
  uploadPrompt: { alignItems: 'center' },
  uploadText: { marginTop: 10, fontWeight: '600' },
  textArea: { 
    borderRadius: 15, 
    padding: 15, 
    marginTop: 15, 
    fontSize: 16, 
    height: 100, 
    textAlignVertical: 'top' 
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  aiBtn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  techBtn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' },
  mapContainer: { height: 200, borderRadius: 15, overflow: 'hidden', marginBottom: 30 },
  map: { width: '100%', height: '100%' },
  requestCard: { padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  requestUser: { fontWeight: 'bold', fontSize: 16 },
  requestIssue: { marginVertical: 5 },
  emailBtn: { padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' }
});