import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Moon,
  Bell,
  Globe,
  Lock,
  HelpCircle,
  LogOut,
  Shield,
  User,
  Palette
} from 'lucide-react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleLocationServices = () => setLocationServices(previousState => !previousState);

  const renderSettingItem = ({ icon: Icon, title, hasSwitch, switchValue, onToggle, showArrow = true }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Icon size={20} color="#007AFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {hasSwitch ? (
          <Switch
            trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
            thumbColor={switchValue ? '#FFFFFF' : '#FFFFFF'}
            ios_backgroundColor="#D1D1D6"
            onValueChange={onToggle}
            value={switchValue}
          />
        ) : (
          showArrow && (
            <ChevronRight size={20} color="#C7C7CC" />
          )
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: User,
              title: 'Personal Information',
              hasSwitch: false,
            })}
            {renderSettingItem({
              icon: Lock,
              title: 'Privacy & Security',
              hasSwitch: false,
            })}
            {renderSettingItem({
              icon: Shield,
              title: 'Data & Permissions',
              hasSwitch: false,
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: Moon,
              title: 'Dark Mode',
              hasSwitch: true,
              switchValue: darkMode,
              onToggle: toggleDarkMode,
              showArrow: false,
            })}
            {renderSettingItem({
              icon: Bell,
              title: 'Notifications',
              hasSwitch: true,
              switchValue: notifications,
              onToggle: toggleNotifications,
              showArrow: false,
            })}
            {renderSettingItem({
              icon: Globe,
              title: 'Location Services',
              hasSwitch: true,
              switchValue: locationServices,
              onToggle: toggleLocationServices,
              showArrow: false,
            })}
            {renderSettingItem({
              icon: Palette,
              title: 'Appearance',
              hasSwitch: false,
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            {renderSettingItem({
              icon: HelpCircle,
              title: 'Help & Support',
              hasSwitch: false,
            })}
            {renderSettingItem({
              icon: Globe,
              title: 'Terms of Service',
              hasSwitch: false,
            })}
            {renderSettingItem({
              icon: Shield,
              title: 'Privacy Policy',
              hasSwitch: false,
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#F7F7F7',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Bold',
    color: '#222',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
    color: '#8E8E93',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    color: '#222',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
    color: '#FF3B30',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'SpaceMono',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
});