import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, GitBranch, User, Calendar, Eye, RotateCcw, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { formatRelativeTime } from '../../utils';
import Button from '../ui/Button';
import CodeEditor from '../editor/CodeEditor';
import LoadingSpinner from '../ui/LoadingSpinner';

type SnippetVersion = Database['public']['Tables']['snippet_versions']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'] | null;
};

interface VersionHistoryProps {
  snippetId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: SnippetVersion) => void;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  snippetId,
  isOpen,
  onClose,
  onRestore,
}) => {
  const [versions, setVersions] = useState<SnippetVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<SnippetVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<SnippetVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'view' | 'compare'>('list');

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, snippetId]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('snippet_versions')
        .select(`
          *,
          profiles!snippet_versions_author_id_fkey(username, avatar_url)
        `)
        .eq('snippet_id', snippetId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err) {
      console.error('Error fetching versions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVersion = (version: SnippetVersion) => {
    setSelectedVersion(version);
    setViewMode('view');
  };

  const handleCompareVersions = (version: SnippetVersion) => {
    if (!compareVersion) {
      setCompareVersion(version);
    } else {
      setSelectedVersion(version);
      setViewMode('compare');
    }
  };

  const handleRestore = (version: SnippetVersion) => {
    if (window.confirm(`Are you sure you want to restore to version ${version.version_number}?`)) {
      onRestore(version);
      onClose();
    }
  };

  const renderVersionList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Version History</h3>
        {compareVersion && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCompareVersion(null);
              setSelectedVersion(null);
            }}
          >
            Cancel Compare
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {versions.map((version) => (
            <motion.div
              key={version.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border transition-all ${
                compareVersion?.id === version.id
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="w-4 h-4 text-primary-500" />
                      <span className="font-medium text-white">
                        Version {version.version_number}
                      </span>
                    </div>
                    {version.profiles && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <User className="w-3 h-3" />
                        <span>{version.profiles.username}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatRelativeTime(new Date(version.created_at))}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-200 mb-1">{version.title}</h4>
                  {version.description && (
                    <p className="text-sm text-gray-400 mb-2">{version.description}</p>
                  )}
                  {version.change_message && (
                    <p className="text-sm text-gray-300 italic">"{version.change_message}"</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewVersion(version)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCompareVersions(version)}
                    className={compareVersion?.id === version.id ? 'bg-yellow-500/20' : ''}
                  >
                    Compare
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestore(version)}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderVersionView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
            ← Back
          </Button>
          <h3 className="text-lg font-semibold text-white">
            Version {selectedVersion?.version_number}
          </h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => selectedVersion && handleRestore(selectedVersion)}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restore This Version
        </Button>
      </div>

      {selectedVersion && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium text-white mb-2">{selectedVersion.title}</h4>
            {selectedVersion.description && (
              <p className="text-gray-300 mb-2">{selectedVersion.description}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {selectedVersion.profiles && (
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{selectedVersion.profiles.username}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{formatRelativeTime(new Date(selectedVersion.created_at))}</span>
              </div>
            </div>
            {selectedVersion.change_message && (
              <p className="text-sm text-gray-300 italic mt-2">
                "{selectedVersion.change_message}"
              </p>
            )}
          </div>

          <CodeEditor
            value={selectedVersion.content}
            onChange={() => {}}
            language="javascript"
            readOnly={true}
            height="400px"
          />
        </div>
      )}
    </div>
  );

  const renderVersionCompare = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setViewMode('list')}>
            ← Back
          </Button>
          <h3 className="text-lg font-semibold text-white">Compare Versions</h3>
        </div>
      </div>

      {compareVersion && selectedVersion && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2">
              Version {compareVersion.version_number}
            </h4>
            <CodeEditor
              value={compareVersion.content}
              onChange={() => {}}
              language="javascript"
              readOnly={true}
              height="400px"
            />
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">
              Version {selectedVersion.version_number}
            </h4>
            <CodeEditor
              value={selectedVersion.content}
              onChange={() => {}}
              language="javascript"
              readOnly={true}
              height="400px"
            />
          </div>
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-6xl rounded-lg bg-gray-900 border border-gray-700 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-primary-500" />
              <h2 className="text-xl font-semibold text-white">Version History</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {viewMode === 'list' && renderVersionList()}
            {viewMode === 'view' && renderVersionView()}
            {viewMode === 'compare' && renderVersionCompare()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VersionHistory;