'use client';
import { useState } from 'react';

// የቋንቋ ምርጫዎች (Translations)
const translations = {
  am: {
    title: 'የሰራተኞች መግቢያ (Admin Login)',
    username: 'ዩዘርኔም (Username):',
    password: 'ፓስዋርድ (Password):',
    loginBtn: 'ግባ',
    error: 'የተሳሳተ ዩዘርኔም ወይም ፓስዋርድ!',
    dashboardTitle: 'የድርጅት አስተዳደር ዳሽቦርድ',
    onlineBookings: 'በኦንላይን የተያዙ (Online Bookings)',
    walkInTitle: 'በአካል የመጡ ሰዎችን/ተሽከርካሪዎችን መመዝገቢያ',
    namePlaceholder: 'ስም ወይም ተሽከርካሪ ቁጥር...',
    phonePlaceholder: 'ስልክ ቁጥር...',
    registerBtn: 'መዝግብ',
    logout: 'ውጣ (Logout)',
    langToggle: 'English',
  },
  en: {
    title: 'Staff Admin Login',
    username: 'Username:',
    password: 'Password:',
    loginBtn: 'Login',
    error: 'Invalid username or password!',
    dashboardTitle: 'Company Management Dashboard',
    onlineBookings: 'Online Bookings',
    walkInTitle: 'Walk-in Registration',
    namePlaceholder: 'Name or Vehicle Number...',
    phonePlaceholder: 'Phone Number...',
    registerBtn: 'Register',
    logout: 'Logout',
    langToggle: 'አማርኛ',
  }
};

export default function AdminPage() {
  const [lang, setLang] = useState<'am' | 'en'>('am');
  const t = translations[lang];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // ለሙከራ የሚሆን ዩዘርኔም እና ፓስዋርድ (ለጊዜው)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError(t.error);
    }
  };

  // የቦኪንግ እና ዎች-ኢን መረጃዎች ሁኔታ
  const [bookings, setBookings] = useState([
    { id: 1, name: 'ከበደ መኮንን', type: 'መኪና - A12345', status: 'በኦንላይን የተያዘ' },
    { id: 2, name: 'አበበ በላቸው', type: 'ሰው - ፊት ለፊት', status: 'በኦንላይን የተያዘ' }
  ]);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName) return;
    const newEntry = {
      id: bookings.length + 1,
      name: walkInName,
      type: walkInPhone ? `በአካል (${walkInPhone})` : 'በአካል (Walk-in)',
      status: 'ተመዝግቧል'
    };
    setBookings([...bookings, newEntry]);
    setWalkInName('');
    setWalkInPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* የቋንቋ መቀየሪያ ቁልፍ */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
          className="bg-slate-800 border border-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-700 transition"
        >
          {t.langToggle}
        </button>
      </div>

      {!isLoggedIn ? (
        /* የሎጊን ገጽ (Login Form) */
        <div className="max-w-md mx-auto mt-20 bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-green-400 text-center">{t.title}</h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.username}</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.password}</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-green-500"
                required
              />
            </div>

            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold transition"
            >
              {t.loginBtn}
            </button>
          </form>
        </div>
      ) : (
        /* ዋናው ዳሽቦርድ (Main Dashboard) */
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h1 className="text-2xl font-bold text-green-400">{t.dashboardTitle}</h1>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition"
            >
              {t.logout}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* በኦንላይን የተያዙ መረጃዎች ማሳያ */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">{t.onlineBookings}</h2>
              <div className="space-y-3">
                {bookings.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-800 rounded border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.type}</p>
                    </div>
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* በአካል መጥተው የሚመዘገቡበት ክፍል (Walk-in Form) */}
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">{t.walkInTitle}</h2>
              <form onSubmit={handleWalkInSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded font-bold transition"
                >
                  {t.registerBtn}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}