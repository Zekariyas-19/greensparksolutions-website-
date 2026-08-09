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

  const [activeTab, setActiveTab] = useState<'register' | 'new-registration'>('register');
  const [subRegisterTab, setSubRegisterTab] = useState<'personal' | 'corporate' | 'completed'>('personal');
  const [registrationType, setRegistrationType] = useState<'personal' | 'corporate'>('personal');

  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [fetchingRecords, setFetchingRecords] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // የዎክ-ኢን ፎርም መሠረታዊ መረጃዎች
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [address, setAddress] = useState('');
  
  // የደንበኛውን የመኪና ዓይነቶች እና ብዛት መያዣ (Object)
  const [vehicles, setVehicles] = useState<{ [key: string]: number }>({
    'የቤት መኪና': 0,
    'ሜዳቮል': 0,
    'ባስ / አውቶቡስ': 0,
    'ፒካፕ': 0,
    'የደረቅ ጭነት': 0,
    'የደረቅ ጭነት ተሳቢ': 0,
    'ቤንዚን ቦቴ': 0,
    'ተሳቢ ቤንዚን ቦቴ': 0,
  });

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

  const fetchAllRecords = async () => {
    setFetchingRecords(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error.message);
      } else if (data) {
        setAllRecords(data);
        if (selectedRecord) {
          const updated = data.find((r: any) => r.id === selectedRecord.id || r.booking_id === selectedRecord.booking_id);
          if (updated) setSelectedRecord(updated);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setFetchingRecords(false);
    }
  };

  const getBookingIdDisplay = (item: any) => {
    return item.booking_id || item.id || 'N/A';
  };

  const renderVehicleDetails = (vehiclesData: any) => {
    if (!vehiclesData) return 'N/A';
    if (typeof vehiclesData === 'string') return vehiclesData;
    
    if (typeof vehiclesData === 'object') {
      if (Array.isArray(vehiclesData)) {
        return vehiclesData.map((v, i) => v.name || v.model || v.brand || JSON.stringify(v)).join(', ');
      }
      // የተመረጡትን መኪኖች እና ብዛታቸው በዝርዝር ማሳየት
      return Object.entries(vehiclesData)
        .filter(([_, count]) => Number(count) > 0)
        .map(([name, count]) => `${name}: ${count}`)
        .join(', ') || 'None selected';
    }
    return String(vehiclesData);
  };

  const handleUpdateStatus = async (recordId: any, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', recordId);

      if (error) {
        const { error: err2 } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('booking_id', recordId);
        
        if (err2) {
          alert('Error updating status: ' + err2.message);
          return;
        }
      }

      alert(`Status successfully updated to "${newStatus}"!`);
      fetchAllRecords();
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVehicleChange = (vehicleName: string, count: number) => {
    setVehicles(prev => ({
      ...prev,
      [vehicleName]: Math.max(0, count)
    }));
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      alert('Please enter Name / Company name.');
      return;
    }

    setSubmittingWalkIn(true);
    const isCorp = registrationType === 'corporate';
    const randomBookingId = `GS-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            booking_id: randomBookingId,
            full_name: fullName,
            customer_type: isCorp ? 'company' : 'individual',
            phone: phone || null,
            plate_number: plateNumber || null,
            vehicles: vehicles,
            tin_number: tinNumber || null,
            address: address || null,
            status: 'Pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        alert('Error saving record: ' + error.message);
      } else {
        alert('Walk-in registration successful!');
        setFullName('');
        setPhone('');
        setPlateNumber('');
        setTinNumber('');
        setAddress('');
        setVehicles({
          'የቤት መኪና': 0,
          'ሜዳቮል': 0,
          'ባስ / አውቶቡስ': 0,
          'ፒካፕ': 0,
          'የደረቅ ጭነት': 0,
          'የደረቅ ጭነት ተሳቢ': 0,
          'ቤንዚን ቦቴ': 0,
          'ተሳቢ ቤንዚን ቦቴ': 0,
        });
        fetchAllRecords();
        setActiveTab('register');
        setSubRegisterTab(isCorp ? 'corporate' : 'personal');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred during registration.');
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  const completedRecords = allRecords.filter(item => {
    const st = item.status?.toLowerCase() || '';
    return st.includes('complet') || st.includes('ready') || st.includes('done');
  });

  const corporateRecords = allRecords.filter(item => {
    const custType = item.customer_type?.toLowerCase() || '';
    const st = item.status?.toLowerCase() || '';
    const isCompleted = st.includes('complet') || st.includes('ready') || st.includes('done');
    return custType === 'company' && !isCompleted;
  });

  const personalRecords = allRecords.filter(item => {
    const custType = item.customer_type?.toLowerCase() || '';
    const st = item.status?.toLowerCase() || '';
    const isCompleted = st.includes('complet') || st.includes('ready') || st.includes('done');
    return custType !== 'company' && !isCompleted;
  });

  let currentTabRecords = personalRecords;
  if (subRegisterTab === 'corporate') currentTabRecords = corporateRecords;
  if (subRegisterTab === 'completed') currentTabRecords = completedRecords;
  
  const displayedRecords = currentTabRecords.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const bId = String(item.booking_id || '').toLowerCase();
    const rawIdStr = String(item.id || '').toLowerCase();
    const nameStr = (item.full_name || item.name || '').toLowerCase();
    const phoneStr = (item.phone || '').toLowerCase();

    return bId.includes(q) || rawIdStr.includes(q) || nameStr.includes(q) || phoneStr.includes(q);
  });

  const getDisplayName = (item: any) => {
    if (item.full_name) return item.full_name;
    if (item.name) return item.name;
    if (item.company_name) return item.company_name;
    
    for (const key of Object.keys(item)) {
      if (
        typeof item[key] === 'string' &&
        item[key].trim() !== '' &&
        !['id', 'booking_id', 'customer_type', 'status', 'created_at', 'phone'].includes(key)
      ) {
        return item[key];
      }
    }
    return 'Unnamed Record';
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
              Register (View Records)
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
            <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #334155', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSubRegisterTab('personal')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'semibold',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'personal' ? '#334155' : 'transparent',
                    color: subRegisterTab === 'personal' ? '#4ade80' : '#94a3b8',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'personal' ? '#475569' : 'transparent'
                  }}
                >
                  Personal ({personalRecords.length})
                </button>
                <button
                  onClick={() => setSubRegisterTab('corporate')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'semibold',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'corporate' ? '#334155' : 'transparent',
                    color: subRegisterTab === 'corporate' ? '#4ade80' : '#94a3b8',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'corporate' ? '#475569' : 'transparent'
                  }}
                >
                  Corporate ({corporateRecords.length})
                </button>
                <button
                  onClick={() => setSubRegisterTab('completed')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 'semibold',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'completed' ? '#065f46' : 'transparent',
                    color: subRegisterTab === 'completed' ? '#34d399' : '#94a3b8',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'completed' ? '#059669' : 'transparent'
                  }}
                >
                  Completed ({completedRecords.length})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="Search by Booking ID (e.g. GS-22542), Name, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box' }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchAllRecords}
                  style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  {fetchingRecords ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fetchingRecords ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>Loading records...</p>
                ) : displayedRecords.length === 0 ? (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No records found.</p>
                ) : (
                  displayedRecords.map((item, index) => {
                    const isDone = (item.status || '').toLowerCase().includes('complet');
                    return (
                      <div 
                        key={item.id || index} 
                        onClick={() => setSelectedRecord(item)}
                        style={{ padding: '16px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', backgroundColor: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                              Booking ID: {getBookingIdDisplay(item)}
                            </span>
                            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '16px', color: '#4ade80' }}>
                              {getDisplayName(item)}
                            </p>
                          </div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '6px 0 0 0' }}>
                            {item.phone ? `Phone: ${item.phone}` : (item.customer_type || 'Record')}
                          </p>
                        </div>
                        <span style={{ fontSize: '12px', backgroundColor: isDone ? '#065f46' : '#064e3b', color: isDone ? '#34d399' : '#6ee7b7', padding: '6px 12px', borderRadius: '6px' }}>
                          {item.status || 'Registered'}
                        </span>
                      </div>
                    );
                  })
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>
                    {registrationType === 'personal' ? 'Full Name:' : 'Company Name:'}
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={registrationType === 'personal' ? 'Enter full name...' : 'Enter company name...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Phone Number:</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0911..."
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Plate Number (ሰሌዳ ቁጥር):</label>
                    <input 
                      type="text" 
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      placeholder="3 - A12345"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* የመኪና ዓይነቶች እና ብዛት መምረጫ (Vehicle Types & Quantities) */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#4ade80', fontWeight: 'bold' }}>
                    የተሽከርካሪ ዓይነቶች እና ብዛት (የሚፈልጉትን ይምረጡ):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                    {Object.keys(vehicles).map((vName) => (
                      <div key={vName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                        <span style={{ fontSize: '13px', color: '#e2e8f0' }}>{vName}</span>
                        <input 
                          type="number" 
                          min="0"
                          value={vehicles[vName]}
                          onChange={(e) => handleVehicleChange(vName, parseInt(e.target.value) || 0)}
                          style={{ width: '60px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#1e293b', border: '1px solid #475569', color: '#ffffff', textAlign: 'center' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {registrationType === 'corporate' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>TIN Number (የቲን ቁጥር):</label>
                    <input 
                      type="text" 
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      placeholder="Enter TIN number..."
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Address (አድራሻ):</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>

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

          {selectedRecord && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', margin: 0 }}>Booking Details</h3>
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#e2e8f0', backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px' }}>
                  <p style={{ margin: 0, color: '#38bdf8', fontWeight: 'bold' }}><strong>Booking ID:</strong> {getBookingIdDisplay(selectedRecord)}</p>
                  <p style={{ margin: 0 }}><strong>Name / Company:</strong> {getDisplayName(selectedRecord)}</p>
                  <p style={{ margin: 0 }}><strong>Customer Type:</strong> {selectedRecord.customer_type || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Phone:</strong> {selectedRecord.phone || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ color: '#34d399', fontWeight: 'bold' }}>{selectedRecord.status || 'N/A'}</span></p>
                  <p style={{ margin: 0 }}><strong>Date / Time:</strong> {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString() : 'N/A'}</p>
                  
                  {Object.entries(selectedRecord).map(([key, value]) => {
                    if (['id', 'booking_id', 'name', 'full_name', 'company_name', 'customer_type', 'phone', 'phone_number', 'status', 'created_at'].includes(key)) return null;
                    
                    if (key === 'vehicles') {
                      return <p key={key} style={{ margin: 0 }}><strong>vehicles:</strong> {renderVehicleDetails(value)}</p>;
                    }

                    return <p key={key} style={{ margin: 0 }}><strong>{key}:</strong> {String(value)}</p>;
                  })}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id || selectedRecord.booking_id, 'Completed')}
                    style={{ flex: 1, backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    disabled={updatingStatus}
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id || selectedRecord.booking_id, 'Pending')}
                    style={{ backgroundColor: '#ca8a04', color: '#ffffff', border: 'none', padding: '10px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                    disabled={updatingStatus}
                  >
                    Mark Pending
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}