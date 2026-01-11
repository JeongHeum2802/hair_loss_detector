import React, { useContext } from 'react';
import { Layout, RefreshCcw } from 'lucide-react';
import AuthContext from '../store/auth-context';

const Header = ({ onReset, handleLoginModalOpen, clearShowResult }) => {
  const authcontext = useContext(AuthContext);

  const handlelogout = () => {
    clearShowResult();
    authcontext.logout();
  }
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* logo container */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <Layout className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-blue-900 tracking-tight">HairScan AI</h1>
        </div>
        {/* button container */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={onReset} className="p-1.5 md:p-2 text-slate-400 hover:text-blue-500 transition-colors" aria-label="Reset">
            <RefreshCcw className="w-5 h-5 md:w-5 md:h-5" />
          </button>
          {!authcontext.isLoggedIn ? <button onClick={handleLoginModalOpen} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap">
            로그인
          </button> : <button onClick={handlelogout} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold transition-colors text-xs md:text-sm whitespace-nowrap">
            로그아웃
          </button>}
        </div>
      </div>
    </header>
  );
};

export default Header;
