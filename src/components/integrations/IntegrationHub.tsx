import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, GitBranch, Code, Slack, Zap, Settings, Check, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { Database } from '../../types/database';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

type Integration = Database['public']['Tables']['integrations']['Row'];

interface AvailableIntegration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  isPopular?: boolean;
  comingSoon?: boolean;
}

const IntegrationHub: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<AvailableIntegration | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const availableIntegrations: AvailableIntegration[] = [
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sync snippets with GitHub repositories and gists',
      icon: <Github className="w-6 h-6" />,
      color: 'bg-gray-800',
      features: [
        'Sync snippets to GitHub Gists',
        'Import code from repositories',
        'Automatic backup to GitHub',
        'Webhook notifications',
      ],
      isPopular: true,
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      description: 'Connect with GitLab for seamless code management',
      icon: <GitBranch className="w-6 h-6" />,
      color: 'bg-orange-600',
      features: [
        'GitLab snippet integration',
        'Repository code import',
        'CI/CD pipeline integration',
        'Merge request snippets',
      ],
    },
    {
      id: 'vscode',
      name: 'VS Code',
      description: 'Access snippets directly in Visual Studio Code',
      icon: <Code className="w-6 h-6" />,
      color: 'bg-blue-600',
      features: [
        'VS Code extension',
        'Quick snippet insertion',
        'Sync with workspace',
        'IntelliSense integration',
      ],
      isPopular: true,
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Share snippets and get notifications in Slack',
      icon: <Slack className="w-6 h-6" />,
      color: 'bg-purple-600',
      features: [
        'Share snippets in channels',
        'Notification alerts',
        'Team collaboration',
        'Slash commands',
      ],
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with 3000+ apps',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-yellow-600',
      features: [
        'Workflow automation',
        'Trigger actions',
        'Connect with 3000+ apps',
        'Custom integrations',
      ],
      comingSoon: true,
    },
  ];

  useEffect(() => {
    if (user) {
      fetchIntegrations();
    }
  }, [user]);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setIntegrations(data || []);
    } catch (err) {
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const isIntegrationConnected = (integrationId: string) => {
    return integrations.some(i => i.provider === integrationId && i.is_active);
  };

  const handleConnect = (integration: AvailableIntegration) => {
    if (integration.comingSoon) return;
    
    setSelectedIntegration(integration);
    setIsConfigModalOpen(true);
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this integration?')) return;

    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: false })
        .eq('provider', integrationId)
        .eq('user_id', user?.id);

      if (error) throw error;
      await fetchIntegrations();
    } catch (err) {
      console.error('Error disconnecting integration:', err);
    }
  };

  const mockConnect = async () => {
    if (!selectedIntegration || !user) return;

    try {
      // Mock OAuth flow - in production, this would redirect to the actual OAuth provider
      const { error } = await supabase
        .from('integrations')
        .upsert({
          user_id: user.id,
          provider: selectedIntegration.id as any,
          external_id: `mock_${Date.now()}`,
          access_token: 'mock_token',
          config: {
            connected_at: new Date().toISOString(),
            features_enabled: selectedIntegration.features,
          },
          is_active: true,
        });

      if (error) throw error;

      await fetchIntegrations();
      setIsConfigModalOpen(false);
      setSelectedIntegration(null);
    } catch (err) {
      console.error('Error connecting integration:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Integration Hub</h1>
        <p className="text-gray-400 mt-1">
          Connect VinStackCode with your favorite tools and services
        </p>
      </div>

      {/* Connected Integrations */}
      {integrations.filter(i => i.is_active).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Connected Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations
              .filter(i => i.is_active)
              .map((integration) => {
                const config = availableIntegrations.find(ai => ai.id === integration.provider);
                if (!config) return null;

                return (
                  <motion.div
                    key={integration.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-800 border border-green-500 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color} text-white`}>
                          {config.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{config.name}</h3>
                          <p className="text-xs text-green-400">Connected</p>
                        </div>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Last sync: {new Date(integration.last_sync_at || integration.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(integration.provider)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableIntegrations.map((integration) => {
            const isConnected = isIntegrationConnected(integration.id);
            
            return (
              <motion.div
                key={integration.id}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-lg border transition-all ${
                  isConnected
                    ? 'border-green-500 bg-green-500/10'
                    : integration.comingSoon
                    ? 'border-gray-700 bg-gray-800 opacity-60'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${integration.color} text-white`}>
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{integration.name}</h3>
                      {integration.isPopular && (
                        <span className="inline-block px-2 py-0.5 bg-primary-600 text-primary-100 text-xs rounded-full mt-1">
                          Popular
                        </span>
                      )}
                      {integration.comingSoon && (
                        <span className="inline-block px-2 py-0.5 bg-yellow-600 text-yellow-100 text-xs rounded-full mt-1">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isConnected && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{integration.description}</p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {integration.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {integration.features.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{integration.features.length - 3} more features
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant={isConnected ? "outline" : "primary"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleConnect(integration)}
                  disabled={integration.comingSoon}
                >
                  {integration.comingSoon ? (
                    'Coming Soon'
                  ) : isConnected ? (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Integration Configuration Modal */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title={`Connect ${selectedIntegration?.name}`}
      >
        {selectedIntegration && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${selectedIntegration.color} text-white`}>
                {selectedIntegration.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedIntegration.name}
                </h3>
                <p className="text-gray-400">{selectedIntegration.description}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-3">Features you'll get:</h4>
              <div className="space-y-2">
                {selectedIntegration.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                <strong>Note:</strong> This is a demo integration. In production, you would be redirected to {selectedIntegration.name} to authorize the connection.
              </p>
              <p className="text-xs text-gray-400">
                Your data will be securely synced and you can disconnect at any time.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsConfigModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={mockConnect}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect to {selectedIntegration.name}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default IntegrationHub;