import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, MessageCircle, Plus, X, Play } from 'lucide-react';
import Button from '../ui/Button';
import TavusVideoGenerator from './TavusVideoGenerator';
import VideoPlayer from './VideoPlayer';

interface TavusVideoCommentsProps {
  snippetId: string;
  snippetTitle: string;
  snippetCode: string;
  snippetLanguage: string;
  comments: any[];
  onAddComment: (content: string) => void;
}

const TavusVideoComments: React.FC<TavusVideoCommentsProps> = ({
  snippetId,
  snippetTitle,
  snippetCode,
  snippetLanguage,
  comments,
  onAddComment,
}) => {
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [videoTutorials, setVideoTutorials] = useState<string[]>([]);

  const handleVideoGenerated = (videoUrl: string) => {
    setVideoTutorials(prev => [...prev, videoUrl]);
    
    // Add a comment about the generated video
    onAddComment(`🎥 I've generated an AI video tutorial explaining this ${snippetLanguage} code! Check it out above.`);
  };

  return (
    <div className="space-y-6">
      {/* Video Tutorials Section */}
      {(videoTutorials.length > 0 || showVideoGenerator) && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Video className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-white">AI Video Tutorials</h3>
            </div>
            {!showVideoGenerator && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowVideoGenerator(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Tutorial
              </Button>
            )}
          </div>

          {/* Video Generator */}
          {showVideoGenerator && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <TavusVideoGenerator
                snippetId={snippetId}
                snippetTitle={snippetTitle}
                snippetCode={snippetCode}
                snippetLanguage={snippetLanguage}
                onVideoGenerated={handleVideoGenerated}
              />
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideoGenerator(false)}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Generated Videos */}
          {videoTutorials.length > 0 && (
            <div className="space-y-4">
              {videoTutorials.map((videoUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aspect-video"
                >
                  <VideoPlayer
                    src={videoUrl}
                    title={`${snippetTitle} - Tutorial ${index + 1}`}
                    className="w-full h-full"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {videoTutorials.length === 0 && !showVideoGenerator && (
            <div className="text-center py-8 text-gray-400">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No video tutorials yet</p>
              <p className="text-sm">Generate an AI-powered explanation of this code</p>
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-white">
              Comments ({comments.length})
            </h3>
          </div>
          {videoTutorials.length === 0 && !showVideoGenerator && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVideoGenerator(true)}
            >
              <Video className="w-4 h-4 mr-2" />
              Add Video Tutorial
            </Button>
          )}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {comment.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-white">
                      {comment.author.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No comments yet</p>
              <p className="text-sm">Start the discussion or add a video tutorial</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TavusVideoComments;