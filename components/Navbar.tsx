import React from 'react';
import { Users, Gift, Edit3 } from 'lucide-react';
import { AppMode } from '../types';

interface NavbarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  count: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, setMode, count }) => {
  const navItems = [
    { mode: AppMode.INPUT, label: '名單管理', icon: Edit3 },
    { mode: AppMode.DRAW, label: '幸運抽籤', icon: Gift },
    { mode: AppMode.GROUPS, label: '自動分組', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600 tracking-tight">HR 小幫手</span>
            <span className="ml-4 text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 hidden sm:inline-block">
              {count} 人員
            </span>
          </div>
          <div className="flex space-x-2 sm:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                  currentMode === item.mode
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <item.icon className={`w-4 h-4 mr-2 ${currentMode === item.mode ? 'text-indigo-500' : 'text-gray-400'}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.label.slice(0, 2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
