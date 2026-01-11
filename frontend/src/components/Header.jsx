import React, { useContext } from 'react';
import { Layout, RefreshCcw } from 'lucide-react';
import AuthContext from '../store/auth-context';

const Header = ({ onReset, handleLoginModalOpen }) => {
  const authcontext = useContext(AuthContext);
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* logo container */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Layout className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-blue-900">HairScan AI</h1>
        </div>
        {/* button container */}
        <div className="flex items-center gap-4">
          <button onClick={onReset} className="text-slate-400 hover:text-blue-500 transition-colors" aria-label="Reset">
            <RefreshCcw className="w-5 h-5" />
          </button>
          {!authcontext.isLoggedIn ? <button onClick={handleLoginModalOpen} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-black transition-colors text-sm">
            로그인
          </button> : <button onClick={authcontext.logout} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-black transition-colors text-sm">
            로그아웃
          </button>}
        </div>
      </div>
    </header>
  );
};

export default Header;
