import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import { useTheme } from '../../context/ThemeContext'; // Your global power grid

// Asset Imports
import KeyboardImg from "../../assets/test-tech/keyboard.png";
import ScreenImg from "../../assets/test-tech/iphone-screen.jpg";
import ChargerImg from "../../assets/test-tech/charger.jpg";
import BatteryImg from "../../assets/test-tech/battery.png";
import MouseImg from "../../assets/test-tech/mouse.jpg";

const DUMMY_PRODUCTS = [
  { id: '1', name: 'HP EliteBook Keyboard (US)', price: 'Ksh 3,500', category: 'Parts', thumb: KeyboardImg },
  { id: '2', name: 'iPhone 11 Screen (Original GX)', price: 'Ksh 8,000', category: 'Screens', thumb: ScreenImg },
  { id: '3', name: 'MacBook Pro Charger (85W)', price: 'Ksh 4,500', category: 'Accessories', thumb: ChargerImg },
  { id: '4', name: 'Dell Latitude 6-Cell Battery', price: 'Ksh 5,200', category: 'Parts', thumb: BatteryImg },
  { id: '5', name: 'Logitech M185 Mouse', price: 'Ksh 1,800', category: 'Accessories', thumb: MouseImg },
];

export default function BuySellTech() {
  const [searchQuery, setSearchQuery] = useState('');
  const { colors, isDarkMode } = useTheme(); // Hooking into the theme

  const filteredProducts = DUMMY_PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {Platform.OS === 'web' && (
        <Head>
          <title>Buy & Sell Tech Parts Kenya | Rejesha Tech KE</title>
        </Head>
      )}

      {/* --- SEARCH BAR --- */}
      <View style={[styles.searchSection, { backgroundColor: colors.card, borderColor: isDarkMode ? colors.grey : '#ddd' }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.grey} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search for parts or devices..."
          placeholderTextColor={isDarkMode ? "#929292" : "#666"}
          value={searchQuery}
          onChangeText={setSearchQuery}
          outlineStyle="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.grey} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={NoResultsView}
        renderItem={({ item }) => (
          <View style={[styles.productCard, { backgroundColor: colors.card }]}>
            <Image source={item.thumb} style={styles.productThumb} resizeMode="cover" />

            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
              <Text style={[styles.productCategory, { color: colors.grey }]}>{item.category}</Text>
              <Text style={[styles.productPrice, { color: colors.primary }]}>{item.price}</Text>
            </View>

            <TouchableOpacity style={[styles.viewBtn, { backgroundColor: isDarkMode ? colors.grey : '#899b9eff' }]}>
              <Text style={styles.viewBtnText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
});