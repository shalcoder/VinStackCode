import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserMinus, Users, Eye } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';

interface FollowSystemProps {
  targetUserId: string;
  targetUsername: string;
  showFollowersCount?: boolean;
}

const FollowSystem: React.FC<FollowSystemProps> = ({
  targetUserId,
  targetUsername,
  showFollowersCount = true,
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId) {
      checkFollowStatus();
      fetchFollowCounts();
    }
  }, [user, targetUserId]);

  const checkFollowStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking follow status:', error);
        return;
      }

      setIsFollowing(!!data);
    } catch (err) {
      console.error('Error checking follow status:', err);
    }
  };

  const fetchFollowCounts = async () => {
    try {
      // Get followers count
      const { count: followers } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      // Get following count
      const { count: following } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (err) {
      console.error('Error fetching follow counts:', err);
    }
  };

  const handleFollow = async () => {
    if (!user || user.id === targetUserId) return;

    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

        if (error) throw error;

        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        // Follow
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });

        if (error) throw error;

        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);

        // Create notification for the followed user
        await supabase
          .from('notifications')
          .insert({
            user_id: targetUserId,
            type: 'follow',
            title: 'New Follower',
            message: `${user.username} started following you`,
            data: { follower_id: user.id },
          });
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Don't show follow button for own profile
  if (user?.id === targetUserId) {
    return showFollowersCount ? (
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{followersCount} followers</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{followingCount} following</span>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="flex items-center space-x-4">
      {showFollowersCount && (
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{followersCount} followers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{followingCount} following</span>
          </div>
        </div>
      )}

      {user && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={isFollowing ? "outline" : "primary"}
            size="sm"
            onClick={handleFollow}
            disabled={loading}
            isLoading={loading}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FollowSystem;