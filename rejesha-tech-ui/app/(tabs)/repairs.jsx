import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext'; 
import MapComponent from '../../components/MapComponent';
import themedAlert from '../../components/ThemedAlert';


const IS_MAP_ENABLED = true; 


export default function Repairs() {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); 
  const [deviceImage, setDeviceImage] = useState(null);
  const [description, setDescription] = useState('');

  
  const handleAddRepair = () => {
    if (!user) {
      themedAlert(
        "Account Required",
        "You need to be signed in to log a new repair.",
        [
          { text: "Later", style: "cancel" },
          { text: "Sign In", onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
  };

  const pickDeviceImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) setDeviceImage(result.assets[0].uri);
  };

  // --- MAP CONTINGENCY UI ---
  const MapPlaceholder = () => (
    <View style={[styles.mapPlaceholder, { backgroundColor: colors.card, borderColor: colors.grey }]}>
       <MaterialCommunityIcons name="map-marker-off" size={40} color={colors.primary} />
       <Text style={[styles.placeholderTitle, { color: colors.text }]}>Map Under Maintenance</Text>
       <Text style={[styles.placeholderText, { color: colors.grey }]}>
         GPS Tracking is currently being calibrated for Athi River. 
         Please use the "Send to Technician" button above for urgent repairs.
       </Text>
    </View>
  );

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
      
            {IS_MAP_ENABLED ? (
        <MapComponent 
          isDarkMode={isDarkMode} 
          primaryColor={colors.primary} 
        />
      ) : (
        <MapPlaceholder />
      )}
      
      {/* Extra spacer for scrollability */}
      <View style={{ height: 40 }} />
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
  
  // Placeholder Styles
  mapPlaceholder: { 
    height: 250, 
    borderRadius: 20, 
    borderWidth: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    marginBottom: 30 
  },
  placeholderTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  placeholderText: { textAlign: 'center', marginTop: 8, fontSize: 13, lineHeight: 18 },

  requestCard: { padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  requestUser: { fontWeight: 'bold', fontSize: 16 },
  requestIssue: { marginVertical: 5 },
  emailBtn: { padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center' }
});