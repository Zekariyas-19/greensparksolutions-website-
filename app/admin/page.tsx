'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // የትር ስሞች: 'register' (ዝርዝር ማየት እና መረጃ መመልከቻ) እና 'new-registration' (አዲስ መመዝገቢያ)
  const [activeTab, setActiveTab] = useState<'register' | 'new-registration'>('register');
  const [registrationType, setRegistrationType] = useState<'personal' | 'corporate'>('personal');

  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [fetchingRecords, setFetchingRecords] = useState(false);

  // የተመረጠው ሰው ሙሉ መረጃ የሚታይበት ፖፕአፕ (Modal) ስቴት
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [corporateId, setCorporateId] = useState('');
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

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
        fetchAllRecords();
      }
    } catch (err) {
      setLoginError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  // ከዳታቤዝ ሁለቱንም (ኦንላይን እና በአካል የሚመጡትን) አንድ ላይ ማምጫ ሰንጠረዥ
  const fetchAllRecords = async () => {
    setFetchingRecords(true);
    try {
      const { data, error } = await supabase
        .from('bookings') // ሁሉም መረጃዎች የሚቀመጡበት ሰንጠረዥ ስም
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error.message);
      } else if (data) {
        setAllRecords(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setFetchingRecords(false);
    }
  };

  // በአካል (Walk-in) የሚመጡትን መረጃዎች በቀጥታ ወደ ዳታቤዙ (bookings) መላኪያ
  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationType === 'personal' && !walkInName) return;
    if (registrationType === 'corporate' && !corporateName) return;

    setSubmittingWalkIn(true);

    const newName = registrationType === 'personal' ? walkInName : corporateName;
    const newType = registrationType === 'personal' ? 'Walk-in Personal' : 'Walk-in Corporate';
    const newPhone = registrationType === 'personal' ? walkInPhone : corporateId; // ID ወይም Phone

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: newName,
            type: newType,
            phone: newPhone,
            status: 'Walk-in Registered',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        alert('Error saving record: ' + error.message);
      } else {
        alert('Walk-in registration successful!');
        setWalkInName('');
        setWalkInPhone('');
        setCorporateName('');
        setCorporateId('');
        fetchAllRecords(); // መረጃውን እንደገና ይጭናል
        setActiveTab('register'); // ወደ Register ትር ይመልሰዋል
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred during registration.');
    } finally {
      setSubmittingWalkIn(false);
    }
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
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Username:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Password:</label>
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
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
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
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#4ade80' }}>Company Management Dashboard</h1>
            <button 
              onClick={() => setIsLoggedIn(false)}
              style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'register' ? '#16a34a' : '#0f172a',
                color: '#ffffff',
                border: '1px solid #1e293b'
              }}
            >
              Register (View All Records)
            </button>
            <button
              onClick={() => setActiveTab('new-registration')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'new-registration' ? '#16a34a' : '#0f172a',
                color: '#ffffff',
                border: '1px solid #1e293b'
              }}
            >
              New Registration (Walk-in)
            </button>
          </div>

          {activeTab === 'register' ? (
            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#e2e8f0', margin: 0 }}>
                  All Registrations (Click any name for full details)
                </h2>
                <button
                  onClick={fetchAllRecords}
                  style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  {fetchingRecords ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fetchingRecords ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Loading records...</p>
                ) : allRecords.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No records found.</p>
                ) : (
                  allRecords.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      onClick={() => setSelectedRecord(item)} // ስሙን ሲነኩ ሙሉ መረጃ እንዲመጣ ያደርጋል
                      style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                    >
                      <div>
                        <p style={{ fontWeight: 'bold', margin: 0, fontSize: '16px', color: '#4ade80' }}>
                          {item.name || item.full_name || 'No Name'}
                        </p>
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                          {item.type || item.service_type || 'General'}
                        </p>
                      </div>
                      <span style={{ fontSize: '12px', backgroundColor: '#064e3b', color: '#6ee7b7', padding: '6px 12px', borderRadius: '6px' }}>
                        {item.status || 'Registered'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px', color: '#e2e8f0' }}>
                New Walk-in Registration Form
              </h2>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRegistrationType('personal')}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: registrationType === 'personal' ? '#334155' : '#1e293b', color: '#ffffff', border: '1px solid #475569' }}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType('corporate')}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: registrationType === 'corporate' ? '#334155' : '#1e293b', color: '#ffffff', border: '1px solid #475569' }}
                >
                  Corporate
                </button>
              </div>

              <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {registrationType === 'personal' ? (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Full Name or Vehicle Number:</label>
                      <input 
                        type="text" 
                        value={walkInName}
                        onChange={(e) => setWalkInName(e.target.value)}
                        placeholder="Enter name or vehicle number..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Phone Number:</label>
                      <input 
                        type="text" 
                        value={walkInPhone}
                        onChange={(e) => setWalkInPhone(e.target.value)}
                        placeholder="Enter phone number..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Company Name:</label>
                      <input 
                        type="text" 
                        value={corporateName}
                        onChange={(e) => setCorporateName(e.target.value)}
                        placeholder="Enter company name..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Corporate ID / Tax Number:</label>
                      <input 
                        type="text" 
                        value={corporateId}
                        onChange={(e) => setCorporateId(e.target.value)}
                        placeholder="Enter corporate ID..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#16a34a', color: '#ffffff', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '8px' }}
                  disabled={submittingWalkIn}
                >
                  {submittingWalkIn ? 'Saving...' : 'Submit Registration'}
                </button>
              </form>
            </div>
          )}

          {/* የተመረጠውን ሰው ሙሉ መረጃ የሚያሳይ ፖፕአፕ (Popup Modal) */}
          {selectedRecord && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', margin: 0 }}>Full Details</h3>
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#e2e8f0', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px' }}>
                  <p style={{ margin: 0 }}><strong>Name / Company:</strong> {selectedRecord.name || selectedRecord.full_name || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Registration Type:</strong> {selectedRecord.type || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Phone / ID:</strong> {selectedRecord.phone || selectedRecord.phone_number || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Status:</strong> {selectedRecord.status || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Date / Time:</strong> {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString() : 'N/A'}</p>
                  {/* ሌሎች ተጨማሪ የዳታቤዝ ረድፎች ካሉ እዚህ ማሳየት ይቻላል */}
                  {Object.entries(selectedRecord).map(([key, value]) => {
                    if (['id', 'name', 'full_name', 'type', 'phone', 'phone_number', 'status', 'created_at'].includes(key)) return null;
                    return <p key={key} style={{ margin: 0 }}><strong>{key}:</strong> {String(value)}</p>;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}