import React, { useState, useContext } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import ImageUploadCard from './components/ImageUploadCard';
import AnalysisResult from './components/AnalysisResult';
import AuthModal from './components/modal/AuthModal';
import RecordList from './components/RecordList';

import { AuthContextProvider } from './store/auth-context';
import AuthContext from './store/auth-context';

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


  // 이미지 변경 핸들러
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'crown') {
          setCrownImage(reader.result);
          setCrownFile(file);
        }
        if (type === 'forehead') {
          setForeheadImage(reader.result);
          setForeheadFile(file);
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
        fetch("http://localhost:8000/predict/forehead", {
          method: "POST",
          body: foreheadFormData,
        }),
        fetch("http://localhost:8000/predict/crown", {
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

  // 삭제 수행 함수
  const deleteRecord = (id) => {
    if (window.confirm("이 진단 기록을 삭제하시겠습니까?")) {
      // filter를 사용해 클릭한 id만 제외한 새로운 목록을 만듭니다.
      const updatedRecords = historyRecords.filter(record => record._id !== id);
      setHistoryRecords(updatedRecords);
    }
  };



  return (
    <AuthContextProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
        {/* 헤더 컴포넌트 */}
        <Header onReset={resetAll} handleLoginModalOpen={handleLoginClick} />


        <main className="max-w-2xl mx-auto px-6 mt-8">
          {/* 설명 섹션 */}
          <section className="mb-10 text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">두피 상태 정밀 분석</h2>
            <p className="text-slate-500">정수리와 이마 사진을 올려주시면 AI가 상태를 분석합니다.</p>
          </section>

          {/* 업로드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <ImageUploadCard
              label="정수리 사진"
              image={crownImage}
              onImageChange={(e) => handleImageChange(e, 'crown')}
              onRemove={() => setCrownImage(null)}
              inputId="crown-upload"
            />
            <ImageUploadCard
              label="이마 사진"
              image={foreheadImage}
              onImageChange={(e) => handleImageChange(e, 'forehead')}
              onRemove={() => setForeheadImage(null)}
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
          {showResult && <AnalysisResult resultData={resultData} />}

          {/*히스토리 섹션*/}
          <hr className="my-12 border-slate-200" />
          {authcontext.isLoggedIn && <RecordList />}
        </main>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleAuthModalClose}
          initialMode={authModalMode}
        />
      </div>

    </AuthContextProvider>
  );
};

export default App;