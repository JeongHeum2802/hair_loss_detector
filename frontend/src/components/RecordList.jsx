import RecordCard from './RecordCard';

const RecordList = ({historyRecords}) => {
    return (
        <section className="mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                나의 진단 히스토리
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {historyRecords.map(record => (
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