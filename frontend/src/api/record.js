// src/api/record.js
const BASE_URL = "http://localhost:8000/api/record"; // 백엔드 주소

// 1. 진단 기록 목록 가져오기 (POST 방식)
export const fetchViewRecords = async () => {
    const token = localStorage.getItem("accessToken"); // 보안 토큰 가져오기
    
    const response = await fetch(`${BASE_URL}/viewRecords`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // 헤더에 토큰 담기
        }
    });
    
    if (!response.ok) throw new Error("기록을 불러오는데 실패했습니다.");
    return response.json();
};

// 2. 진단 기록 삭제하기
export const fetchDeleteRecord = async (recordId) => {
    const token = localStorage.getItem("accessToken");
    
    const response = await fetch(`${BASE_URL}/deleteRecord`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ recordId }) // 삭제할 기록 ID 전달
    });
    
    return response.ok;
};