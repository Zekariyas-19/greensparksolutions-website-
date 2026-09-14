"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [lang, setLang] = useState<"am" | "en">("am");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [customerType, setCustomerType] = useState<"individual" | "company">("individual");
  
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tin, setTin] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState("");
  const [vehicleCounts, setVehicleCounts] = useState<{ [key: string]: number }>({});

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

    // Validation 1: Check Name Length and Words (At least 2 words, min 6 chars)
    const nameToCheck = customerType === "individual" ? fullName.trim() : companyName.trim();
    const words = nameToCheck.split(/\s+/);
    if (nameToCheck.length < 6 || words.length < 2) {
      setStatusMessage({
        type: "error",
        text: lang === "am" 
          ? "እባክዎ ትክክለኛ ሙሉ ስም (ቢያንስ ስም እና የአባት ስም) ያስገቡ።" 
          : "Please enter a valid full name (at least first and last name)."
      });
      setLoading(false);
      return;
    }

    // Validation 2: Check Phone Number (Must start with 09 or 07 and be 10 digits)
    const phoneRegex = /^(09|07)\d{8}$/;
    const phoneToValidate = customerType === "individual" ? phone.trim() : companyPhone.trim();
    
    if (!phoneRegex.test(phoneToValidate)) {
      setStatusMessage({
        type: "error",
        text: lang === "am" 
          ? "እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (በ 09 ወይም 07 የሚጀምር 10 አሃዝ ቁጥር)" 
          : "Please enter a valid 10-digit Ethiopian phone number starting with 09 or 07."
      });
      setLoading(false);
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const uniqueId = `GS-${randomNum}`;

    const formData = {
      booking_id: uniqueId,
      customer_type: customerType,
      full_name: customerType === "individual" ? fullName : null,
      phone: customerType === "individual" ? phone : null,
      company_name: customerType === "company" ? companyName : null,
      tin_number: customerType === "company" ? tin : null,
      address: customerType === "company" ? companyPhone : null,
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
      setCompanyPhone("");
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
      navHome: "Home",
      navValues: "Values",
      navServices: "Services",
      navBooking: "Booking",
      navFounders: "Founders",
      navComments: "Comments",
      navAbout: "About us",
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
      labelFullName: "ሙሉ ስም (ስም እና የአባት ስም)",
      phFullName: "ለምሳሌ፦ አበበ ከበደ",
      labelPhone: "ስልክ ቁጥር (09... ወይም 07...)",
      phPhone: "0911234567",
      labelCompanyName: "የድርጅቱ ሙሉ ስም",
      phCompanyName: "የድርጅቱን ስም ያስገቡ",
      labelTin: "የቲን ቁጥር",
      phTin: "የቲን ቁጥር ያስገቡ",
      labelCompanyPhone: "ስልክ ቁጥር (09... ወይም 07...)",
      phCompanyPhone: "0911234567",
      labelVehicleSelection: "የተሽከርካሪ ታንከር የነዳጅ መጠን (በሊትር) እና ብዛት ይምረጡ",
      btnSubmit: "ቦታ ያዙ / ጥያቄ ይላኩ",
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
      navHome: "Home",
      navValues: "Values",
      navServices: "Services",
      navBooking: "Booking",
      navFounders: "Founders",
      navComments: "Comments",
      navAbout: "About us",
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
      labelFullName: "Full Name (First and Last Name)",
      phFullName: "e.g., Abebe Kebede",
      labelPhone: "Phone Number (09... or 07...)",
      phPhone: "0911234567",
      labelCompanyName: "Company Full Name",
      phCompanyName: "Enter company name",
      labelTin: "TIN Number",
      phTin: "Enter TIN number",
      labelCompanyPhone: "Phone Number (09... or 07...)",
      phCompanyPhone: "0911234567",
      labelVehicleSelection: "Select Vehicle Fuel Tank Capacity Tier & Quantity",
      btnSubmit: "Submit Booking Request",
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
      
      {/* Navigation Bar */}
      <nav className={`flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-3 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm gap-3 transition-colors duration-300 ${isDark ? "bg-[#0B132B]/90 border-slate-800" : "bg-white/90 border-slate-200"}`}>
        
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer self-start md:self-auto" onClick={() => setActiveTab("home")}>
          <img 
            src="/logo.png" 
            alt="GreenSpark Solutions Logo" 
            className="h-10 md:h-12 w-auto object-contain" 
          />
          <div className={`flex flex-col justify-center border-l pl-3 ${isDark ? "border-slate-700" : "border-slate-300"}`}>
            <span className={`text-base md:text-lg font-bold tracking-tight leading-tight ${isDark ? "text-white" : "text-[#00529B]"}`}>
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
              <div className={`h-[1px] w-3 ${isDark ? "bg-slate-500" : "bg-[#00529B]"}`}></div>
              <span className={`text-[8px] font-extrabold tracking-[0.2em] uppercase ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                SOLUTIONS PLC
              </span>
              <div className={`h-[1px] w-3 ${isDark ? "bg-slate-500" : "bg-[#00529B]"}`}></div>
            </div>
          </div>
        </div>
        
        {/* Navigation Links and Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 text-xs md:text-sm font-semibold">
          <button onClick={() => setActiveTab("home")} className={`transition ${activeTab === "home" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navHome}</button>
          <button onClick={() => setActiveTab("values")} className={`transition ${activeTab === "values" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navValues}</button>
          <button onClick={() => setActiveTab("services")} className={`transition ${activeTab === "services" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navServices}</button>
          <button onClick={() => setActiveTab("booking")} className={`transition ${activeTab === "booking" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navBooking}</button>
          <button onClick={() => setActiveTab("founders")} className={`transition ${activeTab === "founders" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navFounders}</button>
          <button onClick={() => setActiveTab("comments")} className={`transition ${activeTab === "comments" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navComments}</button>
          <button onClick={() => setActiveTab("about")} className={`transition ${activeTab === "about" ? "text-[#43B02A] font-bold underline underline-offset-4" : isDark ? "text-slate-300 hover:text-[#43B02A]" : "text-slate-600 hover:text-[#43B02A]"}`}>{t.navAbout}</button>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-1.5 rounded-lg border transition text-xs flex items-center justify-center ${isDark ? "border-slate-700 bg-[#1C2541] text-amber-400 hover:bg-slate-800" : "border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
              title="Toggle Light/Dark Mode"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button
              onClick={() => setLang(lang === "am" ? "en" : "am")}
              className={`font-bold px-3 py-1.5 rounded-lg border transition text-xs ${isDark ? "border-slate-700 bg-[#1C2541] text-white hover:bg-slate-800" : "border-slate-300 bg-slate-50 text-[#00529B] hover:bg-slate-100"}`}
            >
              {lang === "am" ? "English" : "አማርኛ"}
            </button>
          </div>
        </div>
      </nav>

      {/* Dynamic Content Views */}
      <div className="py-8">
        {activeTab === "home" && (
          <section className="flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto min-h-[70vh]">
            <h2 className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight ${isDark ? "text-white" : "text-[#00529B]"}`}>
              {t.heroTitle1} <span className="text-[#43B02A]">{t.heroTitle2}</span> {t.heroTitle3}
            </h2>
            <p className={`text-base md:text-xl mb-12 max-w-2xl leading-relaxed font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {t.heroDesc}
            </p>

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

            <div className="mt-6">
              <button 
                onClick={() => setActiveTab("booking")}
                className="bg-[#43B02A] hover:bg-[#389623] text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg transition"
              >
                {lang === "am" ? "አሁን ቦታ ይያዙ (Book Now)" : "Book Your Installation Now"}
              </button>
            </div>
          </section>
        )}

        {activeTab === "values" && (
          <section className="max-w-5xl mx-auto px-4 min-h-[70vh]">
            <div className="text-center mb-10">
              <h3 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-[#00529B]"}`}>
                {lang === "am" ? "መሳሪያውን ሲያስገጥሙ የሚያገኟቸው ጥቅሞች (Values & Benefits)" : "Values & Benefits of Installation"}
              </h3>
              <p className={`text-sm max-w-xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {lang === "am" 
                  ? "ማንኛውም ድርጅት ወይም ግለሰብ ይህንን የSUPERTECH ቴክኖሎጂ በመኪናው ታንከር ውስጥ ሲያስገጥም የሚከተሉትን ትላልቅ ጥቅሞች ያገኛል፦" 
                  : "Discover the tangible financial and environmental advantages when you install our eco-friendly solutions."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className={`p-8 rounded-2xl border transition shadow-sm ${isDark ? "border-slate-800 bg-[#1C2541]" : "border-slate-200 bg-white"}`}>
                <div className="text-3xl mb-4">💰</div>
                <h4 className="text-[#43B02A] font-bold text-xl mb-3">{t.feat1Title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat1Desc}</p>
              </div>

              <div className={`p-8 rounded-2xl border transition shadow-sm ${isDark ? "border-slate-800 bg-[#1C2541]" : "border-slate-200 bg-white"}`}>
                <div className="text-3xl mb-4">🌍</div>
                <h4 className={`font-bold text-xl mb-3 ${isDark ? "text-[#60A5FA]" : "text-[#00529B]"}`}>{t.feat2Title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat2Desc}</p>
              </div>

              <div className={`p-8 rounded-2xl border transition shadow-sm ${isDark ? "border-slate-800 bg-[#1C2541]" : "border-slate-200 bg-white"}`}>
                <div className="text-3xl mb-4">⚙️</div>
                <h4 className="text-[#43B02A] font-bold text-xl mb-3">{t.feat3Title}</h4>
                <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.feat3Desc}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="max-w-4xl mx-auto px-4 py-8 text-center min-h-[70vh]">
            <h3 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-[#00529B]"}`}>Services</h3>
            <p className={`text-base mb-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Providing advanced automotive equipment to reduce toxic gas emissions and optimize fuel consumption for private cars and fleet owners.
            </p>
            <div className={`p-8 rounded-2xl border text-left space-y-4 ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-slate-200"}`}>
              <h4 className="text-[#43B02A] font-bold text-xl">{lang === "am" ? "የምንሰጣቸው ዋና ዋና አገልግሎቶች" : "Our Core Services"}</h4>
              <ul className={`text-sm space-y-3 list-disc pl-5 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li>{lang === "am" ? "የSUPERTECH ታንከር ማሽን ግዢ እና ሙያዊ ገጠማ አገልግሎት" : "SUPERTECH tank machine purchase and professional installation"}</li>
                <li>{lang === "am" ? "ለድርጅት መኪናዎች (Fleet) የጅምላ ትዕዛዝ እና ድጋፍ" : "Fleet management bulk orders and technical support"}</li>
                <li>{lang === "am" ? "የአካባቢ ጥበቃ እና የካይ ጋዝ ቅነሳ የሙያ ምክር አገልግሎት" : "Environmental protection and toxic gas reduction consultancy"}</li>
              </ul>
            </div>
          </section>
        )}

        {activeTab === "booking" && (
          <div className="max-w-2xl mx-auto px-4 space-y-8 min-h-[70vh]">
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
                        maxLength={10}
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
                        <label className={`block text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-700"}`}>{t.labelCompanyPhone}</label>
                        <input 
                          type="tel" 
                          required
                          maxLength={10}
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value)}
                          placeholder={t.phCompanyPhone} 
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
          </div>
        )}

        {activeTab === "founders" && (
          <section className="max-w-4xl mx-auto px-4 py-8 text-center min-h-[70vh]">
            <h3 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-[#00529B]"}`}>Founders</h3>
            <p className={`text-base mb-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Founded by visionary experts dedicated to green technology and environmental protection.
            </p>
            <div className={`p-8 rounded-2xl border ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {lang === "am" 
                  ? "የድርጅታችን መስራቾች በዘላቂ ኢነርጂ እና በአውቶሞቲቭ ቴክኖሎጂ ዘርፍ የረጅም ጊዜ ልምድ ያላቸው ባለሙያዎች ናቸው።" 
                  : "Our founders are visionary experts with extensive experience in sustainable energy and automotive engineering."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "comments" && (
          <section className="max-w-4xl mx-auto px-4 py-8 text-center min-h-[70vh]">
            <h3 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-[#00529B]"}`}>Comments</h3>
            <p className={`text-base mb-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Feedback and remarks regarding Supertech, Eco-Tech Solutions PLC, and Directive 1051/2017.
            </p>
            <div className={`p-8 rounded-2xl border ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-slate-200"}`}>
              <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {lang === "am" 
                  ? "ደንበኞቻችን ስለ መሳሪያው ውጤታማነት የሰጡዋቸው አስተያየቶች እዚህ ይገኛሉ።" 
                  : "Customer testimonials and feedback regarding our products and services will be showcased here."}
              </p>
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section className="max-w-4xl mx-auto px-4 py-8 text-center min-h-[70vh]">
            <h3 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-[#00529B]"}`}>About us</h3>
            <p className={`text-base mb-8 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              GreenSpark Solutions PLC is committed to providing efficient fuel-saving and eco-friendly solutions.
            </p>
            <div className={`p-8 rounded-2xl border text-left space-y-4 ${isDark ? "bg-[#1C2541] border-slate-800" : "bg-white border-slate-200"}`}>
              <h4 className="text-[#43B02A] font-bold text-xl">{lang === "am" ? "ስለ ድርጅታችን" : "About GreenSpark Solutions PLC"}</h4>
              <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {lang === "am"
                  ? "ግሪን ስፓርክ ሶሉሽንስ ኃ.የተ.የግ ማህበር ከአኮ-ቴክ ሶሉሽንስ ጋር በመተባበር የSUPERTECH መሣሪያዎችን በማከፋፈልና በማስገጥም ላይ ይገኛል። አላማችንም የአካባቢ ብክለትን በመቀነስ እና የነዳጅ ወጪን በማዳን ለሀገራችን እድገት አስተዋጽኦ ማድረግ ነው።"
                  : "GreenSpark Solutions PLC (in partnership with Eco-Tech Solutions) distributes SUPERTECH devices. Our goal is to reduce environmental air pollution and save fuel costs in compliance with national standards."}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl border text-center ${isDark ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}>
            <h3 className="text-xl font-bold mb-2 text-[#43B02A]">{t.modalTitle}</h3>
            <p className={`text-xs mb-4 ${isDark ? "text-slate-300" : "text-slate-600"}`}>{t.modalDesc}</p>
            <div className={`p-3 rounded-xl mb-6 font-mono text-lg font-bold border ${isDark ? "bg-[#0B132B] border-slate-700 text-[#43B02A]" : "bg-slate-50 border-slate-200 text-[#00529B]"}`}>
              {generatedBookingId}
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#00529B] hover:bg-[#00407a] text-white font-bold py-3 rounded-xl transition text-sm shadow"
            >
              {t.modalBtn}
            </button>
          </div>
        </div>
      )}

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
              <li><button onClick={() => setActiveTab("booking")} className="hover:text-[#43B02A] transition text-left">SUPERTECH Booking</button></li>
              <li><span className="text-slate-300">Eco-Tech Solutions PLC</span></li>
              <li><span className="text-slate-300">Directive 1051/2017 Compliance</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold tracking-wide text-white">Social media</h3>
            <div className="flex flex-col space-y-2 text-xs text-slate-400">
              <a href="https://facebook.com/greenspark.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#43B02A] transition flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-blue-500" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a href="https://t.me/greenspark_solutions" target="_blank" rel="noopener noreferrer" className="hover:text-[#43B02A] transition flex items-center gap-2">
                <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.163.33.016.116.033.378.016.583z"/>
                </svg>
                <span>Telegram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Notice Bar */}
        <div className={`max-w-7xl mx-auto pt-6 mt-6 border-t text-center text-xs ${isDark ? "border-slate-800 text-slate-500" : "border-slate-800 text-slate-400"}`}>
          © {new Date().getFullYear()} GreenSpark Solutions PLC. All rights reserved.
        </div>
      </footer>
    </main>
  );
}