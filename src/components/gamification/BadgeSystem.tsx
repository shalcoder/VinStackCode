import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Trophy, Target, Zap, Crown, Shield, Heart } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirement: number;
  category: 'snippets' | 'social' | 'collaboration' | 'quality';
  earned?: boolean;
  earnedAt?: string;
  progress?: number;
}

interface BadgeSystemProps {
  userStats: {
    snippetsCount: number;
    likesReceived: number;
    followersCount: number;
    collaborationsCount: number;
  };
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ userStats }) => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newlyEarned, setNewlyEarned] = useState<Badge[]>([]);

  const allBadges: Badge[] = [
    // Snippet Creation Badges
    {
      id: 'first-snippet',
      name: 'First Steps',
      description: 'Created your first snippet',
      icon: <Star className="w-6 h-6" />,
      color: 'text-yellow-500',
      requirement: 1,
      category: 'snippets',
    },
    {
      id: 'snippet-creator',
      name: 'Code Creator',
      description: 'Created 10 snippets',
      icon: <Award className="w-6 h-6" />,
      color: 'text-blue-500',
      requirement: 10,
      category: 'snippets',
    },
    {
      id: 'prolific-coder',
      name: 'Prolific Coder',
      description: 'Created 50 snippets',
      icon: <Trophy className="w-6 h-6" />,
      color: 'text-purple-500',
      requirement: 50,
      category: 'snippets',
    },
    {
      id: 'code-master',
      name: 'Code Master',
      description: 'Created 100 snippets',
      icon: <Crown className="w-6 h-6" />,
      color: 'text-yellow-600',
      requirement: 100,
      category: 'snippets',
    },

    // Social Badges
    {
      id: 'first-like',
      name: 'Appreciated',
      description: 'Received your first like',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-red-500',
      requirement: 1,
      category: 'social',
    },
    {
      id: 'popular',
      name: 'Popular',
      description: 'Received 25 likes',
      icon: <Star className="w-6 h-6" />,
      color: 'text-pink-500',
      requirement: 25,
      category: 'social',
    },
    {
      id: 'influencer',
      name: 'Influencer',
      description: 'Have 10 followers',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-orange-500',
      requirement: 10,
      category: 'social',
    },

    // Collaboration Badges
    {
      id: 'collaborator',
      name: 'Team Player',
      description: 'Participated in 5 collaborations',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-green-500',
      requirement: 5,
      category: 'collaboration',
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Helped others in 20 collaborations',
      icon: <Target className="w-6 h-6" />,
      color: 'text-indigo-500',
      requirement: 20,
      category: 'collaboration',
    },
  ];

  useEffect(() => {
    if (user) {
      checkBadgeProgress();
    }
  }, [user, userStats]);

  const checkBadgeProgress = () => {
    const updatedBadges = allBadges.map(badge => {
      let progress = 0;
      let earned = false;

      switch (badge.id) {
        case 'first-snippet':
        case 'snippet-creator':
        case 'prolific-coder':
        case 'code-master':
          progress = userStats.snippetsCount;
          earned = progress >= badge.requirement;
          break;
        case 'first-like':
        case 'popular':
          progress = userStats.likesReceived;
          earned = progress >= badge.requirement;
          break;
        case 'influencer':
          progress = userStats.followersCount;
          earned = progress >= badge.requirement;
          break;
        case 'collaborator':
        case 'mentor':
          progress = userStats.collaborationsCount;
          earned = progress >= badge.requirement;
          break;
      }

      return {
        ...badge,
        earned,
        progress: Math.min(progress, badge.requirement),
      };
    });

    // Check for newly earned badges
    const previouslyEarned = badges.filter(b => b.earned).map(b => b.id);
    const currentlyEarned = updatedBadges.filter(b => b.earned).map(b => b.id);
    const newBadges = updatedBadges.filter(b => 
      b.earned && !previouslyEarned.includes(b.id)
    );

    if (newBadges.length > 0) {
      setNewlyEarned(newBadges);
      // Auto-hide after 5 seconds
      setTimeout(() => setNewlyEarned([]), 5000);
    }

    setBadges(updatedBadges);
  };

  const getBadgesByCategory = (category: string) => {
    return badges.filter(badge => badge.category === category);
  };

  const getProgressPercentage = (badge: Badge) => {
    return Math.round((badge.progress || 0) / badge.requirement * 100);
  };

  const categories = [
    { id: 'snippets', name: 'Code Creation', icon: <Award className="w-4 h-4" /> },
    { id: 'social', name: 'Social', icon: <Heart className="w-4 h-4" /> },
    { id: 'collaboration', name: 'Collaboration', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Newly Earned Badges Notification */}
      <AnimatePresence>
        {newlyEarned.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-lg shadow-xl"
          >
            <div className="flex items-center space-x-3">
              <Trophy className="w-6 h-6" />
              <div>
                <h4 className="font-bold">Badge Earned!</h4>
                <p className="text-sm">
                  {newlyEarned.map(badge => badge.name).join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Categories */}
      {categories.map(category => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center space-x-2">
            {category.icon}
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getBadgesByCategory(category.id).map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border transition-all ${
                  badge.earned
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-700 bg-gray-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${badge.color} ${badge.earned ? '' : 'opacity-50'}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${badge.earned ? 'text-white' : 'text-gray-400'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      {badge.description}
                    </p>
                    
                    {!badge.earned && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.requirement}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(badge)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {badge.earned && (
                      <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                        <Trophy className="w-3 h-3" />
                        <span>Earned</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Overall Progress */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">
              {badges.filter(b => b.earned).length}
            </div>
            <div className="text-sm text-gray-400">Badges Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {userStats.snippetsCount}
            </div>
            <div className="text-sm text-gray-400">Snippets Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {userStats.likesReceived}
            </div>
            <div className="text-sm text-gray-400">Likes Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {userStats.followersCount}
            </div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;