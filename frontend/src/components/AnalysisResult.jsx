import React from 'react';
import { AlertCircle } from 'lucide-react';

const AnalysisResult = ({ resultData }) => {
  if (!resultData) return null;

  return (
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
            <span className="text-3xl font-black text-blue-600">
              {(resultData.probility * 100).toFixed(0)}<span className="text-xl">%</span>
            </span>
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
  );
};

export default AnalysisResult;
