import React, { useState, useContext, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import ImageUploadCard from './components/ImageUploadCard';
import AnalysisResult from './components/AnalysisResult';
import AuthModal from './components/modal/AuthModal';
import RecordList from './components/RecordList';

import { AuthContextProvider } from './store/auth-context';
import AuthContext from './store/auth-context';
import { AI_API_BASE_URL } from './config/api';

const App = () => {
  const authcontext = useContext(AuthContext);
  // ai state
  const [crownImage, setCrownImage] = useState(null); // 정수리 사진 (미리보기용)
  const [foreheadImage, setForeheadImage] = useState(null); // 이마 사진 (미리보기용)
  const [crownFile, setCrownFile] = useState(null); // 정수리 파일 (전송용)
  const [foreheadFile, setForeheadFile] = useState(null); // 이마 파일 (전송용)
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 중
  const [showResult, setShowResult] = useState(false); // 결과 표시
  const [resultData, setResultData] = useState(null); // 결과 데이터

  // authModal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // showResult 초기화 핸들러
  const clearShowResult = () => {
    setShowResult(false);
    setCrownImage(null);
    setForeheadImage(null);
    setCrownFile(null);
    setForeheadFile(null);
    setResultData(null);
  }

  // Data URL을 File 객체로 변환하는 유틸리티 함수
  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  // 컴포넌트 마운트 시 로컬 스토리지에서 이미지 복구
  useEffect(() => {
    const savedCrownKey = 'saved_crown_image';
    const savedForeheadKey = 'saved_forehead_image';

    const savedCrown = localStorage.getItem(savedCrownKey);
    const savedForehead = localStorage.getItem(savedForeheadKey);

    if (savedCrown) {
      setCrownImage(savedCrown);
      // Data URL을 File 객체로 변환하여 상태 복구
      const file = dataURLtoFile(savedCrown, 'restored_crown.jpg');
      setCrownFile(file);
    }

    if (savedForehead) {
      setForeheadImage(savedForehead);
      const file = dataURLtoFile(savedForehead, 'restored_forehead.jpg');
      setForeheadFile(file);
    }
  }, []);

  // 이미지 변경 핸들러
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'crown') {
          setCrownImage(reader.result);
          setCrownFile(file);
          localStorage.setItem('saved_crown_image', reader.result); // 저장
        }
        if (type === 'forehead') {
          setForeheadImage(reader.result);
          setForeheadFile(file);
          localStorage.setItem('saved_forehead_image', reader.result); // 저장
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 분석 실행 핸들러
  const runAnalysis = async () => {
    if (!crownFile || !foreheadFile) {
      alert("두 장의 사진을 모두 업로드해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);

    try {
      // 1. FormData 생성
      const foreheadFormData = new FormData();
      foreheadFormData.append("file", foreheadFile);

      const crownFormData = new FormData();
      crownFormData.append("file", crownFile);

      // 2. ai api 호출
      const [foreheadRes, crownRes] = await Promise.all([
        fetch(`${AI_API_BASE_URL}/predict/forehead`, {
          method: "POST",
          body: foreheadFormData,
        }),
        fetch(`${AI_API_BASE_URL}/predict/crown`, {
          method: "POST",
          body: crownFormData,
        }),
      ]);

      if (!foreheadRes.ok || !crownRes.ok) {
        throw new Error("서버 통신 오류가 발생했습니다.");
      }

      const foreheadData = await foreheadRes.json();
      const crownData = await crownRes.json();

      // 3. 결과 종합 (더 높은 확률을 기준으로 결과 표시)
      const maxProbability = Math.max(foreheadData.probability, crownData.probability);
      const worstCaseData = maxProbability === foreheadData.probability ? foreheadData : crownData;

      setResultData({
        probility: maxProbability,
        coment: worstCaseData.comment,
      });

      setShowResult(true);

      // 성공 시 임시 저장된 이미지 삭제
      localStorage.removeItem('saved_crown_image');
      localStorage.removeItem('saved_forehead_image');

      // 결과 섹션으로 부드럽게 스크롤
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error("Analysis failed:", error);
      alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 모든 입력 초기화
  const resetAll = () => {
    setCrownImage(null);
    setForeheadImage(null);
    setCrownFile(null);
    setForeheadFile(null);
    setShowResult(false);
    setResultData(null);
    // 초기화 시 로컬 스토리지 삭제
    localStorage.removeItem('saved_crown_image');
    localStorage.removeItem('saved_forehead_image');
  };

  // authModal 핸들러
  const handleAuthModalOpen = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
  };

  // 기존 Login 버튼 핸들러 연결
  const handleLoginClick = () => handleAuthModalOpen('login');

  // 이미지 제거 핸들러
  const handleClearImageCrown = () => {
    setCrownImage(null);
    setCrownFile(null);
    localStorage.removeItem('saved_crown_image');
  }

  const handleClearImageForehead = () => {
    setForeheadImage(null);
    setForeheadFile(null);
    localStorage.removeItem('saved_forehead_image');
  }


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 헤더 컴포넌트 */}
      <Header onReset={resetAll} handleLoginModalOpen={handleLoginClick} clearShowResult={clearShowResult} />


      <main className="max-w-2xl mx-auto px-4 md:px-6 mt-6 md:mt-8">
        {/* 설명 섹션 */}
        <section className="mb-8 md:mb-10 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-2">두피 상태 정밀 분석</h2>
          <p className="text-sm md:text-base text-slate-500">정수리와 이마 사진을 올려주시면 AI가 상태를 분석합니다.</p>
        </section>

        {/* 업로드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ImageUploadCard
            label="정수리 사진"
            image={crownImage}
            onImageChange={(e) => handleImageChange(e, 'crown')}
            onRemove={handleClearImageCrown}
            inputId="crown-upload"
          />
          <ImageUploadCard
            label="이마 사진"
            image={foreheadImage}
            onImageChange={(e) => handleImageChange(e, 'forehead')}
            onRemove={handleClearImageForehead}
            inputId="forehead-upload"
          />
        </div>

        {/* 분석 버튼 */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing || !crownImage || !foreheadImage}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
            ${isAnalyzing || !crownImage || !foreheadImage
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              분석 중...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              상태 판별하기
            </>
          )}
        </button>

        {/* 결과 섹션 (조건부 렌더링) */}
        {showResult && <AnalysisResult
          resultData={resultData}
          foreheadImage={foreheadFile}
          crownImage={crownFile}
          clearShowResult={clearShowResult}
        />}

        {/*히스토리 섹션*/}
        <hr className="my-12 border-slate-200" />
        {authcontext.isLoggedIn ? <RecordList /> : <p className="text-center text-slate-500 italic font-medium">로그인을 해서 정보를 기록해보세요!</p>}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default App;