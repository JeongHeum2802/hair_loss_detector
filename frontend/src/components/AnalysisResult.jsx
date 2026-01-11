import React, { useContext, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import AuthContext from '../store/auth-context';
import { API_BASE_URL } from '../config/api';

const AnalysisResult = ({ resultData, foreheadImage, crownImage, clearShowResult }) => {
  if (!resultData) return null;

  const [isSavingRecord, setIsSavingRecord] = useState(false);

  const authcontext = useContext(AuthContext);

  const handleSaveRecord = async () => {
    const formData = new FormData();
    formData.append('foreheadImage', foreheadImage);
    formData.append('crownImage', crownImage);
    formData.append('comment', resultData.coment);
    formData.append('probability', resultData.probility);

    setIsSavingRecord(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict/saveRecord`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authcontext.token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json();
        authcontext.setRecords((prev) => {
          return [...prev, data.record];
        });
        clearShowResult();
      }
      else {
        console.log("saveRecord error");
      }

    } catch (error) {
      console.log(error);
    }
    setIsSavingRecord(false);
  }


  return (
    <div className="mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-100 shadow-xl shadow-blue-50">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-2 bg-blue-50 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-800">분석 결과 리포트</h3>

          {authcontext.isLoggedIn &&
            <button
              disabled={isSavingRecord}
              onClick={handleSaveRecord}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black transition-colors text-xs md:text-sm flex items-center justify-center min-w-[50px] md:min-w-[60px]"
            >
              {isSavingRecord ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : '기록'}
            </button>
          }
        </div>

        {/* 확률 게이지 */}
        <div className="mb-6 md:mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs md:text-sm font-semibold text-slate-500">진행 위험도</span>
            <span className="text-2xl md:text-3xl font-black text-blue-600">
              {(resultData.probility * 100).toFixed(0)}<span className="text-lg md:text-xl">%</span>
            </span>
          </div>
          <div className="w-full h-3 md:h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${resultData.probility * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 코멘트 박스 */}
        <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-blue-100">
          <p className="text-sm md:text-base text-blue-900 font-medium leading-relaxed italic text-center">
            "{resultData.coment}"
          </p>
        </div>

        {/* 추가 안내 */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-50">
          <p className="text-[10px] md:text-xs text-slate-400 text-center italic">
            * 본 결과는 AI 모델의 추정치이며, 정확한 진단은 반드시 의료기관을 방문하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
