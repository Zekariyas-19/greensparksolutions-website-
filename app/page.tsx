"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [lang, setLang] = useState<"am" | "en">("am");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [customerType, setCustomerType] = useState<"individual" | "company">("individual");
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tin, setTin] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState("");
  const [vehicleCounts, setVehicleCounts] = useState<{ [key: string]: number }>({});

  // Booking Retrieval States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleVehicleToggle = (key: string) => {
    setVehicleCounts((prev) => {
      const copy = { ...prev };
      if (copy[key] !== undefined) {
        delete copy[key];
      } else {
        copy[key] = 1;
      }
      return copy;
    });
  };

  const handleCountChange = (key: string, count: number) => {
    setVehicleCounts((prev) => ({
      ...prev,
      [key]: Math.max(1, count),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const uniqueId = `GS-${randomNum}`;

    const formData = {
      booking_id: uniqueId,
      customer_type: customerType,
      full_name: customerType === "individual" ? fullName : null,
      phone: customerType === "individual" ? phone : null,
      company_name: customerType === "company" ? companyName : null,
      tin_number: customerType === "company" ? tin : null,
      address: customerType === "company" ? address : null,
      vehicles: vehicleCounts,
    };

    try {
      const { error } = await supabase.from("bookings").insert([formData]);

      if (error) {
        throw error;
      }

      setGeneratedBookingId(uniqueId);
      setShowSuccessModal(true);

      setFullName("");
      setPhone("");
      setCompanyName("");
      setTin("");
      setAddress("");
      setVehicleCounts({});
    } catch (err: any) {
      console.error("Error inserting data details:", err.message || JSON.stringify(err));
      setStatusMessage({
        type: "error",
        text: lang === "am" ? `ስህተት: ${err.message || JSON.stringify(err)}` : `Error: ${err.message || JSON.stringify(err)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchResult(null);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .or(`full_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,booking_id.ilike.%${searchQuery}%`);

      if (error) throw error;
      setSearchResult(data || []);
    } catch (err) {
      console.error("Error searching bookings:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const content = {
    am: {
      navBook: "ቦታ ይያዙ",
      navTrack: "ቦታ ይፈልጉ",
      topBanner: "የነዳጅ ዋጋ ንረት መፍትሄ፡ ከ10 መኪና በላይ ለሚያስገጥሙ በቀጥታ በስልክ ይደውሉልን!",
      heroTitle1: "የነዳጅ ወጪዎን",
      heroTitle2: "ከ10% - 30%",
      heroTitle3: "ይቀንሱ",
      heroDesc: "Powering Efficiency, Protecting the Planet. የSUPERTECH እና Eco-Tech Solutions PLC መሣሪያን በመጠቀም የነዳጅ ወጪዎን ይቀንሱ።",
      feat1Title: "10-30% የነዳጅ ቁጠባ",
      feat1Desc: "በየቀኑ በሚያደርጉት እንቅስቃሴ ከፍተኛ የነዳጅ ወጪን በከፍተኛ ሁኔታ ይቀንሳል",
      feat2Title: "እስከ 80% በካይ ጋዝ ቅነሳ",
      feat2Desc: "የአየር ብክለትን በመቀነስ የአካባቢ ጥበቃ እና መመሪያ 1051/2017 ደንቦችን ያሟላል",
      feat3Title: "ዘላቂ አገልግሎት",
      feat3Desc: "ለረጅም ዓመታት ያለምንም ተጨማሪ ጥገና የሚያገለግል",
      bulkAlertTitle: "ከ 10 መኪና በላይ ለሚያስገጥሙ ድርጅቶች/ግለሰቦች",
      bulkAlertDesc: "ታንከር ውስጥ የሚገጠመውን ማሽን ከ 10 መኪና በላይ መግዛትና ማስገጥም ከፈለጉ፣ እባክዎ በቀጥታ በስልክ ቁጥሮቻችን ይደውሉልን።",
      callUsBtn: "አሁን ይደውሉ፡ +251-983-470000",
      formTitle: "የግዢ እና ተረኛ መያዣ ቅጽ",
      formSub: "መረጃዎን ያስገቡ፤ ባለሙያዎቻችን አነጋግረውዎት ተገቢውን SUPERTECH ሞዴል ይገጥሙልዎታል",
      tabIndividual: "ግለሰብ",
      tabCompany: "ድርጅት",
      labelFullName: "ሙሉ ስም",
      phFullName: "እባክዎን ስምዎን ያስገቡ",
      labelPhone: "ስልክ ቁጥር",
      phPhone: "0911...",
      labelCompanyName: "የድርጅቱ ስም",
      phCompanyName: "የድርጅቱን ስም ያስገቡ",
      labelTin: "የቲን ቁጥር",
      phTin: "የቲን ቁጥር ያስገቡ",
      labelAddress: "አድራሻ",
      phAddress: "ከተማ / ክፍለ ከተማ",
      labelVehicleSelection: "የተሽከርካሪ ታንከር የነዳጅ መጠን (በሊትር) እና ብዛት ይምረጡ",
      btnSubmit: "ቦታ ያዙ / ጥያቄ ይላኩ",
      searchSecTitle: "የደንበኛ ቦታ ማስያዣ መፈለጊያ (Booking Retrieval)",
      searchSecSub: "በስምዎ፣ በስልክ ቁጥርዎ ወይም በልዩ መለያ ቁጥርዎ (Booking ID) ይፈልጉ",
      searchPh: "ስም ወይም ስልክ ቁጥር ያስገቡ...",
      searchBtn: "ፈልግ",
      noResult: "ምንም የተገኘ መረጃ የለም።",
      modalTitle: "በተሳካ ሁኔታ ተልኳል! 🎉",
      modalIdLabel: "የእርስዎ ልዩ መለያ ቁጥር (Booking ID)፦",
      modalDesc: "ጥያቄዎ ደርሶናል። ባለሙያዎቻችን በቅርቡ በስልክ ቁጥርዎ ያነጋግሮታል። እባክዎን ይህንን መለያ ቁጥር ይያዙ።",
      modalBtn: "እሺ (Close)",
      tierAA: "AA (እስከ 10 ሊትር)",
      tierA: "A (እስከ 40 ሊትር)",
      tierB: "B (እስከ 70 ሊትር)",
      tierC: "C (እስከ 150 ሊትር)",
      tierD: "D (እስከ 350 ሊትር)",
      tierE: "E (800 እና ከዛ በላይ ሊትር)"
    },
    en: {
      navBook: "Book Now",
      navTrack: "Track Booking",
      topBanner: "Fuel Cost Solution: Call us directly for bulk installations of more than 10 vehicles!",
      heroTitle1: "Reduce Fuel Costs",
      heroTitle2: "By 10% - 30%",
      heroTitle3: "Guaranteed",
      heroDesc: "Powering Efficiency, Protecting the Planet. Optimize combustion and lower emissions with SUPERTECH and Eco-Tech Solutions PLC.",
      feat1Title: "10-30% Fuel Savings",
      feat1Desc: "Significant daily operational cost reduction for your vehicles",
      feat2Title: "80% Less Emissions",
      feat2Desc: "Dramatically reduces environmental air pollution complying with Directive 1051/2017",
      feat3Title: "Long-lasting Reliability",
      feat3Desc: "Built for extended durability with zero maintenance required",
      bulkAlertTitle: "For Fleet Owners (More than 10 Vehicles)",
      bulkAlertDesc: "If you are purchasing and installing machines for more than 10 vehicles, please contact us directly via phone.",
      callUsBtn: "Call Now: +251-983-470000",
      formTitle: "SUPERTECH Booking Form",
      formSub: "Fill out the details below to reserve your installation slot",
      tabIndividual: "Individual",
      tabCompany: "Company",
      labelFullName: "Full Name",
      phFullName: "Enter full name",
      labelPhone: "Phone Number",
      phPhone: "0911...",
      labelCompanyName: "Company Name",
      phCompanyName: "Enter company name",
      labelTin: "TIN Number",
      phTin: "Enter TIN number",
      labelAddress: "Address",
      phAddress: "City / Sub-city",
      labelVehicleSelection: "Select Vehicle Fuel Tank Capacity Tier & Quantity",
      btnSubmit: "Submit Booking Request",
      searchSecTitle: "Customer Booking Retrieval",
      searchSecSub: "Search your previous bookings using your name, phone number, or booking ID",
      searchPh: "Enter name or phone number...",
      searchBtn: "Search",
      noResult: "No bookings found.",
      modalTitle: "Successfully Submitted! 🎉",
      modalIdLabel: "Your Unique Tracking ID:",
      modalDesc: "Your request has been received. Our team will contact you shortly. Please save this reference ID.",
      modalBtn: "Close",
      tierAA: "AA (Up to 10 Liters)",
      tierA: "A (Up to 40 Liters)",
      tierB: "B (Up to 70 Liters)",
      tierC: "C (Up to 150 Liters)",
      tierD: "D (Up to 350 Liters)",
      tierE: "E (800 and above Liters)"
    }
  };

  const t = content[lang];

  const vehicleList = [
    { key: "AA", label: t.tierAA },
    { key: "A", label: t.tierA },
    { key: "B", label: t.tierB },
    { key: "C", label: t.tierC },
    { key: "D", label: t.tierD },
    { key: "E", label: t.tierE },
  ];

  const isDark = theme === "dark";

  return (
    <main className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? "bg-[#0B132B] text-slate-100 selection:bg-[#43B02A] selection:text-white" : "bg-[#F8FAFC] text-slate-800 selection:bg-[#43B02A] selection:text-white"}`}>
      {/* Top Banner Notice */}
      <div className="bg-[#00529B] text-white text-center py-2 px-4 text-xs md:text-sm font-bold tracking-wide">
        {t.topBanner}
      </div>

      {/* Top Brand Accent Line */}
      <div className="h-2 w-full bg-gradient-to-r from-[#00529B] via-[#43B02A] to-[#00529B]"></div>

      {/* Navigation Bar with Theme & Language Switchers */}
      <nav className={`flex justify-between items-center px-6 md:px-16 py-4 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm transition-colors duration-300 ${isDark ? "bg-[#0B132B]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="GreenSpark Solutions Logo" 
            className="h-10 md:h-14 w-auto object-contain" 
          />
          <div className={`flex flex-col justify-center border-l pl-3 ${isDark ? "border-slate-700" : "border-slate-300"}`}>
            <span className={`text-lg md:text-xl font-bold tracking-tight leading-tight ${isDark ? "text-white" : "text-[#00529B]"}`}>
              {isDark ? (
                <>
                  Gree<span className="text-[#43B02A]">n</span><span className="text-white">Spark</span>
                </>
              ) : (
                <>
                  <span className="text-[#43B02A]">Green</span><span className="text-[#00529B]">Spark</span>
                </>
              )}
            </span>
            <div className="flex items-center space-x-1">
              <div className={`h-[1px] w-4 ${isDark ? "bg-slate-500" : "bg-[#00529B]"}`}></div>
              <span className={`text-[9px] md:text-[10px] font-extrabold tracking-[0.2em] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                SOLUTIONS PLC
              </span>
              <div className={`h-[1px] w-4 ${isDark ? "bg-slate-500" : "bg-[#00529B]"}`}></div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
          <a href="#search-booking" className={`hover:text-[#43B02A] transition ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            {t.navTrack}
          </a>
          <a href="#booking" className="bg-[#43B02A] hover:bg-[#389623] text-white px-6 py-2.5 rounded-lg transition shadow-md shadow-[#43B02A]/20">
            {t.navBook}
          </a>

          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-lg border transition text-sm flex items-center justify-center ${isDark ? "border-slate-700 bg-[#1C2541] text-amber-400 hover:bg-slate-800" : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
            title="Toggle Light/Dark Mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as "am" | "en")}
            className={`font-bold px-3 py-2 rounded-lg focus:outline-none cursor-pointer border transition text-xs ${isDark ? "border-slate-700 bg-[#1C2541] text-white" : "border-slate-300 bg-slate-50 text-[#00529B]"}`}
          >
            <option value="am">አማርኛ</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-2 rounded-lg border text-xs ${isDark ? "border-slate-700 bg-[#1C2541] text-amber-400" : "border-slate-300 bg-slate-50 text-slate-700"}`}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as "am" | "en")}
            className={`font-bold px-2.5 py-1.5 rounded-lg border text-xs ${isDark ? "border-slate-700 bg-[#1C2541] text-white" : "border-slate-300 bg-slate-50 text-[#00529B]"}`}
          >
            <option value="am">አማ</option>
            <option value="en">EN</option>
          </select>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border text-base ${isDark ? "border-slate-700 bg-[#1C2541] text-white" : "border-slate-300 bg-slate-50 text-slate-800"}`}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className={`md:hidden flex flex-col space-y-3 px-6 py-5 border-b shadow-lg transition-colors duration-300 ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-slate-200"}`}>
          <a href="#search-booking" onClick={() => setMobileMenuOpen(false)} className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            {t.navTrack}
          </a>
          <a 
            href="#booking" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-[#43B02A] text-center hover:bg-[#389623] text-white px-4 py-2.5 rounded-lg font-medium shadow-md text-sm"
          >
            {t.navBook}
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-16 pb-12 max-w-5xl mx-auto">
        <h2 className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isDark ? "text-white" : "text-[#00529B]"}`}>
          {t.heroTitle1} <span className="text-[#43B02A]">{t.heroTitle2}</span> {t.heroTitle3}
        </h2>
        <p className={`text-base md:text-xl mb-12 max-w-2xl leading-relaxed font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          {t.heroDesc}
        </p>

        {/* Bulk Order Alert Box (More than 10 vehicles) */}
        <div className={`w-full max-w-3xl p-6 rounded-2xl border mb-10 text-left flex flex-col md:flex-row items-center justify-between gap-4 shadow-md ${isDark ? "bg-[#1C2541] border-[#43B02A]" : "bg-green-50 border-[#43B02A]"}`}>
          <div>
            <h4 className="text-[#43B02A] font-bold text-base mb-1">{t.bulkAlertTitle}</h4>
            <p className={`text-xs md:text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.bulkAlertDesc}</p>
          </div>
          <a 
            href="tel:+251983470000"
            className="whitespace-nowrap bg-[#00529B] hover:bg-[#00407a] text-white font-bold px-5 py-3 rounded-xl transition shadow text-xs md:text-sm"
          >
            {t.callUsBtn}
          </a>
        </div>

        {/* Benefits Cards */}
        <div id="benefits" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4 text-left">
          <div className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${isDark ? "border-slate-800 bg-[#1C2541] hover:border-[#43B02A]" : "border-slate-200 bg-white hover:border-[#43B02A]"}`}>
            <h4 className="text-[#43B02A] font-bold text-lg mb-2">{t.feat1Title}</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat1Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${isDark ? "border-slate-800 bg-[#1C2541] hover:border-[#00529B]" : "border-slate-200 bg-white hover:border-[#00529B]"}`}>
            <h4 className={`font-bold text-lg mb-2 ${isDark ? "text-[#60A5FA]" : "text-[#00529B]"}`}>{t.feat2Title}</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat2Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border transition shadow-sm hover:shadow-md ${isDark ? "border-slate-800 bg-[#1C2541] hover:border-[#43B02A]" : "border-slate-200 bg-white hover:border-[#43B02A]"}`}>
            <h4 className="text-[#43B02A] font-bold text-lg mb-2">{t.feat3Title}</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat3Desc}</p>
          </div>
        </div>
      </section>

      {/* Booking Retrieval / Search Section */}
      <section id="search-booking" className="max-w-2xl mx-auto px-4 py-8">
        <div className={`p-6 md:p-8 rounded-3xl shadow-lg border ${isDark ? "border-slate-800 bg-[#1C2541]" : "border-slate-200 bg-white"}`}>
          <h3 className={`text-lg md:text-xl font-bold text-center mb-1 ${isDark ? "text-white" : "text-[#00529B]"}`}>{t.searchSecTitle}</h3>
          <p className={`text-xs text-center mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.searchSecSub}</p>

          <form onSubmit={handleSearchBooking} className="flex gap-2">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPh}
              className={`flex-1 rounded-xl px-4 py-2.5 border text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white" : "border-slate-300 bg-slate-50 text-slate-900"}`}
            />
            <button 
              type="submit"
              disabled={searchLoading}
              className="bg-[#00529B] hover:bg-[#00407a] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow"
            >
              {searchLoading ? "..." : t.searchBtn}
            </button>
          </form>

          {searchResult !== null && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              {searchResult.length === 0 ? (
                <p className={`text-xs text-center py-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.noResult}</p>
              ) : (
                searchResult.map((item, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border text-xs space-y-1 ${isDark ? "border-slate-700 bg-[#0B132B]" : "border-slate-200 bg-slate-50"}`}>
                    <div className="flex justify-between font-bold text-[#43B02A]">
                      <span>ID: {item.booking_id}</span>
                      <span className="uppercase">{item.customer_type}</span>
                    </div>
                    <p><span className="font-semibold">Name/Company:</span> {item.full_name || item.company_name}</p>
                    <p><span className="font-semibold">Phone:</span> {item.phone || item.address}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="max-w-2xl mx-auto px-4 pb-20 pt-4">
        <div className={`p-6 md:p-10 rounded-3xl shadow-xl border transition-colors duration-300 ${isDark ? "border-slate-800 bg-[#1C2541]" : "border-slate-200 bg-white"}`}>
          <h3 className={`text-xl md:text-2xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-[#00529B]"}`}>{t.formTitle}</h3>
          <p className={`text-xs text-center mb-6 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.formSub}</p>

          <div className={`flex p-1.5 rounded-xl border mb-6 ${isDark ? "bg-[#0B132B] border-slate-800" : "bg-slate-100 border-slate-200"}`}>
            <button
              type="button"
              onClick={() => setCustomerType("individual")}
              className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition ${
                customerType === "individual"
                  ? "bg-[#00529B] text-white shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabIndividual}
            </button>
            <button
              type="button"
              onClick={() => setCustomerType("company")}
              className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-lg transition ${
                customerType === "company"
                  ? "bg-[#00529B] text-white shadow-sm"
                  : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabCompany}
            </button>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm mb-4 font-semibold text-center border ${isDark ? "bg-red-950/50 border-red-800 text-red-400" : "bg-red-50 border-red-300 text-red-600"}`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {customerType === "individual" && (
              <>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelFullName}</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.phFullName} 
                    className={`w-full rounded-xl px-4 py-3 border transition text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelPhone}</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phPhone} 
                    className={`w-full rounded-xl px-4 py-3 border transition text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                  />
                </div>
              </>
            )}

            {customerType === "company" && (
              <>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelCompanyName}</label>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.phCompanyName} 
                    className={`w-full rounded-xl px-4 py-3 border transition text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelTin}</label>
                    <input 
                      type="text" 
                      required
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}
                      placeholder={t.phTin} 
                      className={`w-full rounded-xl px-4 py-3 border transition text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelAddress}</label>
                    <input 
                      type="text" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.phAddress} 
                      className={`w-full rounded-xl px-4 py-3 border transition text-sm focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#0B132B] text-white placeholder-slate-500" : "border-slate-300 bg-slate-50 text-slate-900"}`}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <label className={`block text-sm font-bold mb-3 ${isDark ? "text-slate-300" : "text-[#00529B]"}`}>
                {t.labelVehicleSelection}
              </label>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {vehicleList.map((item) => {
                  const isSelected = vehicleCounts[item.key] !== undefined;
                  return (
                    <div 
                      key={item.key} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                        isSelected 
                          ? isDark ? "border-[#43B02A] bg-[#43B02A]/10 shadow-sm" : "border-[#43B02A] bg-[#43B02A]/5 shadow-sm" 
                          : isDark ? "border-slate-800 bg-[#0B132B]" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleVehicleToggle(item.key)}
                          className="w-4 h-4 accent-[#43B02A] rounded cursor-pointer"
                        />
                        <span className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{item.label}</span>
                      </label>

                      {isSelected && (
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>ብዛት፦</span>
                          <input 
                            type="number" 
                            min="1"
                            value={vehicleCounts[item.key]}
                            onChange={(e) => handleCountChange(item.key, parseInt(e.target.value) || 1)}
                            className={`w-16 rounded-xl px-2.5 py-1.5 text-center text-sm border focus:outline-none focus:border-[#43B02A] ${isDark ? "border-slate-700 bg-[#1C2541] text-white" : "border-slate-300 bg-white text-slate-900"}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#43B02A] hover:bg-[#389623] text-white font-bold py-3.5 rounded-xl transition mt-6 shadow-lg shadow-[#43B02A]/20 text-base disabled:opacity-50"
            >
              {loading ? (lang === "am" ? "በመላክ ላይ..." : "Submitting...") : t.btnSubmit}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t pt-12 pb-6 px-6 md:px-16 transition-colors duration-300 ${isDark ? "bg-[#050B14] text-slate-300 border-slate-800" : "bg-slate-900 text-slate-200 border-slate-800"}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          
          <div className="space-y-4">
            <div className={`p-2.5 rounded-xl inline-flex items-center gap-2 border shadow-md ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-transparent"}`}>
              <img src="/logo.png" alt="GreenSpark Logo" className="h-8 object-contain" />
              <div className="flex flex-col">
                <span className={`font-bold text-xs leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {isDark ? (
                    <>
                      Gree<span className="text-[#43B02A]">n</span><span className="text-white">Spark</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#43B02A]">Green</span><span className="text-[#00529B]">Spark</span>
                    </>
                  )}
                </span>
                <span className={`text-[8px] font-bold tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>SOLUTIONS PLC</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              GreenSpark Solutions PLC (Eco-Tech Solutions partner) distributes SUPERTECH devices. Complying with Environmental Protection laws and Directive 1051/2017.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold tracking-wide text-white">Contact</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Gerji, Giorgis Business Shops, Building 5, Office New/248,<br />
              Bole Sub city, Woreda 13
            </p>
            <div className="text-xs space-y-1 text-slate-400">
              <p><span className="font-semibold text-white">Phone:</span> +251-983-470000 / +251-911-209255</p>
              <p><span className="font-semibold text-white">Email:</span> info@greensparksolutions.et</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold tracking-wide text-white">References & Links</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#booking" className="hover:text-[#43B02A] transition">SUPERTECH Booking</a></li>
              <li><span className="text-slate-300">Eco-Tech Solutions PLC</span></li>
              <li><span className="text-slate-300">Directive 1051/2017 Compliance</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold tracking-wide text-white">Social media</h3>
            <div className="flex flex-col space-y-2 text-xs text-slate-400">
              <a href="https://facebook.com/greenspark.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#43B02A] transition flex items-center gap-1.5">
                <span>🌐</span> Facebook
              </a>
              <a href="https://t.me/greenspark_solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#43B02A] transition flex items-center gap-1.5">
                <span>✈️</span> Telegram
              </a>
              <a href="https://www.tiktok.com/@greenspark.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#43B02A] transition flex items-center gap-1.5">
                <span>🎬</span> TikTok
              </a>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center">
          <p className="font-medium text-slate-300 tracking-wide">Powering Efficiency, Protecting the Planet.</p>
          <p>© {new Date().getFullYear()} GreenSpark Solutions PLC. All rights reserved.</p>
        </div>
      </footer>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl text-center ${isDark ? "border-slate-800 bg-[#1C2541] text-white" : "border-slate-200 bg-white text-slate-900"}`}>
            <div className="w-16 h-16 bg-[#43B02A]/20 border border-[#43B02A] text-[#43B02A] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-[#00529B]"}`}>{t.modalTitle}</h3>
            
            <div className={`my-4 p-4 rounded-2xl border text-center ${isDark ? "border-green-800 bg-green-950/40" : "border-green-200 bg-green-50"}`}>
              <span className={`text-xs block mb-1 font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.modalIdLabel}</span>
              <span className="text-xl font-black text-[#43B02A] tracking-wider font-mono">{generatedBookingId}</span>
            </div>

            <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {t.modalDesc}
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#43B02A] hover:bg-[#389623] text-white font-bold py-3 rounded-xl transition shadow-lg shadow-[#43B02A]/20 text-sm"
            >
              {t.modalBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}