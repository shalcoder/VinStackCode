import React from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../../store/authStore';
import Input from '../ui/Input';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, rightContent }) => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <Input
            type="text"
            placeholder="Search snippets, languages, tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="w-full"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4 ml-6">
          {rightContent}
          
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-300">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;