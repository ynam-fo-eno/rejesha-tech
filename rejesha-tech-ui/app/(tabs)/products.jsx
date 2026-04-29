import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import ThemedLoader from '../../components/ThemedLoader';
import { BASE_URL } from '../../constants/config';


export default function BuySellTech() {
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDarkMode } = useTheme();
  const { user } = useAuth(); // Hooking into your auth state
  const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await fetchProducts();
  setRefreshing(false);
};

  // 1. DEFINE THE ADMIN LOGIC
  const isAdmin = user?.role1 === 'Technician';

  // 2. DEFINE THE NAVIGATION LOGIC
  const handleAddProduct = () => {
    router.push('/(modals)/add_products'); 
  };

  const fetchProducts = async () => {
    try {
      // Ensure this IP matches your PC's current IP on your Wi-Fi!
      const response = await fetch(`${BASE_URL}/api/products/all`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // FIX: Watch the 'L' in toLowerCase()
const filteredProducts = Array.isArray(products) ? products.filter((product) =>
  product.pName?.toLowerCase().includes(searchQuery.toLowerCase())
) : [];

  const getProductImage = (item) => {
    if (item.image_url && item.image_url.startsWith('http')) {
      return { uri: item.image_url };
    }
    // Fallback if the URL is broken or null
    return require('../../assets/icon.png'); 
  };

  const NoResultsView = () => (
  <View style={styles.emptyContainer}>
    <MaterialCommunityIcons 
      name="magnify-minus" 
      size={80} 
      color={isDarkMode ? colors.grey : "#1D2A32"} 
    />
    <Text style={[styles.emptyTitle, { color: colors.text }]}>Can't find what you need?</Text>
    <Text style={[styles.emptyText, { color: colors.grey }]}>
      If we don't have the specific tech in stock, our technicians can track it down or fix what you already have.
    </Text>
    
    <TouchableOpacity 
      style={[styles.requestBtn, { backgroundColor: colors.primary }]}
      onPress={() => router.push('/(tabs)/repairs')}
    >
      <Text style={styles.requestBtnText}>Request a Specific Part</Text>
    </TouchableOpacity>
  </View>
);

  if (loading) {
    return <ThemedLoader />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* --- SEARCH BAR --- */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.grey : '#ddd' }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.grey} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for parts..."
          placeholderTextColor={isDarkMode ? "#929292" : "#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<NoResultsView />}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { backgroundColor: colors.card }]}>
            <Image source={getProductImage(item)} style={styles.productThumb} resizeMode="cover" />

            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                {item.pName}
              </Text>
              <Text style={[styles.productCategory, { color: colors.grey }]}>
                {item.category}
              </Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>
                Ksh {parseFloat(item.price).toLocaleString()}
              </Text>
              
              {/* JOIN result: Shows who listed the item */}
              {item.fundi_name && (
                <Text style={{ fontSize: 10, color: colors.grey, marginTop: 4 }}>
                  Listed by: {item.fundi_name}
                </Text>
              )}
            </View>

            <TouchableOpacity style={[styles.viewBtn, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.viewBtnText, { color: colors.primary }]}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* --- FLOATING ACTION BUTTON --- */}
      {isAdmin && (
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary }]} 
          onPress={handleAddProduct}
        >
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 48, fontSize: 16 },
  listContent: { paddingBottom: 20 },
  productCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productThumb: { width: 75, height: 75, borderRadius: 12, marginRight: 15, backgroundColor: '#f0f0f0' },
  productInfo: { flex: 1, justifyContent: 'center', marginRight: 10 },
  productName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  productCategory: { fontSize: 12, fontStyle: 'italic', marginBottom: 4 },
  productPrice: { fontSize: 15, fontWeight: '600' },
  viewBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10 },
  viewBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { marginTop: 60, alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15, textAlign: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  requestBtn: { marginTop: 30, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30 },
  requestBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  },
});