import { useState, useEffect } from 'react';
import Input from './Input';
import { X, UserPlus, Loader2 } from 'lucide-react';

const SignupModal = ({ onLoginClick, onClose }) => {
  // form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 0,
    terms: false,
  });

  // email certificate
  const [isEmailCertified, setIsEmailCertified] = useState(false);
  const [isEmailCertificating, setIsEmailCertificating] = useState(false);
  const [certificationNumber, setCertificationNumber] = useState('');

  // UX states
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isRequesting, setIsRequesting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailVerifyError, setEmailVerifyError] = useState('');

  // validation errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // input handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
    if (apiError) setApiError('');
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (isEmailCertificating && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time expired logic if needed
      setIsEmailCertificating(false); // Disable verification input
      setApiError("인증 시간이 만료되었습니다. 다시 요청해주세요.");
    }
    return () => clearInterval(timer);
  }, [isEmailCertificating, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // 회원가입 요청
  const handleSignup = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!isEmailCertified) {
      newErrors.email = "이메일 인증을 완료해 주세요.";
    }

    // 유효성 검사
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!formData.password || !passwordRegex.test(formData.password)) {
      newErrors.password = "비밀번호는 8자 이상이어야 하며, 특수문자를 포함해야 합니다.";
    }

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = "이름을 입력해 주세요.";
    }

    if (!formData.age || formData.age.toString().trim() === '') {
      newErrors.age = "나이를 입력해 주세요.";
    }

    if (!formData.terms) {
      newErrors.terms = "이용약관에 동의해 주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/main/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
        // 필요시 로그인 모달로 전환 로직 추가
      } else {
        setApiError(data.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setApiError("서버 연결 중 오류가 발생했습니다.");
    }
  };

  // certification
  // 인증요청
  const handleSentCertification = async () => {
    if (isRequesting) return;
    setIsRequesting(true);
    setApiError(''); // clear previous errors

    try {
      const response = await fetch('http://localhost:3000/main/sendEmailCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();
      if (resData.state === 'success') {
        alert(resData.message);
        setIsEmailCertificating(true);
        setTimeLeft(300); // Reset timer to 5 minutes
        setErrors((prev) => ({ ...prev, email: null })); // Clear email errors
      } else {
        setIsEmailCertificating(false);
        setErrors((prev) => ({ ...prev, email: resData.message || "이메일 인증에 실패했습니다." }));
      }
    } catch (error) {
      console.error("Certification Error:", error);
      setIsEmailCertificating(false);
      setErrors((prev) => ({ ...prev, email: "서버 연결 중 오류가 발생했습니다." }));
    } finally {
      setIsRequesting(false);
    }
  }

  // 인증 확인
  const handleCertification = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setEmailVerifyError('');

    try {
      const response = await fetch('http://localhost:3000/main/verify_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: certificationNumber,
        }),
      });

      const resData = await response.json();
      if (resData.state === 'success') {
        setIsEmailCertified(true);
        setIsEmailCertificating(false); // Stop timer and hide input
        setEmailVerifyError('');
      } else {
        setEmailVerifyError(resData.message || "이메일 인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("Certification Error:", error);
      setEmailVerifyError("서버 연결 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  }

  const handleCertificationNumberChange = (e) => {
    setCertificationNumber(e.target.value);
    if (emailVerifyError) setEmailVerifyError('');
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
      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 -mx-1 login-scrollbar">
          <Input
            label="이메일"
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange(e)}
            error={errors.email}
          >
            <button
              type="button"
              className={`text-blue-500 font-bold hover:underline text-sm flex items-center justify-center min-w-[48px]` + ((isEmailCertificating || isRequesting) ? ' opacity-50 cursor-not-allowed' : '')}
              disabled={isEmailCertificating || isRequesting}
              onClick={handleSentCertification}
            >
              {isRequesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEmailCertificating ? (
                <span className="text-xs font-mono">{formatTime(timeLeft)}</span>
              ) : (
                "요청"
              )}
            </button>
          </Input>

          {/* 인증번호 입력 칸 */}
          {isEmailCertificating && (
            <Input
              id="certification"
              type="text"
              placeholder="인증번호를 입력해 주세요."
              value={certificationNumber}
              onChange={(e) => handleCertificationNumberChange(e)}
              error={emailVerifyError}
            >
              <button
                type="button"
                className="text-blue-500 font-bold hover:underline text-sm w-12 flex items-center justify-center"
                onClick={handleCertification}
                disabled={isVerifying}
              >
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "인증"}
              </button>
            </Input>
          )}

          {isEmailCertified && (
            <div className="text-blue-500 font-bold text-sm ml-2 flex items-center gap-1">
              이메일 인증이 완료되었습니다.
            </div>
          )}

          <Input
            label="비밀번호"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleInputChange(e)}
            error={errors.password}
          />

          <Input
            label="이름"
            id="name"
            name="name"
            type="text"
            placeholder="홍길동"
            value={formData.name}
            onChange={(e) => handleInputChange(e)}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="나이"
              id="age"
              name="age"
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => handleInputChange(e)}
              error={errors.age}
            />

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5 ml-1">성별</label>
              <select
                id="gender"
                name="gender"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium appearance-none"
                style={{ backgroundImage: 'none' }} // Remove default arrow if needed, or keep for UX
                value={formData.gender}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="1">남성</option>
                <option value="0">여성</option>
              </select>
            </div>
          </div>

          {/* 이용약관 및 개인정보 처리방침 */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
                checked={formData.terms}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
              <span className="font-bold text-slate-800">이용약관</span> 및 <span className="font-bold text-slate-800">개인정보 처리방침</span>에 동의합니다.
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.terms}</p>
          )}
        </div>
        {apiError && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg mt-4">
            {apiError}
          </div>
        )}

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
