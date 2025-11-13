
import React from 'react';
import { EyeIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg w-full sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
        <EyeIcon className="h-8 w-8 text-blue-400 mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
          VisionAI
        </h1>
      </div>
    </header>
  );
};

export default Header;
