import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';

const POPULAR_ITEMS = [
  {
    id: '1',
    title: 'Kyoto Gardens',
    location: 'Kyoto, Japan',
    rating: 4.9,
    reviews: 128,
    imageUrl: 'https://images.pexels.com/photos/3410276/pexels-photo-3410276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    title: 'Amalfi Coast',
    location: 'Amalfi, Italy',
    rating: 4.8,
    reviews: 214,
    imageUrl: 'https://images.pexels.com/photos/2253871/pexels-photo-2253871.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '3',
    title: 'Grand Canyon',
    location: 'Arizona, USA',
    rating: 4.7,
    reviews: 186,
    imageUrl: 'https://images.pexels.com/photos/33041/antelope-canyon-lower-canyon-arizona.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '4',
    title: 'Santorini Sunset',
    location: 'Santorini, Greece',
    rating: 4.9,
    reviews: 253,
    imageUrl: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

interface PopularItemProps {
  title: string;
  location: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  onPress?: () => void;
}

function PopularItem({ title, location, rating, reviews, imageUrl, onPress }: PopularItemProps) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={12} color="#666" />
          <Text style={styles.location}>{location}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviews}>({reviews} reviews)</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function PopularList() {
  return (
    <FlatList
      data={POPULAR_ITEMS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PopularItem
          title={item.title}
          location={item.location}
          rating={item.rating}
          reviews={item.reviews}
          imageUrl={item.imageUrl}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  itemContainer: {
    width: 260,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
    marginHorizontal: 4,
  },
  reviews: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    color: '#8E8E93',
  },
});