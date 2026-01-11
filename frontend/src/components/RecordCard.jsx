import React, { useContext, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import AuthContext from '../store/auth-context';

const RecordCard = ({ record }) => {
  const authcontext = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    const response = await fetch('http://localhost:3000/predict/deleteRecord', {
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
    <div style={{
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid #f1f5f9'
    }}>
      {/* 삭제 버튼 */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          border: 'none',
          backgroundColor: 'transparent',
          color: isDeleting ? '#3b82f6' : '#cbd5e1',
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          transition: 'color 0.2s',
          zIndex: 10
        }}
        onMouseEnter={(e) => !isDeleting && (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={(e) => !isDeleting && (e.currentTarget.style.color = '#cbd5e1')}
      >
        {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
      </button>


      {/* 날짜 표시 */}
      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
        {new Date(createdAt).toLocaleDateString()} {new Date(createdAt).toLocaleTimeString()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
            진단 결과: <span style={{ color: '#3b82f6' }}>{displayProbability}%</span>
          </h4>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            {comment}
          </p>
        </div>
      </div>

      {/* 사진 영역 */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <div style={{ position: 'relative' }}>
          <img src={foreheadUrl} alt="이마" style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f5f9' }} />
          <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>이마</span>
        </div>
        <div style={{ position: 'relative' }}>
          <img src={crownUrl} alt="정수리" style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f5f9' }} />
          <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>정수리</span>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;