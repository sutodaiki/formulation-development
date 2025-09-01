
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-gray-700">AIが処方を考案中です...</p>
      <p className="text-sm text-gray-500">最適な成分を配合しています。しばらくお待ちください。</p>
    </div>
  );
};

export default Loader;
