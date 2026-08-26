'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('bookings').insert([
        { full_name: fullName, phone, vehicle_type: vehicleType, customer_type: 'individual' }
      ]);
      if (error) throw error;
      setShowSuccessModal(true);
      setFullName('');
      setPhone('');
      setVehicleType('');
    } catch (err) {
      console.error('Error inserting data:', err);
      alert('ስህተት ተፈጥሯል፤ እባክዎ እንደገና ይሞክሩ።');
    }
  };

  const t = {
    modalDesc: "ቦታ ማስያዝዎ ወይም ጥያቄዎ በተሳካ ሁኔታ ተቀባይነት አግኝቷል። በቅርቡ እናነጋግርዎታለን።",
    modalBtn: "እሺ (Close)"
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-[#43B02A]">GreenSpark Solutions PLC</div>
          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#home" className="hover:text-[#43B02A]">Home</a>
            <a href="#about" className="hover:text-[#43B02A]">About Us</a>
            <a href="#values" className="hover:text-[#43B02A]">Values</a>
            <a href="#services" className="hover:text-[#43B02A]">Services</a>
            <a href="#get-started" className="hover:text-[#43B02A]">Get Started / Book Installation</a>
            <a href="#founders" className="hover:text-[#43B02A]">Founders</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-green-900 to-[#43B02A] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extxl font-bold mb-6">የመኪና ከባይ ጋዝ ልቀትን የሚቀንሱ ዘመናዊ ቴክኖሎጂዎች</h1>
          <p className="text-lg md:text-xl mb-8">ለተሽከርካሪዎ አስተማማኝ መፍትሄ በመስጠት አከባቢን ከብክለት እንጠብቃለን።</p>
          <a href="#get-started" className="bg-white text-[#43B02A] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
            አሁን ይጀምሩ (Book Installation)
          </a>
        </div>
      </section>

      {/* About Us & Partnerships / Links Section */}
      <section id="about" className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">About Us & Legal Framework</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-base leading-relaxed mb-4">
              GreenSpark Solutions PLC አውቶሞቲቭ ዕቃዎችን እና ማሽነሪዎችን በማቅረብ የተሽከርካሪዎችን ከባይ ጋዝ ልቀት በከፍተኛ ሁኔታ የሚቀንሱ ዘመናዊ አሰራሮችን ያስተዋውቃል።
            </p>
            <p className="text-base leading-relaxed mb-4">
              ድርጅታችን ከሀገር አቀፍ እና አለም አቀፍ የኢኮኖሚና ቴክኖሎጂ አጋሮች ጋር በቅርበት ይሰራል፤ ለምሳሌም ከ <strong>Supertech</strong> እና <strong>Eco-Tech Solutions PLC</strong> ጋር ያለን ትብብር የጎላ ነው።
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#43B02A]">
            <h3 className="text-xl font-bold mb-3">ህጎች እና መመሪያዎች (Regulations)</h3>
            <p className="text-sm text-gray-600 mb-4">
              እንቅስቃሴያችን ሙሉ በሙሉ ከአካባቢ ጥበቃ ህጎች ጋር የተጣጣመ ሲሆን፣ በተለይም ከ <strong>Directive 1051/2017</strong> አንፃር የවාייה (Emission) ገደቦችን በጥብቅ ይከተላል።
            </p>
            <a 
              href="https://www.epa.gov" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#43B02A] font-semibold hover:underline inline-block"
            >
              ተጨማሪ የአካባቢ ጥበቃ መመሪያዎችን ይመልከቱ &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Values (እሴቶቻችን)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2 text-[#43B02A]">ዘላቂነት (Sustainability)</h3>
              <p className="text-sm text-gray-600">ለታዳሽ እና ንጹህ አየር ቅድሚያ መስጠት።</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2 text-[#43B02A]">ጥራት (Quality)</h3>
              <p className="text-sm text-gray-600">ከፍተኛ ደረጃቸውን የጠበቁ አውቶሞቲቭ ዕቃዎችን ማቅረብ።</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2 text-[#43B02A]">ታማኝነት (Trust)</h3>
              <p className="text-sm text-gray-600">ለህብረተሰቡ እና ለደንበኞቻችን ግልጽ አገልገሎት መስጠት።</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Services (አገልግሎቶቻችን)</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-3 text-[#43B02A]">የልቀት መቀነሻ መሳሪያዎች ሽያጭ</h3>
            <p className="text-gray-600 text-sm">ለተለያዩ የመኪና አይነቶች የሚሆኑ እና ከባይ ጋዝን የሚቀንሱ ዘመናዊ መሣሪያዎችን እናቀርባለን።</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-xl font-bold mb-3 text-[#43B02A]">የቴክኒክ ድጋፍ እና ዕገዛ</h3>
            <p className="text-gray-600 text-sm">መሣሪያዎቹን በተሽከርካሪዎች ላይ መግጠም እና የጥገና አገልግሎቶችን መስጠት።</p>
          </div>
        </div>
      </section>

      {/* Get Started / Book Installation Section */}
      <section id="get-started" className="bg-green-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Get Started / Book Installation</h2>
          <form onSubmit={handleSubmit} className="space-name space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ሙሉ ስም (Full Name)</label>
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#43B02A] outline-none"
                placeholder="ስምዎን ያስገቡ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ስልክ ቁጥር (Phone Number)</label>
              <input 
                type="text" 
                required 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#43B02A] outline-none"
                placeholder="09..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">የተሽከርካሪ አይነት (Vehicle Type)</label>
              <input 
                type="text" 
                required 
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#43B02A] outline-none"
                placeholder="ለምሳሌ፦ መኪና አይነት..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#43B02A] text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              ቦታ ያስይዙ (Submit Booking)
            </button>
          </form>
        </div>
      </section>

      {/* Founders Section */}
      <section id="founders" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Founders (መስራቾች)</h2>
        <p className="text-gray-600 mb-8">GreenSpark Solutions PLC በወደፊት ተኮር እና አረንጓዴ ቴክኖሎጂ ባለሙያዎች የተመሰረተ ድርጅት ነው።</p>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-[#43B02A]">በተሳካ ሁኔታ ተመዝግቧል!</h3>
            <p className="text-xs leading-relaxed mb-6">{t.modalDesc}</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#43B02A] text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
            >
              {t.modalBtn}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 text-center text-sm">
        <p>&copy; 2026 GreenSpark Solutions PLC. All rights reserved.</p>
      </footer>
    </main>
  );
}