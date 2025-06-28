import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Camera, Compass, Mountain, Palmtree, Utensils, Building, Car, Landmark, Map } from "lucide-react-native";

const CATEGORIES = [
  { id: 'photography', name: 'Photography', icon: Camera, color: '#FF9500' },
  { id: 'adventure', name: 'Adventure', icon: Compass, color: '#007AFF' },
  { id: 'mountains', name: 'Mountains', icon: Mountain, color: '#34C759' },
  { id: 'beach', name: 'Beach', icon: Palmtree, color: '#5856D6' },
  { id: 'food', name: 'Dining', icon: Utensils, color: '#FF2D55' },
  { id: 'urban', name: 'Urban', icon: Building, color: '#AF52DE' },
  { id: 'roadtrips', name: 'Road Trips', icon: Car, color: '#FF9500' },
  { id: 'landmarks', name: 'Landmarks', icon: Landmark, color: '#007AFF' },
  { id: 'hiking', name: 'Hiking', icon: Map, color: '#34C759' },
];

interface CategoryItemProps {
  name: string;
  Icon: any;
  color: string;
  onPress?: () => void;
}

function CategoryItem({ name, Icon, color, onPress }: CategoryItemProps) {
  return (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
        <Icon size={22} color={color} />
      </View>
      <Text style={styles.categoryName}>{name}</Text>
    </TouchableOpacity>
  );
}

export function CategoryList() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => (
        <CategoryItem
          key={category.id}
          name={category.name}
          Icon={category.icon}
          color={category.color}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    color: '#333',
    textAlign: 'center',
  },
});