
import { useState, useContext } from 'react';
import Input from './Input';
import { X, LogIn } from 'lucide-react';

import AuthContext from '../../store/auth-context';
import { API_BASE_URL } from '../../config/api';


const LoginModal = ({ onSignupClick, onClose }) => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/main/logIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();
      if (resData.state === 'success') {
        authContext.login(resData.accessToken);
        onClose();
      } else {
        setError(resData.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

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
      <form className="space-y-4" onSubmit={handleLogin}>
        <Input
          label="이메일"
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <Input
          label="비밀번호"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        {error && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                로그인 중...
              </>
            ) : (
              '로그인하기'
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          계정이 없으신가요? <button onClick={onSignupClick} className="text-blue-500 font-bold hover:underline" disabled={isLoading}>회원가입</button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;