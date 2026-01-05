import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, RefreshCcw, Layout, User } from 'lucide-react';

const App = () => {
  const [crownImage, setCrownImage] = useState(null);
  const [foreheadImage, setForeheadImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState(null);

  // 더미 데이터 설정
  const dummyResponse = {
    probility: 0.45,
    coment: "조짐이 조금 보여요, 전문가와의 상담을 권장합니다."
  };

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

  const resetAll = () => {
    setCrownImage(null);
    setForeheadImage(null);
    setShowResult(false);
    setResultData(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Layout className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-blue-900">HairScan AI</h1>
          </div>
          <button onClick={resetAll} className="text-slate-400 hover:text-blue-500 transition-colors">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 mt-8">
        {/* 설명 섹션 */}
        <section className="mb-10 text-center">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">두피 상태 정밀 분석</h2>
          <p className="text-slate-500">정수리와 이마 사진을 올려주시면 AI가 상태를 분석합니다.</p>
        </section>

        {/* 업로드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 정수리 업로드 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              정수리 사진
            </label>
            <div
              className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-center items-center justify-center overflow-hidden
                ${crownImage ? 'border-blue-400 bg-white' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}`}
            >
              {crownImage ? (
                <img src={crownImage} alt="Crown" className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
                  <Camera className="w-10 h-10 text-slate-300" />
                  <span className="text-sm text-slate-400 font-medium">사진 선택하기</span>
                  <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'crown')} accept="image/*" />
                </label>
              )}
              {crownImage && (
                <button
                  onClick={() => setCrownImage(null)}
                  className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 이마 업로드 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              이마 사진
            </label>
            <div
              className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-center items-center justify-center overflow-hidden
                ${foreheadImage ? 'border-blue-400 bg-white' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'}`}
            >
              {foreheadImage ? (
                <img src={foreheadImage} alt="Forehead" className="w-full h-full object-cover" />
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-2">
                  <Camera className="w-10 h-10 text-slate-300" />
                  <span className="text-sm text-slate-400 font-medium">사진 선택하기</span>
                  <input type="file" className="hidden" onChange={(e) => handleImageChange(e, 'forehead')} accept="image/*" />
                </label>
              )}
              {foreheadImage && (
                <button
                  onClick={() => setForeheadImage(null)}
                  className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
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
        {showResult && resultData && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">분석 결과 리포트</h3>
              </div>

              {/* 확률 게이지 */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-500">진행 위험도</span>
                  <span className="text-3xl font-black text-blue-600">{(resultData.probility * 100).toFixed(0)}<span className="text-xl">%</span></span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${resultData.probility * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 코멘트 박스 */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <p className="text-blue-900 font-medium leading-relaxed italic text-center">
                  "{resultData.coment}"
                </p>
              </div>

              {/* 추가 안내 */}
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-xs text-slate-400 text-center italic">
                  * 본 결과는 AI 모델의 추정치이며, 정확한 진단은 반드시 의료기관을 방문하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;