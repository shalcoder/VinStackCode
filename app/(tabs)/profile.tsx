import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Settings, MapPin, Globe, Calendar, Grid, Bookmark, Heart } from 'lucide-react-native';

const STATS = [
  { label: 'Posts', value: 248 },
  { label: 'Followers', value: '12.4k' },
  { label: 'Following', value: 274 },
];

const TABS = [
  { id: 'posts', icon: Grid, label: 'Posts' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'liked', icon: Heart, label: 'Liked' },
];

const GALLERY = [
  'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/7625308/pexels-photo-7625308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1770775/pexels-photo-1770775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1098365/pexels-photo-1098365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/3225528/pexels-photo-3225528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1761282/pexels-photo-1761282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Morgan</Text>
            <Text style={styles.profileBio}>
              Photographer & Explorer. Capturing beautiful moments.
            </Text>
            
            <View style={styles.profileDetails}>
              <View style={styles.profileDetail}>
                <MapPin size={14} color="#666" />
                <Text style={styles.profileDetailText}>New York, USA</Text>
              </View>
              <View style={styles.profileDetail}>
                <Globe size={14} color="#666" />
                <Text style={styles.profileDetailText}>alexmorgan.photo</Text>
              </View>
              <View style={styles.profileDetail}>
                <Calendar size={14} color="#666" />
                <Text style={styles.profileDetailText}>Joined June 2022</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#007AFF" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          {STATS.map((stat, index) => (
            <View 
              key={index} 
              style={[
                styles.statItem,
                index < STATS.length - 1 && styles.statItemWithBorder
              ]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.activeTabButton
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Icon 
                  size={18} 
                  color={activeTab === tab.id ? "#007AFF" : "#8E8E93"} 
                />
                <Text 
                  style={[
                    styles.tabLabel,
                    activeTab === tab.id && styles.activeTabLabel
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.galleryContainer}>
          {GALLERY.map((imageUrl, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.galleryItem}
              activeOpacity={0.9}
            >
              <Image 
                source={{ uri: imageUrl }}
                style={styles.galleryImage}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  profileHeader: {
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  profileDetails: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  profileDetailText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 5,
  },
  editButtonText: {
    color: '#007AFF',
    fontFamily: 'SpaceMono',
    fontSize: 14,
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItemWithBorder: {
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    color: '#8E8E93',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabLabel: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'SpaceMono',
    color: '#8E8E93',
  },
  activeTabLabel: {
    color: '#007AFF',
    fontFamily: 'SpaceMono-Bold',
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  galleryItem: {
    width: '32%',
    aspectRatio: 1,
    margin: '0.65%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
});