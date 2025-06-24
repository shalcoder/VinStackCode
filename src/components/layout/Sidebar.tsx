import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Plus, 
  Search, 
  Star, 
  Archive, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Crown,
  CreditCard,
  Gamepad2
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'my-snippets', label: 'My Snippets', icon: Code2 },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'game', label: 'Coding Game', icon: Gamepad2 },
  ];

  const handleLogout = () => {
    logout();
  };

  const getPlanBadge = () => {
    const plan = user?.subscription?.plan || 'free';
    switch (plan) {
      case 'pro':
        return { label: 'Pro', color: 'bg-yellow-600', icon: Crown };
      case 'team':
        return { label: 'Team', color: 'bg-purple-600', icon: Crown };
      default:
        return { label: 'Free', color: 'bg-gray-600', icon: null };
    }
  };

  const planBadge = getPlanBadge();
  const PlanIcon = planBadge.icon;

  const handleTabClick = (tabId: string) => {
    if (tabId === 'game') {
      navigate('/game');
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 border-r border-gray-700 h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-primary-500" />
              <h1 className="text-xl font-bold text-white">VinStack</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button
          variant="primary"
          size="md"
          onClick={() => onTabChange('create')}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {!isCollapsed && 'New Snippet'}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'game' && window.location.pathname === '/game');
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-full flex items-center px-3 py-2 mb-1 rounded-lg text-left transition-colors
                ${isActive 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
                ${item.id === 'game' ? 'relative' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {item.id === 'game' && (
                <span className="absolute right-2 top-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded-full">
                  New
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        {user && (
          <div className="space-y-2">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-white truncate">
                      {user.username}
                    </p>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1 ${planBadge.color}`}>
                      {PlanIcon && <PlanIcon className="w-3 h-3" />}
                      <span>{planBadge.label}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('pricing')}
                className="flex-1"
                title="Upgrade Plan"
              >
                <CreditCard className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Upgrade</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange('settings')}
                className="flex-1"
              >
                <Settings className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Settings</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex-1"
              >
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span className="ml-2">Logout</span>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;