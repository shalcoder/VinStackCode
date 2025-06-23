import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Settings, Save, Key, User, Mic, Image, Palette, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../store/authStore';

interface TavusIntegrationSettingsProps {
  onSave?: (settings: TavusSettings) => void;
}

interface TavusSettings {
  apiKey: string;
  defaultAvatar: string;
  defaultVoice: string;
  defaultBackground: string;
  enableAutoGeneration: boolean;
  maxDuration: number;
  preferredLanguage: string;
}

const TavusIntegrationSettings: React.FC<TavusIntegrationSettingsProps> = ({
  onSave,
}) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TavusSettings>({
    apiKey: 'demo_key_for_hackathon',
    defaultAvatar: 'professional',
    defaultVoice: 'natural',
    defaultBackground: 'gradient',
    enableAutoGeneration: false,
    maxDuration: 5,
    preferredLanguage: 'english',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof TavusSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // In production, save to user profile or dedicated settings table
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave?.(settings);
      setSaved(true);
      
      // Reset saved status after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving Tavus settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Video className="w-6 h-6 text-primary-500" />
        <h2 className="text-xl font-semibold text-white">Tavus AI Integration Settings</h2>
      </div>

      <div className="space-y-6">
        {/* API Key */}
        <div>
          <Input
            label="Tavus API Key"
            type="password"
            value={settings.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            icon={<Key className="w-4 h-4" />}
            placeholder="Enter your Tavus API key"
          />
          <p className="text-xs text-gray-400 mt-1">
            For the hackathon, we're using a demo key. In production, you would use your own Tavus API key.
          </p>
        </div>

        {/* Avatar Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Default Avatar
          </label>
          <select
            value={settings.defaultAvatar}
            onChange={(e) => handleChange('defaultAvatar', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="professional">Professional (Business Attire)</option>
            <option value="casual">Casual (Relaxed Style)</option>
            <option value="technical">Technical (Developer Look)</option>
            <option value="custom">Custom Avatar</option>
          </select>
        </div>

        {/* Voice Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Mic className="w-4 h-4 inline mr-2" />
            Default Voice
          </label>
          <select
            value={settings.defaultVoice}
            onChange={(e) => handleChange('defaultVoice', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="natural">Natural (Conversational)</option>
            <option value="professional">Professional (Clear & Formal)</option>
            <option value="enthusiastic">Enthusiastic (Energetic)</option>
            <option value="calm">Calm (Relaxed & Steady)</option>
          </select>
        </div>

        {/* Background Settings */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Palette className="w-4 h-4 inline mr-2" />
            Default Background
          </label>
          <select
            value={settings.defaultBackground}
            onChange={(e) => handleChange('defaultBackground', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
          >
            <option value="gradient">Gradient (Professional)</option>
            <option value="office">Office Environment</option>
            <option value="code">Code Background</option>
            <option value="blur">Blurred (Minimal)</option>
            <option value="custom">Custom Background</option>
          </select>
        </div>

        {/* Additional Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-medium text-white">Additional Settings</h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Enable Auto-Generation</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={settings.enableAutoGeneration}
                onChange={(e) => handleChange('enableAutoGeneration', e.target.checked)}
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                  settings.enableAutoGeneration ? 'bg-primary-500' : 'bg-gray-600'
                }`}
                onClick={() => handleChange('enableAutoGeneration', !settings.enableAutoGeneration)}
              >
                <span
                  className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    settings.enableAutoGeneration ? 'transform translate-x-6' : 'transform translate-x-1'
                  }`}
                  style={{ top: '4px' }}
                />
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Maximum Video Duration (minutes)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.maxDuration}
              onChange={(e) => handleChange('maxDuration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 min</span>
              <span>{settings.maxDuration} min</span>
              <span>10 min</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Preferred Language
            </label>
            <select
              value={settings.preferredLanguage}
              onChange={(e) => handleChange('preferredLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="japanese">Japanese</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TavusIntegrationSettings;