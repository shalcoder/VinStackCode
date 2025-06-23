import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Settings, Crown, Shield, Edit, Eye, Mail, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { Database } from '../../types/database';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamMember = Database['public']['Tables']['team_members']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

const TeamManagement: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamMembers(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .or(`owner_id.eq.${user?.id},id.in.(${await getUserTeamIds()})`);

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserTeamIds = async () => {
    const { data } = await supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user?.id);
    
    return data?.map(tm => tm.team_id).join(',') || '';
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles!team_members_user_id_fkey(username, avatar_url, full_name)
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const createTeam = async () => {
    if (!user || !newTeamName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: newTeamName.trim(),
          description: newTeamDescription.trim() || null,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Add owner as team member
      await supabase
        .from('team_members')
        .insert({
          team_id: data.id,
          user_id: user.id,
          role: 'owner',
        });

      setTeams(prev => [data, ...prev]);
      setIsCreateModalOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  const inviteMember = async () => {
    if (!selectedTeam || !inviteEmail.trim()) return;

    try {
      // Find user by email
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteEmail.trim())
        .single();

      if (profileError) {
        alert('User not found');
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', selectedTeam.id)
        .eq('user_id', profile.id)
        .single();

      if (existingMember) {
        alert('User is already a team member');
        return;
      }

      // Add team member
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: selectedTeam.id,
          user_id: profile.id,
          role: inviteRole,
        });

      if (error) throw error;

      // Send notification
      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'collaboration',
          title: 'Team Invitation',
          message: `You've been invited to join the team "${selectedTeam.name}"`,
          data: { team_id: selectedTeam.id, role: inviteRole },
        });

      await fetchTeamMembers(selectedTeam.id);
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteRole('member');
    } catch (err) {
      console.error('Error inviting member:', err);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setTeamMembers(prev =>
        prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
      );
    } catch (err) {
      console.error('Error updating member role:', err);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'member':
        return <Edit className="w-4 h-4 text-green-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const canManageTeam = (team: Team) => {
    return team.owner_id === user?.id;
  };

  const canManageMember = (member: TeamMember) => {
    if (!selectedTeam || !user) return false;
    return selectedTeam.owner_id === user.id && member.user_id !== user.id;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 mt-1">Manage your teams and collaborate with others</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-semibold text-white mb-4">Your Teams</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedTeam(team)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTeam?.id === team.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{team.name}</h3>
                    {team.description && (
                      <p className="text-sm text-gray-400 mt-1">{team.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {teamMembers.length} members
                      </span>
                      {canManageTeam(team) && (
                        <Crown className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {teams.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No teams yet</p>
                <p className="text-sm">Create your first team to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Team Details */}
        <div className="lg:col-span-2">
          {selectedTeam ? (
            <div className="space-y-6">
              {/* Team Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedTeam.name}</h2>
                  {selectedTeam.description && (
                    <p className="text-gray-400 mt-1">{selectedTeam.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {canManageTeam(selectedTeam) && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsInviteModalOpen(true)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Invite Member
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  Members ({teamMembers.length})
                </h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {member.profiles.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">
                              {member.profiles.full_name || member.profiles.username}
                            </span>
                            {getRoleIcon(member.role)}
                          </div>
                          <span className="text-sm text-gray-400 capitalize">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      {canManageMember(member) && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.id, e.target.value as any)}
                            className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white"
                          >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a team to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Team"
      >
        <div className="space-y-4">
          <Input
            label="Team Name"
            placeholder="Enter team name..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="Describe your team..."
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={createTeam}
              disabled={!newTeamName.trim()}
            >
              Create Team
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <div className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            >
              <option value="admin">Admin - Can manage team and members</option>
              <option value="member">Member - Can create and edit snippets</option>
              <option value="viewer">Viewer - Can only view snippets</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={inviteMember}
              disabled={!inviteEmail.trim()}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeamManagement;