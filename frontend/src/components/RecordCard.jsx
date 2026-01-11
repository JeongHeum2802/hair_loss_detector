import React, { useContext, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import AuthContext from '../store/auth-context';
import { API_BASE_URL } from '../config/api';

const RecordCard = ({ record }) => {
  const authcontext = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const response = await fetch(`${API_BASE_URL}/predict/deleteRecord`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authcontext.token}`
      },
      body: JSON.stringify({ recordId: record._id })
    });

    if (response.ok) {
      authcontext.setRecords((prev) => prev.filter(r => r._id !== record._id));
    } else {
      console.log("삭제 실패");
      setIsDeleting(false);
    }
  }

  // 데이터 매핑
  const {
    probability,
    comment, // 오타 수정: coment -> comment (백엔드/프론트엔드 통일 필요하지만 받은 데이터 기준)
    foreheadPic,
    crownPic,
    createdAt
  } = record || {};

  const displayProbability = probability ? (probability * 100).toFixed(0) : 0;
  const foreheadUrl = foreheadPic?.imageUrl || "https://via.placeholder.com/150";
  const crownUrl = crownPic?.imageUrl || "https://via.placeholder.com/150";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative mb-4">
      <div className="flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6">
        {/* 이미지 영역 */}
        <div className="flex gap-2 md:gap-3 shrink-0">
          <div className="relative w-full md:w-24 h-32 md:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-1 md:flex-none">
            <img
              src={foreheadPic?.imageUrl || "https://via.placeholder.com/150"}
              alt="이마 사진"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 text-[10px] bg-black/50 text-white w-full text-center py-0.5 backdrop-blur-sm">
              이마
            </div>
          </div>
          <div className="relative w-full md:w-24 h-32 md:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-1 md:flex-none">
            <img
              src={crownPic?.imageUrl || "https://via.placeholder.com/150"}
              alt="정수리 사진"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 text-[10px] bg-black/50 text-white w-full text-center py-0.5 backdrop-blur-sm">
              정수리
            </div>
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 text-xs md:text-sm px-2 py-0.5 rounded-full">
                    탈모 확률
                  </span>
                  {probability ? (probability * 100).toFixed(0) : 0}%
                </h3>
                <span className="text-xs text-slate-400 mt-1 block">
                  {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 md:static text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                title="삭제"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
              {comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;