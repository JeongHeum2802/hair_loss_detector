import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import ImageUploadCard from './components/ImageUploadCard';
import AnalysisResult from './components/AnalysisResult';

// 더미 데이터 설정
const dummyResponse = {
  probility: 0.45,
  coment: "조짐이 조금 보여요, 전문가와의 상담을 권장합니다."
};

const App = () => {
  const [crownImage, setCrownImage] = useState(null); // 정수리 사진
  const [foreheadImage, setForeheadImage] = useState(null); // 이마 사진
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 분석 중
  const [showResult, setShowResult] = useState(false); // 결과 표시
  const [resultData, setResultData] = useState(null); // 결과 데이터

  // 이미지 변경 핸들러
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'crown') setCrownImage(reader.result);
        if (type === 'forehead') setForeheadImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 분석 실행 핸들러
  const runAnalysis = () => {
    if (!crownImage || !foreheadImage) {
      alert("두 장의 사진을 모두 업로드해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);

    // 백엔드 통신 시뮬레이션 (2초 대기)
    setTimeout(() => {
      setResultData(dummyResponse);
      setIsAnalyzing(false);
      setShowResult(true);

      // 결과 섹션으로 부드럽게 스크롤
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 2000);
  };

  // 모든 입력 초기화
  const resetAll = () => {
    setCrownImage(null);
    setForeheadImage(null);
    setShowResult(false);
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 헤더 컴포넌트 */}
      <Header onReset={resetAll} />

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
      </main>
    </div>
  );
};

export default App;