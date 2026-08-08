'use client';
import { useState } from 'react';

export default function AdminDashboard() {
  const [dataName, setDataName] = useState('');
  const [dataValue, setDataValue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('መረጃው በተሳካ ሁኔታ ተመዝግቧል!');
    setDataName('');
    setDataValue('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-xl border border-slate-800">
        <h1 className="text-2xl font-bold mb-6 text-green-400">የሰራተኞች መረጃ መቆጣጠሪያ (Admin Dashboard)</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">የመዝጋቢው/የተሽከርካሪው ስም:</label>
            <input 
              type="text" 
              value={dataName} 
              onChange={(e) => setDataName(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="ስም ያስገቡ..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">መረጃው / ዝርዝር ሁኔታ:</label>
            <input 
              type="text" 
              value={dataValue} 
              onChange={(e) => setDataValue(e.target.value)}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
              placeholder="ዝርዝር መረጃ ያስገቡ..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold transition"
          >
            መረጃ አስገባ
          </button>
        </form>

        {message && <p className="mt-4 text-green-400 font-medium">{message}</p>}
      </div>
    </div>
  );
}