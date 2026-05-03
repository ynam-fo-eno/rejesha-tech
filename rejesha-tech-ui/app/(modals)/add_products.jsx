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
import themedAlert from "../../components/ThemedAlert";
import { BASE_URL } from '../../constants/config';

export default function AddProductModal() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const initialForm = { pName: '', pAbout: '', price: '', category: '', stock_qty: '1' };
  const [form, setForm] = useState(initialForm);

  // It shall be noted that this function handles the heavy lifting of sending our 
  // form data and base64 image string to the backend, which will then relay the image 
  // to Cloudinary before saving the URLs to our Aiven database.
  const handleListProduct = async () => {
    if (!form.pName || !form.price || !base64Image) {
      themedAlert("Incomplete", "Please provide a name, price, and an image at minimum.", [
        { text: "OK", style: "cancel" }
      ]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imageBase64: base64Image,
          fundi_id: user?.id 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        themedAlert("Upload Failed", data.message || "An error occurred", [
          { text: "OK", style: "cancel" }
        ]);
        setLoading(false);
        return;
      }

      themedAlert("Success", "Product listed successfully on RejeshaTech!", [
        { text: "OK", style: "cancel" }
      ]);
      setForm(initialForm);
      setImage(null);
      setBase64Image(null);
    } catch (error) {
      console.error(error);
      themedAlert("Network Error", "Cannot connect to server. Check your internet.", [
        { text: "OK", style: "cancel" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Because it involves actual deletion from our primary database table, 
  // this function specifically looks at the Product Name typed into the form 
  // to identify which record to strike from the system.
  const handleSimpleDelete = async () => {
    if (!form.pName) {
      themedAlert("Wait a minute...", "Please type the exact Product Name above that you wish to delete.", [
        { text: "OK", style: "cancel" }
      ]);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/products/delete_one`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pName: form.pName }),
      });
      
      if (response.ok) {
        themedAlert("Deleted", `The product ${form.pName} has been removed.`, [
          { text: "OK", style: "cancel" }
        ]);
        setForm(initialForm);
      }
    } catch (error) {
      console.error(error);
      themedAlert("Error", "Could not reach the server to delete.", [
        { text: "OK", style: "cancel" }
      ]);
    }
  };

  // This is the cornerstone of our Easter egg logic! It resets the form state, 
  // triggers the legendary 'Tunaanza Upya' meme video, and simultaneously 
  // sends a request to the backend to truncate the dummy_products table.
  const handleReset = async () => {
    setForm(initialForm);
    setImage(null);
    setBase64Image(null);
    setShowVideo(true); 

    try {
      await fetch(`${BASE_URL}/api/products/reset_dummy`, {
        method: 'DELETE',
      });
      console.log("Dummy products table cleared successfully.");
    } catch (error) {
      console.error("Failed to clear dummy products:", error);
    }
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
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      
        <Modal visible={showVideo} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.videoCard}>
              <Text style={styles.modalTitle}>You're about to reset everything!</Text>
                  {showVideo && <VideoComponent setShowVideo={setShowVideo} />}
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowVideo(false)}>
                <Text style={styles.closeBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={[styles.imagePlaceholder, { backgroundColor: colors.card, borderColor: colors.primary }]} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={styles.selectedImage} /> : <MaterialCommunityIcons name="camera-plus" size={40} color={Colors.primary} />}
        </TouchableOpacity>

        <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Product Name" value={form.pName} onChangeText={(v) => setForm({...form, pName: v})} />
        <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Product Description" value={form.pAbout} onChangeText={(v) => setForm({...form, pAbout: v})} />
        <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Cost (ideally KES)" value={form.price} onChangeText={(v) => setForm({...form, price: v})} />
        <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Category (e.g. Laptops)" value={form.category} onChangeText={(v) => setForm({...form, category: v})} />
        <TextInput style={[styles.input, { backgroundColor: colors.card, color: colors.text }]} placeholder="Quantity in Stock" value={form.stock_qty} onChangeText={(v) => setForm({...form, stock_qty: v})} />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.submitBtn, { backgroundColor: Colors.primary }]} onPress={handleListProduct}>
            <Text style={styles.btnText}>{loading ? "Listing..." : "List Product"}</Text>
          </TouchableOpacity>
            <TouchableOpacity style={[styles.resetBtn,{ backgroundColor: Colors.primary }]} onPress={handleSimpleDelete}>
            <MaterialCommunityIcons name="delete" size={20} color="#ffffff" />
            <Text style={[styles.resetText]}>Delete One</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.resetBtn,{ backgroundColor: Colors.primary }]} onPress={handleReset}>
            <MaterialCommunityIcons name="refresh" size={20} color="#ffffff" />
            <Text style={[styles.resetText]}>Reset ALL</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />

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