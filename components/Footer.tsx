import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-6 text-center text-sm text-gray-400 border-t border-gray-100 bg-white">
      <p>HR 工具箱 &copy; {new Date().getFullYear()} - Designed for Efficiency</p>
    </footer>
  );
};
