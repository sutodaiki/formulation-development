import React from 'react';
import { BeakerIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="text-teal-600">
            <BeakerIcon className="w-8 h-8"/>
        </div>
        <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
          化粧品処方開発 <span className="text-teal-600">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;