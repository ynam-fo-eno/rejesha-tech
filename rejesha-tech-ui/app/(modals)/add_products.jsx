import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Image, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import ThemedLoader from '../../components/ThemedLoader';

export default function AddProductModal() {
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth(); // To get the technician's fundi_id
  
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  
  const [form, setForm] = useState({
    pName: '',
    pAbout: '',
    price: '',
    category: '',
    stock_qty: '1',
  });

  // 📸 PICK IMAGE LOGIC
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to upload tech photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Compressed for faster upload
      base64: true, // Crucial for your Cloudinary backend
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // 🚀 SUBMIT TO BACKEND
  const handleSubmit = async () => {
    // Basic Validation
    if (!form.pName || !form.price || !base64Image) {
      Alert.alert('Missing Info', 'Please provide a name, price, and a photo.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock_qty: parseInt(form.stock_qty),
        imageBase64: base64Image,
        fundi_id: user?.id, // Automatically link to the logged-in technician
      };

      const response = await fetch('http://192.168.100.40:3000/api/products/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success!', 'Product listed on Rejesha Tech.');
        router.back(); // Return to the product list
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not reach the server. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ThemedLoader message="Uploading to Cloudinary..." />;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* IMAGE PICKER SECTION */}
        <TouchableOpacity 
          style={[styles.imagePlaceholder, { backgroundColor: colors.card, borderColor: colors.primary }]} 
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name="camera-plus" size={40} color={colors.primary} />
              <Text style={{ color: colors.grey, marginTop: 8 }}>Add Product Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* FORM FIELDS */}
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.text }]}>Product Name</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="e.g., iPhone 12 Pro Screen"
            placeholderTextColor={colors.grey}
            value={form.pName}
            onChangeText={(val) => setForm({ ...form, pName: val })}
          />

          <Text style={[styles.label, { color: colors.text }]}>Price (Ksh)</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor={colors.grey}
            value={form.price}
            onChangeText={(val) => setForm({ ...form, price: val })}
          />

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Screens, Batteries, etc."
            placeholderTextColor={colors.grey}
            value={form.category}
            onChangeText={(val) => setForm({ ...form, category: val })}
          />

          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Describe the condition or compatibility..."
            placeholderTextColor={colors.grey}
            multiline
            numberOfLines={4}
            value={form.pAbout}
            onChangeText={(val) => setForm({ ...form, pAbout: val })}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, { backgroundColor: colors.primary }]} 
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>List Product</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  imagePlaceholder: {
    height: 200,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden'
  },
  selectedImage: { width: '100%', height: '100%' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16
  },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },
  submitBtn: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});