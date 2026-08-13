'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// GreenSpark Brand Styles
const brandColors = {
  primary: '#15803D', // GreenSpark Green
  secondary: '#0F172A',
  accent: '#F0FDF4',
  border: '#E2E8F0'
};

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // ሁሉንም መረጃዎች ከ Supabase መሳብ
  const fetchAllRecords = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAllRecords(data);
  };

  useEffect(() => {
    if (isLoggedIn) fetchAllRecords();
  }, [isLoggedIn]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Arial, sans-serif' }}>
      {!isLoggedIn ? (
        // Login Section
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', backgroundColor: '#FFFFFF', borderRadius: '16px', border: `1px solid ${brandColors.border}`, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: brandColors.primary, fontSize: '28px', margin: 0 }}>GreenSpark</h2>
            <p style={{ color: '#64748B' }}>Admin Control Panel</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: `1px solid ${brandColors.border}` }} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: `1px solid ${brandColors.border}` }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: brandColors.primary, color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
          </form>
        </div>
      ) : (
        // Main Dashboard
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: brandColors.primary, margin: 0 }}>GreenSpark Management</h1>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', backgroundColor: '#DC2626', color: '#FFF', border: 'none', borderRadius: '6px' }}>Logout</button>
          </div>

          {/* Records Table */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: `1px solid ${brandColors.border}`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: brandColors.accent, textAlign: 'left' }}>
                  <th style={{ padding: '16px', color: brandColors.primary }}>Booking ID</th>
                  <th style={{ padding: '16px', color: brandColors.primary }}>Customer</th>
                  <th style={{ padding: '16px', color: brandColors.primary }}>Plate Number</th>
                  <th style={{ padding: '16px', color: brandColors.primary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: `1px solid ${brandColors.border}`, cursor: 'pointer' }} onClick={() => setSelectedRecord(record)}>
                    <td style={{ padding: '16px' }}>{record.booking_id}</td>
                    <td style={{ padding: '16px' }}>{record.full_name}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{record.plate_number}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: record.status === 'Completed' ? '#D1FAE5' : '#FEF3C7' }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}