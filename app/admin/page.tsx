'use client';

import { useState } from 'react';
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

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [address, setAddress] = useState('');
  
  const vehicleOptions = [
    'AA (Up to 10 Liters)',
    'A (Up to 40 Liters)',
    'B (Up to 70 Liters)',
    'C (Up to 150 Liters)',
    'D (Up to 350 Liters)',
    'E (800 and above Liters)'
  ];

  const [selectedVehicles, setSelectedVehicles] = useState<{ [key: string]: number }>({});
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
    
    if (Array.isArray(vehiclesData)) {
      return vehiclesData.join(', ');
    }
    
    if (typeof vehiclesData === 'object') {
      return Object.entries(vehiclesData)
        .map(([name, qty]) => `${name} (${qty})`)
        .join(', ');
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
      setSelectedRecord((prev: any) => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCheckboxChange = (vName: string) => {
    setSelectedVehicles(prev => {
      const updated = { ...prev };
      if (updated[vName] !== undefined) {
        delete updated[vName];
      } else {
        updated[vName] = 1;
      }
      return updated;
    });
  };

  const handleQuantityChange = (vName: string, qty: number) => {
    if (qty < 1) return;
    setSelectedVehicles(prev => ({
      ...prev,
      [vName]: qty
    }));
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim()) {
      alert('Please enter full name or company name.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter phone number.');
      return;
    }

    if (Object.keys(selectedVehicles).length === 0) {
      alert('Please select at least one vehicle option.');
      return;
    }

    if (registrationType === 'corporate' && !tinNumber.trim()) {
      alert('Please enter TIN number.');
      return;
    }

    if (!address.trim()) {
      alert('Please enter address.');
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
            full_name: fullName.trim(),
            customer_type: isCorp ? 'company' : 'individual',
            phone: phone.trim(),
            vehicles: selectedVehicles, 
            tin_number: isCorp ? tinNumber.trim() : null,
            address: address.trim(),
            status: 'Pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        alert('Error saving record: ' + error.message);
      } else {
        alert('Registration completed successfully!');
        setFullName('');
        setPhone('');
        setTinNumber('');
        setAddress('');
        setSelectedVehicles({});
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
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', color: '#0F172A', padding: '24px', fontFamily: 'sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ maxWidth: '400px', margin: '80px auto', backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src="/logo.png" 
              alt="GreenSpark Logo" 
              style={{ width: '50px', height: '50px', objectFit: 'contain', margin: '0 auto 8px auto', display: 'block' }} 
            />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#16A34A', margin: 0 }}>
              Staff Admin Login
            </h1>
          </div>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#334155' }}>Username:</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#334155' }}>Password:</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px', paddingRight: '45px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {loginError && <p style={{ color: '#DC2626', fontSize: '14px' }}>{loginError}</p>}

            <button 
              type="submit"
              style={{ width: '100%', backgroundColor: '#16A34A', color: '#FFFFFF', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/logo.png" 
                alt="GreenSpark Logo" 
                style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
              />
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#16A34A', margin: 0 }}>
                GreenSpark Management
              </h1>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              style={{ backgroundColor: '#DC2626', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
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
                backgroundColor: activeTab === 'register' ? '#0F385A' : '#FFFFFF',
                color: activeTab === 'register' ? '#FFFFFF' : '#334155',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              Records
            </button>
            <button
              onClick={() => setActiveTab('new-registration')}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'new-registration' ? '#16A34A' : '#FFFFFF',
                color: activeTab === 'new-registration' ? '#FFFFFF' : '#334155',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              New Walk-in
            </button>
          </div>

          {activeTab === 'register' ? (
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSubRegisterTab('personal')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'personal' ? '#F0FDF4' : 'transparent',
                    color: subRegisterTab === 'personal' ? '#16A34A' : '#64748B',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'personal' ? '#BBF7D0' : 'transparent'
                  }}
                >
                  Personal ({personalRecords.length})
                </button>
                <button
                  onClick={() => setSubRegisterTab('corporate')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'corporate' ? '#F0FDF4' : 'transparent',
                    color: subRegisterTab === 'corporate' ? '#16A34A' : '#64748B',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'corporate' ? '#BBF7D0' : 'transparent'
                  }}
                >
                  Corporate ({corporateRecords.length})
                </button>
                <button
                  onClick={() => setSubRegisterTab('completed')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: subRegisterTab === 'completed' ? '#ECFDF5' : 'transparent',
                    color: subRegisterTab === 'completed' ? '#047857' : '#64748B',
                    border: '1px solid',
                    borderColor: subRegisterTab === 'completed' ? '#A7F3D0' : 'transparent'
                  }}
                >
                  Completed ({completedRecords.length})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input 
                  type="text"
                  placeholder="Search by Booking ID, name or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '14px', boxSizing: 'border-box' }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ backgroundColor: '#E2E8F0', color: '#334155', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={fetchAllRecords}
                  style={{ backgroundColor: '#E2E8F0', color: '#334155', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                >
                  {fetchingRecords ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {fetchingRecords ? (
                  <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>Loading records...</p>
                ) : displayedRecords.length === 0 ? (
                  <p style={{ color: '#64748B', textAlign: 'center', padding: '20px' }}>No records found.</p>
                ) : (
                  displayedRecords.map((item, index) => {
                    const isDone = (item.status || '').toLowerCase().includes('complet');
                    return (
                      <div 
                        key={item.id || index} 
                        onClick={() => setSelectedRecord(item)}
                        style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '13px', backgroundColor: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                              ID: {getBookingIdDisplay(item)}
                            </span>
                            <p style={{ fontWeight: 'bold', margin: 0, fontSize: '16px', color: '#16A34A' }}>
                              {getDisplayName(item)}
                            </p>
                          </div>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: '6px 0 0 0' }}>
                            {item.phone ? `Phone: ${item.phone}` : (item.customer_type || 'Record')}
                          </p>
                        </div>
                        <span style={{ fontSize: '12px', backgroundColor: isDone ? '#D1FAE5' : '#FEF3C7', color: isDone ? '#065F46' : '#92400E', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold' }}>
                          {item.status || 'Pending'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', margin: 0, color: '#0F385A' }}>
                  New Walk-in Registration Form
                </h2>
                <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 'bold' }}>(All fields are required)</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setRegistrationType('personal')}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    backgroundColor: registrationType === 'personal' ? '#16A34A' : '#FFFFFF', 
                    color: registrationType === 'personal' ? '#FFFFFF' : '#0F385A', 
                    border: '1px solid',
                    borderColor: registrationType === 'personal' ? '#16A34A' : '#CBD5E1',
                    boxShadow: registrationType === 'personal' ? '0 4px 6px -1px rgba(22, 163, 74, 0.2)' : 'none'
                  }}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType('corporate')}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    backgroundColor: registrationType === 'corporate' ? '#16A34A' : '#FFFFFF', 
                    color: registrationType === 'corporate' ? '#FFFFFF' : '#0F385A', 
                    border: '1px solid',
                    borderColor: registrationType === 'corporate' ? '#16A34A' : '#CBD5E1',
                    boxShadow: registrationType === 'corporate' ? '0 4px 6px -1px rgba(22, 163, 74, 0.2)' : 'none'
                  }}
                >
                  Corporate
                </button>
              </div>

              <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#0F385A', fontWeight: '500' }}>
                    {registrationType === 'personal' ? 'Full Name *:' : 'Company Name *:'}
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={registrationType === 'personal' ? 'Enter full name...' : 'Enter company name...'}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#0F385A', fontWeight: '500' }}>Phone Number *:</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0911..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#16A34A', fontWeight: 'bold' }}>
                    Vehicle Types and Quantities *:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
                    {vehicleOptions.map((vName) => {
                      const isSelected = selectedVehicles[vName] !== undefined;
                      const quantity = selectedVehicles[vName] || 1;
                      return (
                        <div 
                          key={vName} 
                          style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: '8px', 
                            backgroundColor: '#FFFFFF', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            border: `1px solid ${isSelected ? '#16A34A' : '#E2E8F0'}`,
                            transition: 'all 0.2s'
                          }}
                        >
                          <div 
                            onClick={() => handleCheckboxChange(vName)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                          >
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} 
                              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#16A34A' }}
                            />
                            <span style={{ fontSize: '13px', color: '#0F385A', fontWeight: '500', userSelect: 'none' }}>{vName}</span>
                          </div>

                          {isSelected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', paddingLeft: '28px' }}>
                              <span style={{ fontSize: '12px', color: '#64748B' }}>Qty:</span>
                              <input 
                                type="number" 
                                min="1" 
                                value={quantity}
                                onChange={(e) => handleQuantityChange(vName, parseInt(e.target.value) || 1)}
                                onClick={(e) => e.stopPropagation()}
                                style={{ width: '70px', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', fontSize: '14px' }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {registrationType === 'corporate' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#0F385A', fontWeight: '500' }}>TIN Number *:</label>
                    <input 
                      type="text" 
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      placeholder="Enter TIN number..."
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: '#0F385A', fontWeight: '500' }}>Address *:</label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', boxSizing: 'border-box' }}
                  />
                </div>

                <button 
                  type="submit"
                  style={{ width: '100%', backgroundColor: '#16A34A', color: '#FFFFFF', padding: '12px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '8px' }}
                  disabled={submittingWalkIn}
                >
                  {submittingWalkIn ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </div>
          )}

          {selectedRecord && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0F385A', margin: 0 }}>Booking Details</h3>
                  <button 
                    onClick={() => setSelectedRecord(null)}
                    style={{ backgroundColor: '#E2E8F0', color: '#334155', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#334155', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <p style={{ margin: 0, color: '#0F385A', fontWeight: 'bold' }}><strong>Booking ID:</strong> {getBookingIdDisplay(selectedRecord)}</p>
                  <p style={{ margin: 0 }}><strong>Name / Company:</strong> {getDisplayName(selectedRecord)}</p>
                  <p style={{ margin: 0 }}><strong>Phone Number:</strong> {selectedRecord.phone || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Vehicles:</strong> {renderVehicleDetails(selectedRecord.vehicles)}</p>
                  {selectedRecord.tin_number && <p style={{ margin: 0 }}><strong>TIN Number:</strong> {selectedRecord.tin_number}</p>}
                  <p style={{ margin: 0 }}><strong>Address:</strong> {selectedRecord.address || 'N/A'}</p>
                  <p style={{ margin: 0 }}><strong>Status:</strong> {selectedRecord.status || 'Pending'}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    onClick={() => handleUpdateStatus(selectedRecord.id || selectedRecord.booking_id, 'Completed')}
                    disabled={updatingStatus}
                    style={{ flex: 1, backgroundColor: '#16A34A', color: '#FFFFFF', padding: '10px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                  >
                    {updatingStatus ? 'Updating...' : 'Mark Completed'}
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