
import { useState } from 'react';
import Input from './Input';
import { X, LogIn } from 'lucide-react';

const LoginModal = ({ onSignupClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <LogIn className="w-5 h-5 text-blue-600" />
          </div>
          로그인
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="이메일"
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="비밀번호"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
          >
            로그인하기
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          계정이 없으신가요? <button onClick={onSignupClick} className="text-blue-500 font-bold hover:underline">회원가입</button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;