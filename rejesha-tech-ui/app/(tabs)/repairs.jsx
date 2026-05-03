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
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Mini Custom Markdown Parser ---
// This saves you from having to install a 3rd party markdown library!
const renderMarkdownText = (text) => {
  if (!text) return null;
  // Splits the text by **bold** markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove the asterisks and return bold text
      return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
    }
    return <Text key={index}>{part}</Text>;
  });
};

export default function Repairs() {
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme();
  
  // --- Form State ---
  const [deviceImage, setDeviceImage] = useState(null);
  const [issue_description, setIssueDescription] = useState('');
  const [village_name, setVillageName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  
  // --- Client AI State ---
  const [aiDiagnosis, setAiDiagnosis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  // --- Technician AI Modal State ---
  const [techAiModalVisible, setTechAiModalVisible] = useState(false);
  const [currentAiNotes, setCurrentAiNotes] = useState('');
  
  // --- Data State ---
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

  const handleGemini = async () => {
    if (!issue_description && !deviceImage) {
      themedAlert("Missing Info", "Please provide a description or a photo of the issue for the AI to analyze.",[
          { text: "OK", style: "/" },
        ]);
      return;
    }

    setIsAiLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

      const systemPrompt = `You are the Rejesha Tech AI Diagnostic Expert. Your goal is to analyze descriptions and images of broken electronic devices. Provide a professional, concise technical diagnosis. Identify likely faulty components. Estimate the repair complexity and always include a polite disclaimer that a physical inspection by a Rejesha technician is required for a final quote. \n\nUser Description: ${issue_description || "No text description provided. Rely on image."}`;

      const imageParts = [];
      if (deviceImage && deviceImage.base64) {
        imageParts.push({
          inlineData: {
            data: deviceImage.base64,
            mimeType: "image/jpeg"
          }
        });
      }

      const result = await model.generateContent([systemPrompt, ...imageParts]);
      const responseText = await result.response.text();

      setAiDiagnosis(responseText);
      setAiModalVisible(true);
    } catch (error) {
      console.error("Gemini Error:", error);
      themedAlert("AI System Offline", "Failed to retrieve diagnosis. Check network or API key permissions.",[
          { text: "OK", style: "/" },
        ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleInitialSend = () => {
    if (!deviceImage || !issue_description || !village_name || !landmark) {
      themedAlert("Missing Info", "Please provide a photo, description, and location.",[
          { text: "OK", style: "/" },
        ]);
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
      let res = await fetch("https://api.cloudinary.com/v1_1/dyh1tecei/image/upload", {
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
        client_id: user?.id, 
        image_url: publicImageUrl, 
        issue_description: issue_description,
        village_name: village_name,
        landmark: landmark,
        latitude: loc?.coords.latitude || 0,
        longitude: loc?.coords.longitude || 0,
        ai_thoughts: aiDiagnosis || "N/A"
      };

      const response = await fetch(`${BASE_URL}/api/repairs/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairPayload),
      });

      if (response.ok) {
        setDeviceImage(null);
        setIssueDescription('');
        setVillageName('');
        setLandmark('');
        setAiDiagnosis(''); 
        
        themedAlert("Success", "Repair request logged! Technician notified.",[
          { text: "OK", style: "/" },
        ]);
        setTimeout(() => router.back(), 1500);
      }
    } catch (error) {
      themedAlert("Error", "Check Cloudinary preset or Internet connection.",[
          { text: "OK", style: "/" },
        ]);
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
            <View style={[styles.cardContent, {flex: 1}]}>
              <Text style={{ color: colors.text, fontWeight: 'bold' }}>From: {item.client_name || `Client ${item.client_id}`}</Text>
              <Text style={{ color: colors.grey, marginBottom: 8 }}>{item.village_name} - {item.issue_description}</Text>
              
              {/* Conditional AI Button for Technician */}
              {item.ai_thoughts && item.ai_thoughts !== 'N/A' ? (
                <TouchableOpacity 
                  style={styles.viewAiBtn}
                  onPress={() => {
                    setCurrentAiNotes(item.ai_thoughts);
                    setTechAiModalVisible(true);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                    ✨ View AI Assessment
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ color: colors.grey, fontStyle: 'italic', fontSize: 12 }}>
                  AI Notes: N/A
                </Text>
              )}
            </View>
          </View>
        )}
      />

      {/* Technician AI Notes Modal */}
      <Modal visible={techAiModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>AI Diagnostic Notes</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              <Text style={{ color: colors.text, lineHeight: 22 }}>
                {renderMarkdownText(currentAiNotes)}
              </Text>
            </ScrollView>
            <TouchableOpacity 
              style={[styles.techBtn, { width: '100%' }]} 
              onPress={() => setTechAiModalVisible(false)}
            >
              <Text style={styles.btnTextWhite}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
        <TouchableOpacity 
          style={styles.aiBtn} 
          onPress={handleGemini}
          disabled={isAiLoading}
        >
          {isAiLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextWhite}>AI Diagnostic</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleInitialSend} style={styles.techBtn}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextWhite}>Send to Tech</Text>}
        </TouchableOpacity>
      </View>

      {/* Technician Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Technician</Text>
            {technicians.map((tech) => (
              <TouchableOpacity key={tech.id} style={styles.techOption} onPress={() => confirmAndSend(tech.id)}>
                <Text style={[styles.techName, { color: colors.text }]}>{tech.username}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red', marginTop: 15, textAlign: 'center', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Client AI Results Modal */}
      <Modal visible={aiModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Rejesha AI Assessment</Text>
            <ScrollView style={{ marginBottom: 20 }}>
              <Text style={{ color: colors.text, lineHeight: 22 }}>
                {renderMarkdownText(aiDiagnosis)}
              </Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ padding: 10 }} onPress={() => setAiModalVisible(false)}>
                <Text style={{ color: colors.grey, fontWeight: 'bold' }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.techBtn, { flex: 0.7, padding: 10 }]} 
                onPress={() => {
                  setAiModalVisible(false);
                  handleInitialSend();
                }}
              >
                <Text style={styles.btnTextWhite}>Proceed to Tech</Text>
              </TouchableOpacity>
            </View>
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
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 15 },
  aiBtn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center', backgroundColor: "#2e7d32" }, 
  techBtn: { flex: 0.48, backgroundColor: "rgb(15, 120, 185)", padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  viewAiBtn: { backgroundColor: '#005b96', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignSelf: 'flex-start' },
  btnTextWhite: { color: '#120606', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  techOption: { padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  techName: { fontSize: 16 },
  requestCard: { flexDirection: 'row', padding: 15, borderRadius: 15, marginBottom: 10 },
  cardThumb: { width: 60, height: 60, borderRadius: 8 },
  cardContent: { marginLeft: 15 }
});