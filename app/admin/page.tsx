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

  const [activeTab, setActiveTab] = useState<'online' | 'walkin'>('online');
  const [registrationType, setRegistrationType] = useState<'personal' | 'corporate'>('personal');

  const [onlineBookings, setOnlineBookings] = useState<any[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);

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
        fetchOnlineBookings();
      }
    } catch (err) {
      setLoginError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineBookings = async () => {
    setFetchingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings') // የሠንጠረዥዎ ስም የተለየ ከሆነ እዚህ ያስተካክሉት
        .select('*');

      if (error) {
        console.error('Error fetching bookings:', error.message);
      } else if (data) {
        setOnlineBookings(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setFetchingBookings(false);
    }
  };

  const [records, setRecords] = useState([
    { id: 1, name: 'Kebede Mekonnen', type: 'Car - A12345', status: 'Online Booked' },
    { id: 2, name: 'Abebe Balcha', type: 'Walk-in', status: 'Online Booked' }
  ]);

  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [corporateId, setCorporateId] = useState('');

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationType === 'personal' && !walkInName) return;
    if (registrationType === 'corporate' && !corporateName) return;

    const newName = registrationType === 'personal' ? walkInName : corporateName;
    const newType = registrationType === 'personal' 
      ? (walkInPhone ? `Walk-in Personal (${walkInPhone})` : 'Walk-in Personal')
      : (corporateId ? `Walk-in Corporate (ID: ${corporateId})` : 'Walk-in Corporate');

    const newEntry = {
      id: records.length + 1,
      name: newName,
      type: newType,
      status: 'Registered'
    };

    setRecords([...records, newEntry]);
    setWalkInName('');
    setWalkInPhone('');
    setCorporateName('');
    setCorporateId('');
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
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
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('online')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'online' ? '#16a34a' : '#0f172a',
                color: '#ffffff',
                border: '1px solid #1e293b'
              }}
            >
              Online Bookings View
            </button>
            <button
              onClick={() => setActiveTab('walkin')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'walkin' ? '#16a34a' : '#0f172a',
                color: '#ffffff',
                border: '1px solid #1e293b'
              }}
            >
              Walk-in New Registration
            </button>
          </div>

          {activeTab === 'online' ? (
            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'semibold', color: '#e2e8f0', margin: 0 }}>
                  Online Booked Records (Full Details)
                </h2>
                <button
                  onClick={fetchOnlineBookings}
                  style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  {fetchingBookings ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fetchingBookings ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Loading data from database...</p>
                ) : onlineBookings.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No online bookings found in database.</p>
                ) : (
                  onlineBookings.map((item, index) => (
                    <div key={item.id || index} style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#4ade80' }}>
                          {item.name || item.full_name || item.customer_name || 'Customer Name Not Specified'}
                        </span>
                        <span style={{ fontSize: '12px', backgroundColor: '#064e3b', color: '#6ee7b7', padding: '4px 10px', borderRadius: '6px' }}>
                          {item.status || 'Online Booked'}
                        </span>
                      </div>

                      {/* የደንበኛውን ሌሎች ተጨማሪ መረጃዎች እዚህ በዝርዝር እናሳያለን */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '13px', color: '#cbd5e1', marginTop: '4px', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                        <div><strong>Phone:</strong> {item.phone || item.phone_number || 'N/A'}</div>
                        <div><strong>Vehicle / Type:</strong> {item.type || item.vehicle || item.car_number || 'N/A'}</div>
                        <div><strong>Service:</strong> {item.service || item.service_type || 'N/A'}</div>
                        <div><strong>Date / Time:</strong> {item.date || item.created_at ? new Date(item.date || item.created_at).toLocaleString() : 'N/A'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'semibold', marginBottom: '16px', color: '#e2e8f0' }}>
                Walk-in New Registration Form
              </h2>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRegistrationType('personal')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: registrationType === 'personal' ? '#334155' : '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #475569'
                  }}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType('corporate')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    backgroundColor: registrationType === 'corporate' ? '#334155' : '#1e293b',
                    color: '#ffffff',
                    border: '1px solid #475569'
                  }}
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
                >
                  Submit Registration
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}