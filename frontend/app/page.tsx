"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search, Lightbulb, Users, TrendingUp, ArrowRight,
  Phone, Mail, MapPin, ChevronRight, X, Menu, ShieldCheck,
  CheckCircle2, Lock, KeyRound, AlertTriangle,
  FileText, Sparkles, Award, Leaf,
  Landmark, Rocket, Target, Handshake, MessageCircle,
  BarChart3, Zap
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";
import { useI18n } from "@/lib/i18n";
import {
  SkylineBackdrop,
  MantralayaMapCard
} from "@/components/MaharashtraArtwork";
import { StartupRegisterModal } from "@/components/StartupRegisterModal";

export default function HomePage() {
  const router = useRouter();
  const {
    user, email, setEmail, password, setPassword,
    mfa, setMfa, loading, login, error, authInitialized
  } = usePraman();

  const { language, setLanguage, t, isHindi } = useI18n();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [startupRegisterModalOpen, setStartupRegisterModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  // "startup" | "government" | null — which role-selection card is open
  const [roleModalType, setRoleModalType] = useState<"startup" | "government" | null>(null);

  const DEMO_USERS = [
    {
      title: "Nodal Officer",
      role: "Procurement Decision Maker",
      email: "officer@praman.local",
      badgeColor: "#0B2A5B",
      bg: "#EEF5FC",
    },
    {
      title: "Technical Evaluator",
      role: "Pilot & KPI Verifier",
      email: "evaluator@praman.local",
      badgeColor: "#B45309",
      bg: "#FEF3C7",
    },
    {
      title: "Startup Innovator",
      role: "Solution & Telemetry Provider",
      email: "startup@praman.local",
      badgeColor: "#16834B",
      bg: "#DCFCE7",
    },
    {
      title: "Governance Auditor",
      role: "Compliance & Audit Replay",
      email: "auditor@praman.local",
      badgeColor: "#6D28D9",
      bg: "#EDE9FE",
    },
  ];

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login();
    if (email.includes("startup")) {
      router.push("/dashboard");
    } else {
      router.push("/dashboard");
    }
  }

  function handleQuickFill(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("demo123");
    setMfa("123456");
  }

  // Dedicated direct Startup login action
  function handleStartupLoginDirect() {
    setEmail("startup@praman.local");
    setPassword("demo123");
    setMfa("123456");
    setRoleModalType(null);
    setLoginModalOpen(true);
  }

  // Dedicated direct Government login action
  function handleGovLoginDirect() {
    setEmail("officer@praman.local");
    setPassword("demo123");
    setMfa("123456");
    setRoleModalType(null);
    setLoginModalOpen(true);
  }

  /* ═══════════════════════════════════════════════════════════════
     KPI DATA for At a Glance section
     ═══════════════════════════════════════════════════════════════ */
  const kpiMetrics = [
    { icon: <FileText size={18} />, value: "24", label: "Problem Statements", trend: "+4 this quarter", color: "#0B2A5B", link: "/problems" },
    { icon: <Lightbulb size={18} />, value: "47", label: "Solutions Discovered", trend: "+12 this quarter", color: "#16834B", link: "/innovation-hub" },
    { icon: <Rocket size={18} />, value: "18", label: "Startups Onboarded", trend: "+6 this quarter", color: "#1D4ED8", link: null },
    { icon: <BarChart3 size={18} />, value: "6", label: "Active Pilots", trend: "3 on track", color: "#F59E0B", link: "/pilots" },
    { icon: <CheckCircle2 size={18} />, value: "4", label: "Pilots Completed", trend: "93% success rate", color: "#16834B", link: null },
    { icon: <ShieldCheck size={18} />, value: "4", label: "Procurement Ready", trend: "2 awaiting decision", color: "#0B2A5B", link: "/dashboard" },
    { icon: <span className="text-lg font-black" style={{ fontFamily: "Inter" }}>₹</span>, value: "₹20.94 Cr", label: "Value Tracked", trend: "+₹8.2 Cr this quarter", color: "#B45309", link: null },
    { icon: <Award size={18} />, value: "11", label: "Successful Outcomes", trend: "93% avg. outcome", color: "#16834B", link: null },
  ];

  /* ═══════════════════════════════════════════════════════════════
     OPPORTUNITY DATA
     ═══════════════════════════════════════════════════════════════ */
  const opportunities = [
    {
      caseId: "#MH-PWD-024",
      title: "AI-Based Traffic Prediction",
      dept: "Public Works Department",
      location: "Pune",
      status: "OPEN FOR DISCOVERY",
      statusColor: "#16834B",
      statusBg: "#DCFCE7",
      match: "91%",
    },
    {
      caseId: "#MH-WTR-011",
      title: "Water Quality Monitoring",
      dept: "Water Resources Department",
      location: "Nashik",
      status: "OPEN FOR SOLUTIONS",
      statusColor: "#1D4ED8",
      statusBg: "#EEF5FC",
      match: "78%",
    },
    {
      caseId: "#MCGM-008",
      title: "Smart Waste Routing",
      dept: "Municipal Corporation of Greater Mumbai",
      location: "Mumbai",
      status: "UNDER DISCOVERY",
      statusColor: "#B45309",
      statusBg: "#FEF3C7",
      match: "65%",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans antialiased">
      {/* ═══════════════════════════════════════════════════════════════
          1. HEADER (Pixel-Accurate Government Innovation Portal)
          ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-[96px] flex items-center justify-between gap-4">
          {/* Left: PRAMAN Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group py-1">
              <Image
                src="/images/praman-logo-clean.png"
                alt="PRAMAN – Public Procurement Intelligence Platform"
                width={480}
                height={120}
                className="h-[80px] sm:h-[95px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-[#1E293B]">
            <Link
              href="/"
              onClick={() => setActiveTab("home")}
              className={`py-1.5 transition-colors relative ${
                activeTab === "home" ? "text-[#1E40AF]" : "hover:text-[#1E40AF]"
              }`}
            >
              {t("home")}
              {activeTab === "home" && (
                <span className="absolute bottom-[-14px] left-0 right-0 h-[2.5px] bg-[#1E40AF] rounded-full" />
              )}
            </Link>
            <a href="#what-is-praman" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("about")}
            </a>
            <button
              onClick={() => setRoleModalType("startup")}
              className="py-1.5 hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              {t("forStartups")}
            </button>
            <button
              onClick={() => setRoleModalType("government")}
              className="py-1.5 hover:text-[#1E40AF] transition-colors cursor-pointer"
            >
              {t("forGovernment")}
            </button>
            <Link href="/transparency" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("resources")}
            </Link>
            <a href="#contact" className="py-1.5 hover:text-[#1E40AF] transition-colors">
              {t("contactUs")}
            </a>
          </nav>

          {/* Right: Functional Hindi Language Toggle + Auth Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Interactive Hindi Language Toggle */}
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className={`text-xs font-bold px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                isHindi
                  ? "bg-[#1E40AF] text-white border-[#1E40AF] shadow-xs"
                  : "bg-white text-[#0B2A5B] border-[#CBD5E1] hover:bg-[#EEF5FC] hover:border-[#1E40AF]"
              }`}
              title={isHindi ? "Switch to English" : "हिंदी में बदलें"}
              aria-label="Language Toggle"
            >
              <span className={!isHindi ? "font-black" : "opacity-75"}>EN</span>
              <span className="opacity-40">|</span>
              <span className={isHindi ? "font-black" : "opacity-75"}>हिंदी</span>
            </button>

            {user ? (
              <Link
                href="/dashboard"
                className="bg-[#0A2540] hover:bg-[#061727] text-white text-[13px] font-bold px-5 py-2 rounded shadow-xs transition-all flex items-center gap-2"
              >
                <span>{user.role === "startup" ? t("startupPortal") : t("governmentPortal")}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="bg-white hover:bg-slate-50 text-[#0A2540] border border-[#CBD5E1] text-[13px] font-bold px-5 py-2 rounded transition-colors shadow-2xs cursor-pointer"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => setStartupRegisterModalOpen(true)}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white text-[13px] font-bold px-6 py-2 rounded transition-colors shadow-xs cursor-pointer"
                >
                  {t("register")}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle & Mobile Language Switch */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className="text-xs font-bold px-2 py-1 rounded border border-[#CBD5E1] bg-white text-[#0B2A5B]"
            >
              {isHindi ? "EN" : "हिंदी"}
            </button>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-[#0A2540] text-white text-xs font-bold px-3 py-1.5 rounded"
            >
              {t("login")}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0A2540] rounded hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-3 shadow-lg">
            <Link href="/" className="block text-sm font-bold text-[#1E40AF]">{t("home")}</Link>
            <a href="#what-is-praman" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#1E293B]">{t("about")}</a>
            <button onClick={() => { setRoleModalType("startup"); setMobileMenuOpen(false); }} className="block w-full text-left text-sm font-semibold text-[#1E293B] hover:text-[#1E40AF]">{t("forStartups")}</button>
            <button onClick={() => { setRoleModalType("government"); setMobileMenuOpen(false); }} className="block w-full text-left text-sm font-semibold text-[#1E293B] hover:text-[#1E40AF]">{t("forGovernment")}</button>
            <Link href="/transparency" className="block text-sm font-semibold text-[#1E293B]">{t("resources")}</Link>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-[#1E293B]">{t("contactUs")}</a>
            <div className="pt-2 border-t border-[#E2E8F0]">
              <button
                onClick={() => {
                  setLanguage(isHindi ? "en" : "hi");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-xs font-bold text-[#1E40AF] py-1"
              >
                {isHindi ? "Switch to English (English)" : "भाषा बदलें: हिंदी (Hindi)"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          2. HERO SECTION (Preserved & Polished with Trust Badges)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-[#F0F6FC] via-[#F8FAFC] to-white pt-10 sm:pt-14 pb-14 sm:pb-16 overflow-hidden border-b border-[#E2E8F0]/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left pr-0 lg:pr-4">
              {/* Eyebrow */}
              <div className="inline-flex items-center">
                <span className="text-xs sm:text-sm font-extrabold text-[#2563EB] uppercase tracking-[0.22em]">
                  {t("heroEyebrow")}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1]">
                <span className="text-[#0A2540] block">{t("heroHeadline1")}</span>
                <span className="text-[#1D4ED8] block mt-1">{t("heroHeadline2")}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-lg font-normal">
                {t("heroSubtitle")}
              </p>

              {/* Action Buttons — Improved hierarchy */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white font-bold text-sm px-7 py-3.5 rounded-md shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span>Explore Opportunities</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById("what-is-praman");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-white hover:bg-slate-50 text-[#0A2540] border border-[#CBD5E1] font-bold text-sm px-7 py-3.5 rounded-md transition-colors flex items-center gap-2.5 shadow-2xs cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-[10px]">
                    ▶
                  </span>
                  <span>{t("howItWorks")}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-[#475569]">
                  <div className="w-8 h-8 rounded-full bg-[#EEF5FC] flex items-center justify-center">
                    <Landmark size={16} className="text-[#0B2A5B]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider leading-tight">Trusted by</p>
                    <p className="text-xs font-bold text-[#0A2540] leading-tight">Government Departments</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
                    <Sparkles size={16} className="text-[#B45309]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider leading-tight">Powered by</p>
                    <p className="text-xs font-bold text-[#0A2540] leading-tight">Innovation & Evidence</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#475569]">
                  <div className="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                    <Handshake size={16} className="text-[#16834B]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider leading-tight">Built for</p>
                    <p className="text-xs font-bold text-[#0A2540] leading-tight">Public Impact</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Composition — Map + Maharashtra Typography */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-[620px] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                {/* Vector Map of Maharashtra */}
                <div className="shrink-0 flex items-center justify-center">
                  <Image
                    src="/images/maharashtra-hero-map.png"
                    alt="Maharashtra Innovation Hub"
                    width={480}
                    height={400}
                    className="w-full max-w-[290px] sm:max-w-[340px] md:max-w-[360px] h-auto object-contain drop-shadow-md"
                    priority
                  />
                </div>

                {/* Typography to the RIGHT */}
                <div className="flex flex-col justify-center space-y-4 select-none shrink-0 text-center md:text-left">
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight leading-snug">
                      महाराष्ट्र सशक्त भविष्याकडे  
                    </p>
                    <p className="text-xs sm:text-sm font-extrabold text-[#1D4ED8]">
                      महाराष्ट्र सक्षमतेकडून भविष्याकडे
                    </p>
                    <div className="mt-2 flex items-center justify-center md:justify-start gap-1.5">
                      <span className="w-9 h-[3px] bg-[#F59E0B] rounded-full" />
                      <span className="w-9 h-[3px] bg-[#16834B] rounded-full" />
                    </div>
                  </div>

                  {/* Right side quote */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-[#475569] italic leading-relaxed">
                      " Public problems.<br />
                      Real solutions.<br />
                      Measurable impact. "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Silhouette outline across bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none text-[#2563EB]/15">
          <SkylineBackdrop className="w-full h-12 opacity-20" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2.5. WHAT IS PRAMAN? (Deep Navy Branded Institutional Section)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="what-is-praman" className="relative bg-gradient-to-r from-[#031B4E] via-[#08307A] to-[#041D52] py-14 sm:py-16 overflow-hidden border-b border-[#0A2540]">
        {/* Subtle architectural silhouette watermark in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden flex items-center justify-end">
          <SkylineBackdrop className="w-[600px] h-full object-cover text-white" />
        </div>
        
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.25),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: WHAT IS PRAMAN? (~45% width -> 5 cols) */}
            <div className="lg:col-span-5 space-y-5 text-left">
              {/* Eyebrow */}
              <div className="flex items-center">
                <span className="w-5 h-[3px] bg-[#F59E0B] rounded-full inline-block mr-2.5" />
                <span className="text-xs font-black text-white/90 tracking-[0.22em] uppercase">
                  PUBLIC PROCUREMENT INTELLIGENCE PLATFORM
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.12]">
                What is <span className="text-white">PRAMAN</span>?
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
                PRAMAN connects real government problems with innovative startup solutions through evidence, structured evaluation and controlled pilots — helping departments move from identifying a need to making accountable, outcome-driven decisions.
              </p>

              {/* Highlighted Supporting Statement */}
              <div className="border-l-4 border-[#F59E0B] pl-4 py-1">
                <p className="text-sm sm:text-[15px] font-bold text-white leading-snug">
                  Built to make public-sector innovation more discoverable, testable and accountable.
                </p>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/transparency"
                  className="bg-white hover:bg-slate-100 text-[#0A2540] font-bold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-sm transition-all inline-flex items-center gap-2 group"
                >
                  <span>Explore PRAMAN</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN: A PLATFORM FOR LASTING CHANGE + BRAND STATEMENT (~55% width -> 7 cols) */}
            <div className="lg:col-span-7 flex flex-col xl:flex-row items-center gap-6">
              
              {/* 2x2 Benefit Panel */}
              <div className="flex-1 w-full bg-[#0A2E66]/60 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl">
                {/* Panel Header */}
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white mb-4 sm:mb-5">
                  A PLATFORM FOR LASTING CHANGE
                </h3>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  
                  {/* Card 1: Stronger Governance */}
                  <div className="bg-[#071D41]/80 hover:bg-[#071D41] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#1D4ED8] flex items-center justify-center shrink-0 text-white shadow-md">
                      <Landmark size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">Stronger Governance</p>
                      <p className="text-xs text-white/70 mt-0.5 leading-tight">More effective problem solving</p>
                    </div>
                  </div>

                  {/* Card 2: Innovation Ecosystem */}
                  <div className="bg-[#071D41]/80 hover:bg-[#071D41] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#CA8A04]/90 flex items-center justify-center shrink-0 text-[#FEF08A] shadow-md">
                      <Lightbulb size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">Innovation Ecosystem</p>
                      <p className="text-xs text-white/70 mt-0.5 leading-tight">Greater opportunities for startups</p>
                    </div>
                  </div>

                  {/* Card 3: Accountable Decisions */}
                  <div className="bg-[#071D41]/80 hover:bg-[#071D41] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#16A34A]/90 flex items-center justify-center shrink-0 text-white shadow-md">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">Accountable Decisions</p>
                      <p className="text-xs text-white/70 mt-0.5 leading-tight">Evidence and impact at the core</p>
                    </div>
                  </div>

                  {/* Card 4: Inclusive Growth */}
                  <div className="bg-[#071D41]/80 hover:bg-[#071D41] border border-white/10 hover:border-white/20 rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#0D9488]/90 flex items-center justify-center shrink-0 text-white shadow-md">
                      <Leaf size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-snug">Inclusive Growth</p>
                      <p className="text-xs text-white/70 mt-0.5 leading-tight">Better services for citizens</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Far Right Subtle Brand Statement */}
              <div className="hidden xl:flex flex-col items-center justify-center text-center space-y-2 select-none shrink-0 pl-1">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/70">IDEAS</span>
                <span className="text-xs text-[#38BDF8]">→</span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/70">INNOVATION</span>
                <span className="text-xs text-[#38BDF8]">→</span>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/70">IMPACT</span>
                
                <div className="pt-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white leading-tight">A STRONGER</p>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#38BDF8] leading-tight">MAHARASHTRA</p>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <span className="w-4 h-1 bg-[#F59E0B] rounded-full" />
                  <span className="w-4 h-1 bg-white rounded-full" />
                  <span className="w-4 h-1 bg-[#16834B] rounded-full" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. PRAMAN AT A GLANCE (KPI Section)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="praman-at-a-glance" className="bg-white py-12 sm:py-16 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                PRAMAN AT A GLANCE
              </h2>
              <p className="text-sm text-[#475569] mt-1.5 max-w-xl leading-relaxed">
                A live view of the problems, solutions and outcomes moving through the PRAMAN ecosystem.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16834B] animate-pulse" />
                <span className="text-xs font-bold text-[#16834B]">Live Platform Data</span>
              </div>
              <Link href="/dashboard" className="text-xs font-bold text-[#1D4ED8] hover:text-[#0A2540] flex items-center gap-1 transition-colors">
                View All Insights <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {kpiMetrics.map((kpi, idx) => {
              const inner = (
                <div
                  key={idx}
                  className={`bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#CBD5E1] ${kpi.link ? "cursor-pointer" : ""} group`}
                  title={kpi.trend}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${kpi.color}12` }}>
                    <span style={{ color: kpi.color }}>{kpi.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-[#0A2540] leading-none tracking-tight">{kpi.value}</p>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mt-1.5 leading-tight">{kpi.label}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-auto">
                    <TrendingUp size={10} className="text-[#16834B]" />
                    <span className="text-[9px] text-[#16834B] font-semibold">{kpi.trend}</span>
                  </div>
                </div>
              );
              return kpi.link ? (
                <Link key={idx} href={kpi.link} className="block">
                  {inner}
                </Link>
              ) : (
                <div key={idx}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. ONE PLATFORM. THREE ECOSYSTEMS.
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8FAFC] py-14 sm:py-18 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
                ONE PLATFORM. THREE ECOSYSTEMS.
              </h2>
              <p className="text-sm text-[#475569] mt-1.5 max-w-lg leading-relaxed">
                Different users. A shared mission for a better Maharashtra.
              </p>
            </div>
            <a href="#contact" className="text-xs font-bold text-[#1D4ED8] hover:text-[#0A2540] flex items-center gap-1 transition-colors">
              Learn More <ArrowRight size={12} />
            </a>
          </div>

          {/* Three Ecosystem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FOR GOVERNMENT */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 flex flex-col gap-5 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#0B2A5B]/20 group">
              <div className="w-12 h-12 rounded-xl bg-[#EEF5FC] border border-[#D9E1EA] flex items-center justify-center text-[#0B2A5B] group-hover:bg-[#0B2A5B] group-hover:text-white transition-colors">
                <Landmark size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">For Government</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0B2A5B] mt-0.5">•</span>
                    <span>Define problems and requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0B2A5B] mt-0.5">•</span>
                    <span>Discover innovative solutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0B2A5B] mt-0.5">•</span>
                    <span>Evaluate evidence and track pilots</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setRoleModalType("government")}
                className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#0B2A5B] hover:text-[#1D4ED8] transition-colors cursor-pointer group/btn"
              >
                <span>Explore Government Portal</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* FOR STARTUPS */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 flex flex-col gap-5 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#16834B]/20 group">
              <div className="w-12 h-12 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center text-[#16834B] group-hover:bg-[#16834B] group-hover:text-white transition-colors">
                <Rocket size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">For Startups</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#16834B] mt-0.5">•</span>
                    <span>Discover opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16834B] mt-0.5">•</span>
                    <span>Showcase capabilities and evidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16834B] mt-0.5">•</span>
                    <span>Collaborate with departments</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setRoleModalType("startup")}
                className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#16834B] hover:text-[#0A2540] transition-colors cursor-pointer group/btn"
              >
                <span>Explore Startup Portal</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* FOR PUBLIC */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-7 flex flex-col gap-5 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#F59E0B]/20 group">
              <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#B45309] group-hover:bg-[#F59E0B] group-hover:text-white transition-colors">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0A2540]">For Public</h3>
                <ul className="mt-3 space-y-2 text-sm text-[#475569]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B45309] mt-0.5">•</span>
                    <span>Explore public-safe challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B45309] mt-0.5">•</span>
                    <span>Track outcomes and impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B45309] mt-0.5">•</span>
                    <span>Suggest problems and innovations</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/transparency"
                className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#B45309] hover:text-[#0A2540] transition-colors group/btn"
              >
                <span>Explore Public Opportunities</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. STARTUP INNOVATION EXCHANGE (Dark Theme)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="startups" className="bg-[#0A2540] text-white py-14 sm:py-18 border-y border-[#1E3A5F]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 lg:mb-16">
            {/* Left: Heading & Description */}
            <div className="space-y-4">
              <span className="text-[10px] sm:text-xs font-bold text-[#60A5FA] uppercase tracking-[0.2em]">
                STARTUP ACCELERATION • COLLABORATION • IMPACT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Turn Public Challenges Into Innovation Opportunities.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Discover real government challenges, demonstrate your capabilities and collaborate with departments through structured, evidence-driven pilots.
              </p>
            </div>

            {/* Right: CTA + Rocket representation */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-6">
              <div className="text-center sm:text-right space-y-3">
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="inline-flex items-center gap-2.5 bg-white hover:bg-[#EEF5FC] text-[#0A2540] font-bold text-sm px-7 py-3.5 rounded-md shadow-md transition-all cursor-pointer"
                >
                  <span>Browse Opportunities</span>
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <Rocket size={40} className="text-[#60A5FA]" />
              </div>
            </div>
          </div>

          {/* Three Numbered Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 01: DISCOVER */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl group">
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl font-black text-white/20 leading-none">01</span>
                <div className="w-10 h-10 rounded-lg bg-[#1D4ED8]/25 border border-[#60A5FA]/30 flex items-center justify-center text-[#93C5FD] group-hover:bg-[#1D4ED8]/40 transition-colors">
                  <Search size={20} />
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <h3 className="text-xs font-black text-[#60A5FA] uppercase tracking-wider">DISCOVER</h3>
                <p className="text-base font-bold text-white">Government Challenges</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Explore real public problems across Maharashtra departments aligned with your expertise.
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">12 Active Opportunities</span>
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="text-xs font-bold text-[#60A5FA] hover:text-white flex items-center gap-1 transition-colors cursor-pointer group/cta"
                >
                  Explore <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 02: SHOWCASE */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl group">
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl font-black text-white/20 leading-none">02</span>
                <div className="w-10 h-10 rounded-lg bg-[#10B981]/25 border border-[#34D399]/30 flex items-center justify-center text-[#6EE7B7] group-hover:bg-[#10B981]/40 transition-colors">
                  <Target size={20} />
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <h3 className="text-xs font-black text-[#34D399] uppercase tracking-wider">SHOWCASE</h3>
                <p className="text-base font-bold text-white">Your Solution</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Present your capabilities, experience and evidence against government requirements.
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">Smart Capability Matching</span>
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="text-xs font-bold text-[#34D399] hover:text-white flex items-center gap-1 transition-colors cursor-pointer group/cta"
                >
                  Showcase <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 03: COLLABORATE */}
            <div className="bg-white/[0.06] hover:bg-white/[0.1] backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-7 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl group">
              <div className="flex items-start justify-between mb-5">
                <span className="text-3xl font-black text-white/20 leading-none">03</span>
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/25 border border-[#FB923C]/30 flex items-center justify-center text-[#FDBA74] group-hover:bg-[#F97316]/40 transition-colors">
                  <Handshake size={20} />
                </div>
              </div>
              <div className="space-y-1 mb-3">
                <h3 className="text-xs font-black text-[#FB923C] uppercase tracking-wider">COLLABORATE</h3>
                <p className="text-base font-bold text-white">With Departments</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Move beyond discovery into structured collaboration, validation and pilot execution.
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-semibold">90-Day Sandbox Program</span>
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="text-xs font-bold text-[#FB923C] hover:text-white flex items-center gap-1 transition-colors cursor-pointer group/cta"
                >
                  Collaborate <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. LATEST OPPORTUNITIES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14 sm:py-18 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight uppercase">
                Latest Opportunities
              </h2>
            </div>
            <Link href="/innovation-hub" className="text-xs font-bold text-[#1D4ED8] hover:text-[#0A2540] flex items-center gap-1 transition-colors">
              View All Opportunities <ArrowRight size={12} />
            </Link>
          </div>

          {/* Opportunity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {opportunities.map((opp, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 flex flex-col gap-4 transition-all hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5 group"
              >
                {/* Top: Case ID & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#1D4ED8] bg-[#EEF5FC] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {opp.caseId}
                  </span>
                  <ChevronRight size={16} className="text-[#94A3B8] group-hover:text-[#0A2540] transition-colors" />
                </div>

                {/* Title & Dept */}
                <div>
                  <h3 className="text-base font-bold text-[#0A2540] leading-snug">{opp.title}</h3>
                  <p className="text-xs text-[#475569] mt-1">{opp.dept}{opp.location ? ` · ${opp.location}` : ""}</p>
                </div>

                {/* Status & Match */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E2E8F0]">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ color: opp.statusColor, backgroundColor: opp.statusBg }}
                  >
                    {opp.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16834B]" />
                    <span className="text-xs font-bold text-[#0A2540]">{opp.match} match</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7. HAVE AN IDEA OR FEEDBACK FOR PRAMAN?
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#F8FAFC] py-14 sm:py-18 border-b border-[#E2E8F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Text */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight leading-tight">
                Have an Idea or Feedback for PRAMAN?
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                Great public innovation can begin anywhere. Share a problem, idea or feedback that could help improve public services.
              </p>
            </div>

            {/* Right: 3 Action Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Suggest a Problem */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <Lightbulb size={18} className="text-[#B45309]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0A2540]">Suggest a Problem</h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    I&apos;ve identified a public problem that government should solve.
                  </p>
                </div>
                <Link
                  href="/innovation-hub"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:text-[#0A2540] transition-colors group/cta"
                >
                  Share Problem <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Submit an Innovation */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#EEF5FC] flex items-center justify-center">
                  <Zap size={18} className="text-[#1D4ED8]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0A2540]">Submit an Innovation</h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    I have an idea or solution that could address a public challenge.
                  </p>
                </div>
                <Link
                  href="/innovation-hub"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#1D4ED8] hover:text-[#0A2540] transition-colors group/cta"
                >
                  Submit Innovation <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Share Feedback */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:border-[#CBD5E1] hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <MessageCircle size={18} className="text-[#16834B]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#0A2540]">Share Feedback</h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    Help us improve PRAMAN with your suggestions, feedback and insights.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#16834B] hover:text-[#0A2540] transition-colors group/cta"
                >
                  Give Feedback <ArrowRight size={12} className="group-hover/cta:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. CONNECT WITH PRAMAN (Upgraded Contact Section)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="bg-[#0A2540] text-white py-14 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 mb-10">
            {/* Column 1: Connect With PRAMAN */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Connect with PRAMAN
              </h3>
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Need help? Have a government challenge? Are you a startup?
                Want to contribute an idea or share feedback?
                We&apos;re here to connect innovators, departments and citizens.
              </p>

              {/* Audience Quick CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={() => setRoleModalType("government")}
                  className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Government
                </button>
                <button
                  onClick={() => setRoleModalType("startup")}
                  className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Startup
                </button>
                <button
                  onClick={() => setStartupRegisterModalOpen(true)}
                  className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Innovator
                </button>
                <a
                  href="#contact"
                  className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-1.5 rounded-full transition-all"
                >
                  Citizen
                </a>
              </div>
            </div>

            {/* Column 2: Contact Details */}
            <div className="md:col-span-4 space-y-4 text-xs text-white/80">
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-white/60 shrink-0" />
                  <span>+91 22 1234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-white/60 shrink-0" />
                  <span>support@praman.maharashtra.gov.in</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="text-white/60 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Mantralaya, Mumbai,<br />
                    Maharashtra 400032
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Locate Us Map */}
            <div className="md:col-span-4 space-y-3">
              <MantralayaMapCard />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9. FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-[#061727] text-white pt-8 pb-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Logo + Branding */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/praman-logo-clean.png"
                alt="PRAMAN"
                width={140}
                height={38}
                className="h-10 w-auto object-contain brightness-0 invert opacity-80"
              />
              <div className="hidden sm:block border-l border-white/15 pl-4">
                <p className="text-[10px] text-white/50 leading-tight">Public Procurement Intelligence Platform</p>
              </div>
            </div>

            {/* Center: Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-white/60">
              <Link href="/" className="hover:text-white transition-colors">{t("home")}</Link>
              <a href="#what-is-praman" className="hover:text-white transition-colors">{t("about")}</a>
              <button onClick={() => setRoleModalType("government")} className="hover:text-white transition-colors cursor-pointer">{t("forGovernment")}</button>
              <button onClick={() => setRoleModalType("startup")} className="hover:text-white transition-colors cursor-pointer">{t("forStartups")}</button>
              <Link href="/transparency" className="hover:text-white transition-colors">{t("resources")}</Link>
              <a href="#contact" className="hover:text-white transition-colors">{t("contactUs")}</a>
            </nav>

            {/* Right: Tagline */}
            <div className="text-center lg:text-right">
              <p className="text-[10px] text-white/40 italic leading-relaxed">
                Building a more innovative,<br className="hidden sm:inline" />
                transparent and prosperous Maharashtra.
              </p>
              {/* Social icons placeholder - using text links */}
              <div className="flex items-center justify-center lg:justify-end gap-3 mt-2">
                <span className="text-[10px] text-white/30 font-bold">in</span>
                <span className="text-[10px] text-white/30 font-bold">𝕏</span>
                <span className="text-[10px] text-white/30 font-bold">▶</span>
                <span className="text-[10px] text-white/30 font-bold">○</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/40">
            <p>
              © 2026 PRAMAN, Government of Maharashtra. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/transparency" className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-white/20">|</span>
              <Link href="/transparency" className="hover:text-white transition-colors">Terms</Link>
              <span className="text-white/20">|</span>
              <Link href="/transparency" className="hover:text-white transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>

        {/* Faint Skyline Silhouette */}
        <div className="absolute bottom-4 left-0 right-0 pointer-events-none text-white/[0.03]">
          <SkylineBackdrop className="w-full h-16 opacity-30" />
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
          MODALS — All existing modals preserved exactly
          ═══════════════════════════════════════════════════════════════ */}

      {/* Government Authentication Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-[480px] bg-white rounded-lg shadow-2xl border border-[#DCE3EC] overflow-hidden">
            {/* Header */}
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/images/praman-logo-clean.png"
                  alt="PRAMAN"
                  width={140}
                  height={38}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <div>
                  <h3 className="text-sm font-black text-white leading-tight">
                    PRAMAN Official Gateway
                  </h3>
                  <p className="text-[10px] text-white/70">
                    Department &amp; Startup Sign In · 2FA Enforced
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-[#FEE2E2] border border-[#FCA5A5] rounded text-xs text-[#DC2626] flex items-center gap-2 font-medium">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    Official Email
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@praman.local"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#334155] mb-1">
                    MFA Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={mfa}
                      onChange={(e) => setMfa(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8F9FA] border border-[#DCE3EC] rounded focus:bg-white focus:border-[#1455B8] outline-none text-[#111827] font-mono tracking-widest font-bold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading === "Verifying MFA"}
                  className="w-full h-10 bg-[#0B2A5B] hover:bg-[#061B3A] text-white font-bold rounded flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 mt-4"
                >
                  <span>{loading === "Verifying MFA" ? "Verifying Credentials…" : "Authenticate & Sign In"}</span>
                  <ArrowRight size={14} />
                </button>
              </form>

              {/* Demo Evaluation Personas */}
              <div className="mt-5 pt-3.5 border-t border-[#DCE3EC]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5D6878] mb-2">
                  One-Click Demo Personas:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_USERS.map((u) => (
                    <button
                      key={u.title}
                      type="button"
                      onClick={() => handleQuickFill(u.email)}
                      className="p-1.5 rounded border border-[#DCE3EC] hover:border-[#1455B8] bg-[#F8F9FA] hover:bg-[#EEF5FC] text-left transition-all"
                    >
                      <p className="font-bold text-[10px] text-[#111827]">{u.title}</p>
                      <p className="text-[8.5px] text-[#5D6878] truncate">{u.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Selection Modal */}
      {roleModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-[420px] bg-white rounded-xl shadow-2xl border border-[#DCE3EC] overflow-hidden animate-fade-in">
            <div className={`px-6 py-5 flex items-center justify-between ${roleModalType === "startup" ? "bg-[#16834B]" : "bg-[#0B2A5B]"}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{roleModalType === "startup" ? "🚀" : "🏛️"}</span>
                <div>
                  <h3 className="text-base font-black text-white leading-tight">
                    {roleModalType === "startup" ? "Startup Portal" : "Government Portal"}
                  </h3>
                  <p className="text-[11px] text-white/75 mt-0.5">
                    {roleModalType === "startup"
                      ? "Register your startup or sign in to your dedicated portal"
                      : "Register your department or sign in as an officer"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRoleModalType(null)}
                className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/15 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 gap-3">
              {/* Registration Option */}
              <button
                onClick={() => {
                  setRoleModalType(null);
                  if (roleModalType === "startup") {
                    setStartupRegisterModalOpen(true);
                  } else {
                    setLoginModalOpen(true);
                  }
                }}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all hover:shadow-md cursor-pointer ${
                  roleModalType === "startup"
                    ? "border-[#16834B] hover:bg-[#F0FDF4]"
                    : "border-[#0B2A5B] hover:bg-[#EEF5FC]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  roleModalType === "startup" ? "bg-[#DCFCE7] text-[#16834B]" : "bg-[#EEF5FC] text-[#0B2A5B]"
                }`}>
                  <FileText size={22} />
                </div>
                <div>
                  <p className="font-black text-[#111827] text-sm leading-tight">
                    {roleModalType === "startup" ? "Register a New Startup" : "Register Government Entity"}
                  </p>
                  <p className="text-xs text-[#5D6878] mt-0.5">
                    {roleModalType === "startup"
                      ? "Fill out venture submission form & apply for challenges"
                      : "Onboard your department and post procurement challenges"}
                  </p>
                </div>
                <ArrowRight size={16} className={`ml-auto shrink-0 ${roleModalType === "startup" ? "text-[#16834B]" : "text-[#0B2A5B]"}`} />
              </button>

              {/* Login Option */}
              <button
                onClick={() => {
                  if (roleModalType === "startup") {
                    handleStartupLoginDirect();
                  } else {
                    handleGovLoginDirect();
                  }
                }}
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-[#DCE3EC] text-left transition-all hover:border-[#94A3B8] hover:bg-[#F8F9FA] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0">
                  <Lock size={22} />
                </div>
                <div>
                  <p className="font-black text-[#111827] text-sm leading-tight">
                    {roleModalType === "startup" ? "Login as Startup" : "Login as Government Officer"}
                  </p>
                  <p className="text-xs text-[#5D6878] mt-0.5">
                    {roleModalType === "startup"
                      ? "Access the dedicated Startup Portal directly"
                      : "Access the Government Procurement Officer Workspace"}
                  </p>
                </div>
                <ArrowRight size={16} className="ml-auto shrink-0 text-[#475569]" />
              </button>
            </div>

            <div className="px-6 pb-5 text-center">
              <p className="text-[10px] text-[#94A3B8]">
                Strict Portal Isolation · Protected by 2FA · Government of Maharashtra
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Startup Registration Form Modal */}
      <StartupRegisterModal
        isOpen={startupRegisterModalOpen}
        onClose={() => setStartupRegisterModalOpen(false)}
        onSuccessRedirect={() => {
          setStartupRegisterModalOpen(false);
          handleStartupLoginDirect();
        }}
      />
    </div>
  );
}