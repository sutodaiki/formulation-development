import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} [貴社名] Inc. All rights reserved.</p>
        <p className="text-xs mt-1">
          免責事項: AIが生成した処方は研究開発目的のものです。
          商用利用の前に、専門家による検証と安全性試験が必要です。
        </p>
      </div>
    </footer>
  );
};

export default Footer;