import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, FlatList, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext'; 
import MapComponent from '../../components/MapComponent';
import themedAlert from '../../components/ThemedAlert';
import { router } from 'expo-router';
import { BASE_URL } from "../../constants/config";

export default function Repairs() {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  // Form State
  const [deviceImage, setDeviceImage] = useState(null);
  const [issue_description, setIssueDescription] = useState('');
  const [village_name, setVillageName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // Data State
  const [technicians, setTechnicians] = useState([]); 
  const [assignedRepairs, setAssignedRepairs] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
    if (user?.role1 === 'Technician') fetchAssignedRepairs();
  }, [user]);

  const fetchTechnicians = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/technicians`);
      const data = await response.json();
      setTechnicians(data);
    } catch (e) { 
      // Fallback for demo stability
      setTechnicians([{id: 5, username: 'Timothy'}, {id: 9, username: 'Lionel'}]);
    }
  };

  const fetchAssignedRepairs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/repairs/my-repairs/${user.id}`);
      if (!response.ok) return;
      const data = await response.json();
      setAssignedRepairs(data);
    } catch (e) { console.error("Fetch repairs error:", e); }
  };

  const handleInitialSend = () => {
    if (!deviceImage || !issue_description || !village_name || !landmark) {
      themedAlert("Missing Info", "Please provide a photo, description, and location.");
      return;
    }
    setModalVisible(true);
  };

  const uploadToCloudinary = async (imageAsset) => {
    let base64Img = `data:image/jpg;base64,${imageAsset.base64}`;
    let data = {
      "file": base64Img,
      "upload_preset": "rejesha_uploads", 
    };

    try {
      // Corrected Cloud Name: dyh1tecel
      let res = await fetch("https://api.cloudinary.com/v1_1/dyh1tecel/image/upload", {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      let result = await res.json();
      return result.secure_url; 
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return null;
    }
  };

  const confirmAndSend = async (techId) => {
    setModalVisible(false);
    setLoading(true);
    
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let loc = (status === 'granted') ? await Location.getCurrentPositionAsync({}) : null;

      const publicImageUrl = await uploadToCloudinary(deviceImage);
      if (!publicImageUrl) throw new Error("Upload failed");

      const repairPayload = {
        fundi_id: techId,
        image_url: publicImageUrl, 
        issue_description: issue_description,
        village_name: village_name,
        landmark: landmark,
        latitude: loc?.coords.latitude || 0,
        longitude: loc?.coords.longitude || 0
      };

      const response = await fetch(`${BASE_URL}/api/repairs/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairPayload),
      });

      if (response.ok) {
        themedAlert("Success", "Repair request logged with Cloudinary image!");
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      themedAlert("Error", "Check Cloudinary preset or Internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const pickDeviceImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ 
      allowsEditing: true, 
      quality: 0.5,
      base64: true 
    });
    if (!result.canceled) setDeviceImage(result.assets[0]);
  };

  const renderTechnicianView = () => (
    <View style={[styles.viewContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>My Assigned Tasks</Text>
      <FlatList
        data={assignedRepairs}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ color: colors.grey, textAlign: 'center', marginTop: 20 }}>
            No assigned repairs found for technician ID {user?.id}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.requestCard, { backgroundColor: colors.card }]}>
            <Image source={{ uri: item.image_url }} style={styles.cardThumb} />
            <View style={styles.cardContent}>
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.village_name}</Text>
              <Text style={{ color: colors.grey }}>{item.issue_description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );

  const renderClientView = () => (
    <ScrollView style={[styles.viewContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Request a Repair</Text>
      
      <TouchableOpacity style={[styles.imagePlaceholder, {borderColor: colors.grey}]} onPress={pickDeviceImage}>
        {deviceImage ? <Image source={{ uri: deviceImage.uri }} style={styles.uploadedImage} /> : <MaterialCommunityIcons name="camera-plus" size={40} color={colors.grey} />}
      </TouchableOpacity>

      <TextInput
        style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Issue description..."
        placeholderTextColor={colors.grey}
        value={issue_description}
        onChangeText={setIssueDescription}
        multiline
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Village (e.g. Mavoko)"
        placeholderTextColor={colors.grey}
        value={village_name}
        onChangeText={setVillageName}
      />
      
      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Landmark"
        placeholderTextColor={colors.grey}
        value={landmark}
        onChangeText={setLandmark}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.aiBtn, { backgroundColor: "rgb(15, 120, 185)" }]}>
          <Text style={styles.btnTextWhite}>AI Diagnostic</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleInitialSend} style={styles.techBtn}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextWhite}>Send to Technician</Text>}
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Technician</Text>
            {technicians.map((tech) => (
              <TouchableOpacity key={tech.id} style={styles.techOption} onPress={() => confirmAndSend(tech.id)}>
                <Text style={[styles.techName, { color: colors.text }]}>{tech.username}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapComponent isDarkMode={isDarkMode} primaryColor={colors.primary} />
    </ScrollView>
  );

  return user?.role1 === 'Technician' ? renderTechnicianView() : renderClientView();
}

const styles = StyleSheet.create({
  viewContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  imagePlaceholder: { height: 150, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 13 },
  textArea: { borderRadius: 15, padding: 15, marginTop: 15, height: 80, textAlignVertical: 'top' },
  input: { borderRadius: 15, padding: 15, marginTop: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  aiBtn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  techBtn: { flex: 0.48, backgroundColor: "rgb(15, 120, 185)", padding: 15, borderRadius: 12, alignItems: 'center' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  techOption: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  techName: { fontSize: 16 },
  requestCard: { flexDirection: 'row', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardThumb: { width: 50, height: 50, borderRadius: 8 },
  cardContent: { marginLeft: 15 }
});