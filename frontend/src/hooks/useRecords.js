// src/hooks/useRecords.js
import { useState, useEffect } from 'react';
import { fetchViewRecords, fetchDeleteRecord } from '../api/record';

export const useRecords = () => {
    const [historyRecords, setHistoryRecords] = useState([]);

    // 데이터 로드 및 이름 매핑 로직
    const loadRecords = async () => {
        try {
            const data = await fetchViewRecords();
            const formatted = data.map(record => ({
                _id: record._id,
                probability: record.probability,
                coment: record.comment, // 백엔드 comment -> 프론트 coment 매핑
                foreheadUrl: record.foreheadPic?.imageUrl,
                crownUrl: record.crownPic?.imageUrl,
                createdAt: record.createdAt
            }));
            // 최신순 정렬
            setHistoryRecords(formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error(error);
        }
    };

    // 삭제 로직
    const removeRecord = async (id) => {
        if (!window.confirm("이 진단 기록을 삭제하시겠습니까?")) return;
        const success = await fetchDeleteRecord(id);
        if (success) {
            setHistoryRecords(prev => prev.filter(r => r._id !== id));
        }
    };

    // 처음에 한 번 로드
    useEffect(() => { loadRecords(); }, []);

    return { historyRecords, removeRecord, refreshRecords: loadRecords };
};