import React from 'react';
import { Layout, RefreshCcw } from 'lucide-react';

const Header = ({ onReset }) => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-blue-900">HairScan AI</h1>
        </div>
        <button onClick={onReset} className="text-slate-400 hover:text-blue-500 transition-colors">
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
