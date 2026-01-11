import { useContext, useState, useEffect } from 'react';
import RecordCard from './RecordCard';
import AuthContext from '../store/auth-context';

const RecordList = () => {
    const [records, setRecords] = useState([]);
    const authcontext = useContext(AuthContext);
    useEffect(() => {
        const fetchRecords = async() => {
        const response = await fetch("http://localhost:3000/predict/viewRecords/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({accessToken: authcontext.token})
        }) ;
        if (response.ok){
            const resdata = await response.json();
            setRecords(resdata);
        }
        else {
            alert("통신에 문제가 생겼습니다.");
        }
    }
    fetchRecords();
    }, []);
    return (
        <section className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                나의 진단 히스토리
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {records.map(record => (
                    <RecordCard
                        key={record._id}
                        record={record}
                        onDelete={() => deleteRecord(record._id)} //  RecordCard에 삭제 기능 연결
                    />
                ))}
            </div>
        </section>
    )
}

export default RecordList;