import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowUpDown, MapPin } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'trending', name: 'Trending' },
  { id: 'popular', name: 'Popular' },
  { id: 'new', name: 'New' },
  { id: 'featured', name: 'Featured' },
];

const ITEMS = [
  {
    id: '1',
    title: 'Mountain Vista Lodge',
    location: 'Aspen, Colorado',
    rating: 4.8,
    price: '$299',
    imageUrl: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    title: 'Seaside Beach House',
    location: 'Malibu, California',
    rating: 4.7,
    price: '$349',
    imageUrl: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    title: 'Urban Loft Downtown',
    location: 'New York, NY',
    rating: 4.5,
    price: '$279',
    imageUrl: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    title: 'Desert Oasis Retreat',
    location: 'Sedona, Arizona',
    rating: 4.9,
    price: '$329',
    imageUrl: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '5',
    title: 'Lakeside Cabin',
    location: 'Lake Tahoe, California',
    rating: 4.6,
    price: '$249',
    imageUrl: 'https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard} activeOpacity={0.9}>
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.ratingIcon}>★</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{item.price}</Text>
          <Text style={styles.priceUnit}>/ night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.categoryChip,
                selectedCategory === item.id && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.categoryTextSelected
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        
        <TouchableOpacity style={styles.sortButton}>
          <ArrowUpDown size={18} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={ITEMS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
  },
  searchButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 20,
    marginBottom: 10,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontFamily: 'SpaceMono',
    color: '#333',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#FFF',
  },
  sortButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemDetails: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontFamily: 'SpaceMono',
    color: '#333',
    fontSize: 14,
    marginRight: 3,
  },
  ratingIcon: {
    color: '#FFD700',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: '#007AFF',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: '#666',
    marginLeft: 4,
  },
});