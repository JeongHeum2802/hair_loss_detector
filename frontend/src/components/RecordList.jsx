import { useContext } from 'react';
import RecordCard from './RecordCard';
import AuthContext from '../store/auth-context';

const RecordList = () => {
  const authcontext = useContext(AuthContext);

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        나의 진단 히스토리
      </h3>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {authcontext.records.map(record => (
          <RecordCard
            key={record._id}
            record={record}
          />
        ))}
      </div>
    </section>
  )
}

export default RecordList;