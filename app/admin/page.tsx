'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // የይለፍ ቃሉን ማሳያ/መደበቂያ ስቴት
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_name', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        setLoginError('Invalid username or password!');
      } else {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setLoginError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const [records, setRecords] = useState([
    { id: 1, name: 'Kebede Mekonnen', type: 'Car - A12345', status: 'Online Booked' },
    { id: 2, name: 'Abebe Balcha', type: 'Walk-in', status: 'Online Booked' }
  ]);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName) return;
    const newEntry = {
      id: records.length + 1,
      name: walkInName,
      type: walkInPhone ? `Walk-in (${walkInPhone})` : 'Walk-in',
      status: 'Registered'
    };
    setRecords([...records, newEntry]);
    setWalkInName('');
    setWalkInPhone('');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#ffffff', padding: '24px', fontFamily: 'sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ maxWidth: '400px', margin: '80px auto', backgroundColor: '#0f172a', padding: '32px', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#4ade80', textAlign: 'center' }}>
            Staff Admin Login
          </h1>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>
                Username:
              </label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>
                Password:
              </label>
              {/* የይለፍ ቃል ኢንፑት ከነ 'አሳይ/ደብቅ' አዝራሩ */}
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', paddingRight: '45px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* ክፍት የዓይን ቅርጽ (ሲታይ) */
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    /* የተዘጋ/የተሰመረ የዓይን ቅርጽ (ሲደበቅ) */
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {loginError && <p style={{ color: '#f87171', fontSize: '14px' }}>{loginError}</p>}

            <button 
              type="submit"
              style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80' }}>
              Company Management Dashboard
            </h1>
            <button 
              onClick={() => setIsLoggedIn(false)}
              style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px', color: '#e2e8f0' }}>
                Online Bookings
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {records.map((item) => (
                  <div key={item.id} style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '6px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>{item.type}</p>
                    </div>
                    <span style={{ fontSize: '12px', backgroundColor: '#064e3b', color: '#6ee7b7', padding: '4px 8px', borderRadius: '4px' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px', color: '#e2e8f0' }}>
                Walk-in Registration
              </h2>
              <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="text" 
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="Name or Vehicle Number..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                  required
                />
                <input 
                  type="text" 
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  placeholder="Phone Number..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                />
                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}