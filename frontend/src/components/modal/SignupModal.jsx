import React, { useState } from 'react';
import Input from './Input';
import { X, UserPlus, FileText } from 'lucide-react';

const SignupModal = ({ onLoginClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('남성');
  const [terms, setTerms] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserPlus className="w-5 h-5 text-blue-600" />
          </div>
          회원가입
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
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 -mx-1 login-scrollbar">
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

          <Input
            label="이름"
            id="name"
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="나이"
              id="age"
              type="number"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">성별</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium appearance-none"
                style={{ backgroundImage: 'none' }} // Remove default arrow if needed, or keep for UX
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>

          {/* 이용약관 및 개인정보 처리방침 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </div>
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
              <span className="font-bold text-slate-800">이용약관</span> 및 <span className="font-bold text-slate-800">개인정보 처리방침</span>에 동의합니다.
            </label>
          </div>
        </div>
        {/* 회원가입 버튼 */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
          >
            회원가입
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
          이미 계정이 있으신가요? <button onClick={onLoginClick} className="text-blue-500 font-bold hover:underline">로그인</button>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
