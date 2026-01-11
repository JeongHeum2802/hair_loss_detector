import React from 'react';
import { Trash2 } from 'lucide-react'; // 쓰레기통 아이콘을 불러오기

const RecordCard = ({ record, onDelete }) => { // onDelte: App.jxx에서 보내준 onDelete 함수 받기
  // 1. 데이터가 없을 때를 대비한 기본값 설정
  const dummyData = {
    probability: 0,
    coment: "진단 기록이 없습니다.",
    foreheadUrl: "https://via.placeholder.com/150",
    crownUrl: "https://via.placeholder.com/150",
    createdAt: new Date().toISOString()
  };

  // 실제 데이터가 들어오면 그걸 쓰고, 없으면 가짜 데이터를 씀
  const data = record || dummyData;

  return (
    <div style={{
      position: 'relative', // 삭제 버튼 구석 배치
      backgroundColor: 'white',
      borderRadius: '16px', // 부드러운 느낌 구현
      padding: '24px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // 깔끔한 그림자
      border: '1px solid #f1f5f9'
    }}>
      {/* 삭제 버튼 */}
      <button 
        onClick={onDelete} 
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#cbd5e1',
          cursor: 'pointer',
          transition: 'color 0.2s',
          zIndex: 10 // 다른 요소보다 위에 오도록 설정
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} 
        onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
      >
        <Trash2 size={20} />
      </button>

    
      {/* 날짜 표시 */}
      <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
        {new Date(data.createdAt).toLocaleDateString()}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
            진단 결과: <span style={{ color: '#3b82f6' }}>{data.probability}%</span>
          </h4>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>
            {data.coment}
          </p>
        </div>
      </div>
      
      {/* 사진 영역 */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <div style={{ position: 'relative' }}>
          <img src={data.foreheadUrl} alt="이마" style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f5f9' }} />
          <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>이마</span>
        </div>
        <div style={{ position: 'relative' }}>
          <img src={data.crownUrl} alt="정수리" style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f5f9' }} />
          <span style={{ position: 'absolute', bottom: '4px', left: '4px', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>정수리</span>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;