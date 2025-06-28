import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <X size={22} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />
      <Text style={styles.description}>
        This is a modal screen. It can be used for showing detailed content, forms, or confirmations without navigating away from the current context.
      </Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Dismiss</Text>
      </TouchableOpacity>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceMono-Bold',
    marginBottom: 20,
  },
  separator: {
    height: 2,
    width: 60,
    backgroundColor: '#007AFF',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: '#666',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
  },
});