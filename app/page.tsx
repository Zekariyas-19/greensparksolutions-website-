"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [lang, setLang] = useState<"am" | "en">("am");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  const [customerType, setCustomerType] = useState<"individual" | "company">("individual");
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [plate, setPlate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tin, setTin] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState("");

  const [vehicleCounts, setVehicleCounts] = useState<{ [key: string]: number }>({});

  const [dailyKm, setDailyKm] = useState<number>(300);
  const [totalVehicles, setTotalVehicles] = useState<number>(5);

  const estimatedDailySavings = Math.round(totalVehicles * (dailyKm / 3) * 0.12 * 180.46);
  const estimatedYearlySavings = Math.round(estimatedDailySavings * 180);

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
      plate_number: customerType === "individual" ? plate : null,
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
      setPlate("");
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

  const content = {
    am: {
      navServices: "ጥቅሞች",
      navCalc: "የቁጠባ ማስያ",
      navBook: "ቦታ ይያዙ",
      heroBadge: "SUPERTECH - የነዳጅ ቁጠባ እና የአካባቢ ጥበቃ መፍትሔ",
      heroTitle1: "የነዳጅ ወጪዎን",
      heroTitle2: "ከ10% - 30%",
      heroTitle3: "ይቀንሱ",
      heroDesc: "የSUPERTECH መሣሪያን በነዳጅ ታንከር ውስጥ በመግጠም የበካይ ጋዝ ልቀትን እስከ 80% ይቀንሱ፤ የመኪናዎን ሞተር እድሜን ያራዝሙ። ምንም አይነት የሞተር ማሻሻያ የማይፈልግ።",
      feat1Title: "10-30% የነዳጅ ቁጠባ",
      feat1Desc: "በየቀኑ በሚያደርጉት እንቅስቃሴ ከፍተኛ የነዳጅ ወጪን በከፍተኛ ሁኔታ ይቀንሳል",
      feat2Title: "እስከ 80% ከመኪናዎ የሚወጣውን በካይ ጋዝ ይቀንሳል",
      feat2Desc: "የአየር ብክለትን በመቀነስ የአካባቢ ጥበቃ ደንቦችን ያሟላል",
      feat3Title: "5 ዓመት ዋስትና",
      feat3Desc: "እስከ 10 ዓመት ያለምንም ተጨማሪ ወጪና ጥገና የሚያገለግል",
      calcTitle: "የነዳጅ ወጪ ቁጠባ ማስያ (ROI Calculator)",
      calcSub: "ተሽከርካሪዎችዎ በቀን የሚያደርጉትን ጉዞ እና ብዛት በማስገባት የሚቆጥቡትን የብር መጠን ይመልከቱ",
      calcVehiclesLabel: "የተሽከርካሪዎች ብዛት፦",
      calcKmLabel: "በቀን የሚያደርጉት አማካይ ጉዞ (ኪ.ሜ)፦",
      calcDailyEst: "የቀን የገንዘብ ቁጠባ (ግምት)፦",
      calcYearlyEst: "የ1 ዓመት የገንዘብ ቁጠባ (ግምት)፦",
      currency: "ብር",
      formTitle: "የግዢ እና ተረኛ መያዣ ቅጽ",
      formSub: "መረጃዎን ያስገቡ፤ ባለሙያዎቻችን አነጋግረውዎት ተገቢውን SUPERTECH ሞዴል ይገጥሙልዎታል",
      tabIndividual: "ግለሰብ",
      tabCompany: "ድርጅት",
      labelFullName: "ሙሉ ስም",
      phFullName: "እባክዎን ስምዎን ያስገቡ",
      labelPhone: "ስልክ ቁጥር",
      phPhone: "0911...",
      labelPlate: "ሰሌዳ ቁጥር",
      phPlate: "3 - A12345",
      labelCompanyName: "የድርጅቱ ስም",
      phCompanyName: "የድርጅቱን ስም ያስገቡ",
      labelTin: "የቲን ቁጥር",
      phTin: "የቲን ቁጥር ያስገቡ",
      labelAddress: "አድራሻ",
      phAddress: "ከተማ / ክፍለ ከተማ",
      labelVehicleSelection: "የተሽከርካሪ ዓይነቶች እና ብዛት (የሚፈልጉትን ይምረጡ)",
      btnSubmit: "ቦታ ያዙ / ጥያቄ ይላኩ",
      modalTitle: "በተሳካ ሁኔታ ተልኳል! 🎉",
      modalIdLabel: "የእርስዎ ልዩ መለያ ቁጥር (Booking ID)፦",
      modalDesc: "ጥያቄዎ ደርሶናል። ባለሙያዎቻችን በቅርቡ በስልክ ቁጥርዎ ያነጋግሮታል። እባክዎን ይህንን መለያ ቁጥር ይያዙ።",
      modalBtn: "እሺ (Close)",
      catPersonal: "የቤት መኪና",
      subMinibus: "ሚኒባስ",
      subBus: "ባስ / አውቶቡስ",
      subPickup: "ፒካፕ",
      subIsuzu: "የደረቅ ጭነት",
      subTrailer: "የደረቅ ጭነት ተሳቢ",
      subBotti: "ቦቲ",
      subTrailerBotti: "ተሳቢ ቦቲ"
    },
    en: {
      navServices: "Benefits",
      navCalc: "Calculator",
      navBook: "Book Now",
      heroBadge: "SUPERTECH - Fuel Efficiency & Sustainability",
      heroTitle1: "Reduce Fuel Costs",
      heroTitle2: "By 10% - 30%",
      heroTitle3: "Guaranteed",
      heroDesc: "Optimize combustion, lower toxic gas emissions by up to 80%, and extend engine life with zero engine modifications required.",
      feat1Title: "10-30% Fuel Savings",
      feat1Desc: "Significant daily operational cost reduction for your vehicles",
      feat2Title: "80% Less Emissions",
      feat2Desc: "Dramatically reduces CO2, NOx and particulate air pollution",
      feat3Title: "5-Year Warranty",
      feat3Desc: "10 years lifespan with zero maintenance required",
      calcTitle: "Fuel Savings Calculator (ROI)",
      calcSub: "Estimate your financial savings based on daily mileage and fleet size",
      calcVehiclesLabel: "Number of Vehicles:",
      calcKmLabel: "Avg. Daily Mileage (KM):",
      calcDailyEst: "Est. Daily Savings:",
      calcYearlyEst: "Est. 1-Year Savings:",
      currency: "ETB",
      formTitle: "SUPERTECH Booking Form",
      formSub: "Fill out the details below to reserve your installation slot",
      tabIndividual: "Individual Vehicle",
      tabCompany: "Company Fleet",
      labelFullName: "Full Name",
      phFullName: "Enter full name",
      labelPhone: "Phone Number",
      phPhone: "0911...",
      labelPlate: "License Plate Number",
      phPlate: "3 - A12345",
      labelCompanyName: "Company Name",
      phCompanyName: "Enter company name",
      labelTin: "TIN Number",
      phTin: "Enter TIN number",
      labelAddress: "Address",
      phAddress: "City / Sub-city",
      labelVehicleSelection: "Select Vehicle Types & Quantities",
      btnSubmit: "Submit Booking Request",
      modalTitle: "Successfully Submitted! 🎉",
      modalIdLabel: "Your Unique Tracking ID:",
      modalDesc: "Your request has been received. Our team will contact you shortly. Please save this reference ID.",
      modalBtn: "Close",
      catPersonal: "Personal Vehicle",
      subMinibus: "Minibus",
      subBus: "Bus",
      subPickup: "Pickup",
      subIsuzu: "Isuzu",
      subBotti: "Tanker Botti",
      subTrailer: "Dry Cargo Trailer",
      subTrailerBotti: "Trailer Tanker"
    }
  };

  const t = content[lang];

  const vehicleList = [
    { key: "personal", label: t.catPersonal },
    { key: "minibus", label: t.subMinibus },
    { key: "bus", label: t.subBus },
    { key: "pickup", label: t.subPickup },
    { key: "isuzu", label: t.subIsuzu },
    { key: "trailer", label: t.subTrailer },
    { key: "botti", label: t.subBotti },
    { key: "trailerBotti", label: t.subTrailerBotti },
  ];

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    }`}>
      {/* ናቪጌሽን ባር */}
      <nav className={`flex justify-between items-center px-4 md:px-8 py-4 border-b sticky top-0 z-40 transition-colors ${
        isDarkMode ? "border-slate-800 bg-slate-950/95 backdrop-blur-md" : "border-slate-200 bg-white/95 backdrop-blur-md"
      }`}>
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="GreenSpark Logo" 
            className="w-10 h-10 md:w-12 md:h-12 object-contain" 
          />
          <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold tracking-tight text-green-500 leading-none">GreenSpark</span>
            <span className="text-[9px] md:text-[10px] text-slate-400 tracking-widest uppercase">Solutions PLC</span>
          </div>
        </div>
        
        {/* የዴስክቶፕ ሜኑ */}
        <div className="hidden md:flex items-center space-x-5 text-sm font-medium">
          <a href="#benefits" className="hover:text-green-500 transition">{t.navServices}</a>
          <a href="#calculator" className="hover:text-green-500 transition">{t.navCalc}</a>
          <a href="#booking" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition shadow-md shadow-green-600/20">
            {t.navBook}
          </a>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-lg border text-lg leading-none transition ${
              isDarkMode 
                ? "bg-slate-900 border-slate-700 text-yellow-400 hover:bg-slate-800" 
                : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as "am" | "en")}
            className={`font-semibold px-3 py-2 rounded-lg focus:outline-none cursor-pointer border text-xs transition ${
              isDarkMode 
                ? "bg-slate-900 border-slate-700 text-green-400" 
                : "bg-slate-100 border-slate-300 text-green-700"
            }`}
          >
            <option value="am">አማርኛ</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* የስልክ መቆጣጠሪያዎች */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg border text-sm transition ${
              isDarkMode ? "bg-slate-900 border-slate-700 text-yellow-400" : "bg-slate-100 border-slate-300 text-slate-700"
            }`}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as "am" | "en")}
            className={`font-semibold px-2 py-1.5 rounded-lg focus:outline-none border text-xs ${
              isDarkMode ? "bg-slate-900 border-slate-700 text-green-400" : "bg-slate-100 border-slate-300 text-green-700"
            }`}
          >
            <option value="am">አማ</option>
            <option value="en">EN</option>
          </select>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border text-base ${
              isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-100 border-slate-300 text-slate-900"
            }`}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* የሞባይል ድሮፕዳው ሜኑ */}
      {mobileMenuOpen && (
        <div className={`md:hidden flex flex-col space-y-3 px-6 py-5 border-b shadow-lg transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        }`}>
          <a 
            href="#benefits" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-1.5 hover:text-green-500"
          >
            {t.navServices}
          </a>
          <a 
            href="#calculator" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium py-1.5 hover:text-green-500"
          >
            {t.navCalc}
          </a>
          <a 
            href="#booking" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-green-600 text-center hover:bg-green-500 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-md"
          >
            {t.navBook}
          </a>
        </div>
      )}

      {/* ጀማሪ (Hero) ክፍል */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-10 pb-6 max-w-5xl mx-auto">
        <span className={`text-[11px] md:text-xs font-semibold px-3 py-1.5 rounded-full border mb-6 leading-relaxed ${
          isDarkMode 
            ? "bg-green-950/80 text-green-400 border-green-800/80" 
            : "bg-green-100 text-green-800 border-green-300"
        }`}>
          {t.heroBadge}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {t.heroTitle1} <span className="text-green-500">{t.heroTitle2}</span> {t.heroTitle3}
        </h2>
        <p className={`text-base md:text-lg mb-8 max-w-2xl leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
          {t.heroDesc}
        </p>

        <div id="benefits" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4 text-left">
          <div className={`p-6 rounded-2xl border transition hover:border-green-500/50 ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <h4 className="text-green-500 font-bold text-lg mb-2">{t.feat1Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t.feat1Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border transition hover:border-green-500/50 ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <h4 className="text-green-500 font-bold text-lg mb-2">{t.feat2Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t.feat2Desc}</p>
          </div>

          <div className={`p-6 rounded-2xl border transition hover:border-green-500/50 ${
            isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
          }`}>
            <h4 className="text-green-500 font-bold text-lg mb-2">{t.feat3Title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t.feat3Desc}</p>
          </div>
        </div>
      </section>

      {/* የሂሳብ ማስያ (Calculator) */}
      <section id="calculator" className="max-w-4xl mx-auto px-4 py-10">
        <div className={`p-6 md:p-8 rounded-2xl border shadow-lg ${
          isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200"
        }`}>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-2">{t.calcTitle}</h3>
          <p className={`text-xs text-center mb-8 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{t.calcSub}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{t.calcVehiclesLabel}</span>
                  <span className="text-green-500">{totalVehicles}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="50" 
                  value={totalVehicles} 
                  onChange={(e) => setTotalVehicles(parseInt(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{t.calcKmLabel}</span>
                  <span className="text-green-500">{dailyKm} KM</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="800" 
                  step="10"
                  value={dailyKm} 
                  onChange={(e) => setDailyKm(parseInt(e.target.value))}
                  className="w-full accent-green-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className={`p-4 rounded-xl border text-center ${
                isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <span className="text-xs text-slate-400 block mb-1">{t.calcDailyEst}</span>
                <span className="text-2xl font-extrabold text-green-500">
                  {estimatedDailySavings.toLocaleString()} {t.currency}
                </span>
              </div>

              <div className={`p-4 rounded-xl border text-center ${
                isDarkMode ? "bg-green-950/30 border-green-800/50" : "bg-green-50 border-green-200"
              }`}>
                <span className="text-xs text-green-400 block mb-1 font-medium">{t.calcYearlyEst}</span>
                <span className="text-3xl font-extrabold text-green-500">
                  {estimatedYearlySavings.toLocaleString()} {t.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* የቦታ ማስያዣ ቅጽ (Booking Form) */}
      <section id="booking" className="max-w-2xl mx-auto px-4 pb-20">
        <div className={`p-6 md:p-8 rounded-2xl shadow-xl border transition ${
          isDarkMode 
            ? "bg-slate-900 border-slate-800" 
            : "bg-white border-slate-200 shadow-slate-200"
        }`}>
          <h3 className="text-xl md:text-2xl font-bold text-center mb-2">{t.formTitle}</h3>
          <p className={`text-xs text-center mb-6 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{t.formSub}</p>

          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setCustomerType("individual")}
              className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-lg transition ${
                customerType === "individual"
                  ? "bg-green-600 text-white shadow-md"
                  : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabIndividual}
            </button>
            <button
              type="button"
              onClick={() => setCustomerType("company")}
              className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-lg transition ${
                customerType === "company"
                  ? "bg-green-600 text-white shadow-md"
                  : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t.tabCompany}
            </button>
          </div>

          {statusMessage && (
            <div className="p-4 rounded-xl text-sm mb-4 font-semibold text-center bg-red-500/10 border border-red-500 text-red-400">
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {customerType === "individual" && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelFullName}</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.phFullName} 
                    className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelPhone}</label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.phPhone} 
                      className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelPlate}</label>
                    <input 
                      type="text" 
                      required
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      placeholder={t.phPlate} 
                      className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            {customerType === "company" && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelCompanyName}</label>
                  <input 
                    type="text" 
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={t.phCompanyName} 
                    className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                      isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelTin}</label>
                    <input 
                      type="text" 
                      required
                      value={tin}
                      onChange={(e) => setTin(e.target.value)}
                      placeholder={t.phTin} 
                      className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{t.labelAddress}</label>
                    <input 
                      type="text" 
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.phAddress} 
                      className={`w-full rounded-lg px-4 py-2.5 border focus:outline-none focus:border-green-500 transition ${
                        isDarkMode ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <label className={`block text-sm font-semibold mb-3 ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                {t.labelVehicleSelection}
              </label>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {vehicleList.map((item) => {
                  const isSelected = vehicleCounts[item.key] !== undefined;
                  return (
                    <div 
                      key={item.key} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition ${
                        isSelected 
                          ? "border-green-500 bg-green-500/10" 
                          : isDarkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer flex-1">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleVehicleToggle(item.key)}
                          className="w-4 h-4 accent-green-500 rounded cursor-pointer"
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                      </label>

                      {isSelected && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400">ብዛት፦</span>
                          <input 
                            type="number" 
                            min="1"
                            value={vehicleCounts[item.key]}
                            onChange={(e) => handleCountChange(item.key, parseInt(e.target.value) || 1)}
                            className={`w-16 rounded-md px-2 py-1 text-center text-sm border focus:outline-none focus:border-green-500 ${
                              isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                            }`}
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
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition mt-6 shadow-lg shadow-green-600/20 text-base disabled:opacity-50"
            >
              {loading ? (lang === "am" ? "በመላክ ላይ..." : "Submitting...") : t.btnSubmit}
            </button>
          </form>
        </div>
      </section>

      {/* የግርጌ ክፍል (Footer) */}
      <footer className="bg-[#43A047] text-white py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg inline-flex">
              <img src="/logo.png" alt="GreenSpark Logo" className="h-10 object-contain" />
              <span className="text-slate-900 font-extrabold text-lg tracking-tight">GreenSpark</span>
            </div>
            <p className="text-sm leading-relaxed">
              GreenSpark Solutions PLC is dedicated to advancing sustainable technologies in the East African market. Based in Addis Ababa, we specialize in distributing SUPERTECH devices that reduce emissions and enhance fuel efficiency.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-wide">Contact</h3>
            <p className="text-sm leading-relaxed">
              Gerji, Giorgis Business Shops, Building 5, Office New/248,<br />
              Bole Sub city, Woreda 13
            </p>
            <div className="text-sm space-y-1">
              <p><span className="font-semibold">Phone:</span></p>
              <p className="pl-4">Mobile: +251-983-470000</p>
              <p className="pl-4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+251-911-209255</p>
              <p><span className="font-semibold">Email:</span> info@greensparksolutions.et</p>
              <p><span className="font-semibold">Web:</span> www.greensparksolutions.et</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-wide">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Values</a></li>
              <li><a href="#benefits" className="hover:underline">Services</a></li>
              <li><a href="#calculator" className="hover:underline">Get Started</a></li>
              <li><a href="#" className="hover:underline">Legal Notice</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-wide">Social media</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="hover:underline flex items-center gap-2">📘 Facebook</a>
              <a href="#" className="hover:underline flex items-center gap-2">𝕏 X</a>
              <a href="#" className="hover:underline flex items-center gap-2">📷 Instagram</a>
            </div>
          </div>

        </div>
      </footer>

      {/* የተሳካ መሆኑን እና መለያ ቁጥር (Booking ID) የሚያሳይ ፖፕ-አፕ (Modal) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl text-center transform transition-all ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="w-16 h-16 bg-green-500/20 border border-green-500 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">
              ✓
            </div>
            <h3 className="text-2xl font-bold mb-2 text-green-500">{t.modalTitle}</h3>
            
            <div className={`my-4 p-4 rounded-xl border text-center ${
              isDarkMode ? "bg-slate-950 border-green-500/40" : "bg-green-50 border-green-300"
            }`}>
              <span className="text-xs text-slate-400 block mb-1">{t.modalIdLabel}</span>
              <span className="text-2xl font-mono font-extrabold text-green-400 tracking-wider">
                {generatedBookingId}
              </span>
            </div>

            <p className={`text-sm mb-6 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              {t.modalDesc}
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-green-600/30 text-base"
            >
              {t.modalBtn}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}