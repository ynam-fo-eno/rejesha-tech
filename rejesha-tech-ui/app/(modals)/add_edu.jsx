import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import YoutubePlayer from "react-native-youtube-iframe"; 
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import VideoComponent from '../../components/VideoComponent';
import { Colors } from '../../constants/Colors';

export default function AddProductModal() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const initialForm = { pName: '', pAbout: '', price: '', category: '', stock_qty: '1' };
  const [form, setForm] = useState(initialForm);


  const handleReset = () => {
    setForm(initialForm);
    setImage(null);
    setBase64Image(null);
    setShowVideo(true); // Pop the video!
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollContainer}keyboardShouldPersistTaps="handled">
      
       
        <Text>Welcome, great educator on RejeshaTech. The floor to add eductaional vids is yours</Text>
        {/* ... To add a video to ... */}
        <TouchableOpacity style={[styles.imagePlaceholder, { backgroundColor: colors.card, borderColor: colors.primary }]} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.selectedImage} /> : <MaterialCommunityIcons name="video-box" size={40} color={Colors.primary} />}
        </TouchableOpacity>

        

      </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20,paddingBottom:20 },
  submitBtn: { flex: 1, height: 45,  borderRadius: 15, borderWidth: 1,justifyContent: 'center' },
  resetBtn: { flex: 1, height: 45, borderRadius: 15, borderWidth: 1, borderColor: '#3b476a', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  btnText: { flex: 1, color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign:"center",justifyContent: 'center',marginTop:10 },
  resetText: { marginLeft: 5,  color: '#fff', fontWeight: 'bold' },
  input: { height: 50, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  imagePlaceholder: { height: 180, borderRadius: 15, borderStyle: 'dashed', borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden' },
  selectedImage: { width: '100%', height: '100%' },
  
  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  videoCard: { width: '90%', backgroundColor: '#fff', borderRadius: 20, padding: 10, overflow: 'hidden' },
  modalTitle: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  closeBtn: { backgroundColor: '#1D2A32', padding: 12, borderRadius: 10, marginTop: 10, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: 'bold' }
});