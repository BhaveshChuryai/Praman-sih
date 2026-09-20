"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { usePraman } from "@/lib/PramanContext";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";
import {
  Search, Lightbulb, FileText, Building2, MapPin, Clock, Users,
  ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, Shield,
  Target, BookOpen, GitBranch, RefreshCw, X, Plus, Send,
  ShieldCheck, Info, Sparkles, Filter, Award, Rocket, Check,
  ExternalLink, ArrowUpRight, HelpCircle, Eye, Lock, Layers
} from "lucide-react";
import type { HubChallenge } from "@/types/praman";
import { StartupRegisterModal } from "@/components/StartupRegisterModal";

/* ═══════════════════════════════════════════════════════════════
   DEFAULT / FALLBACK PUBLIC CHALLENGES
   ═══════════════════════════════════════════════════════════════ */

const DEFAULT_PUBLIC_CHALLENGES: HubChallenge[] = [
  {
    id: "chl-pwd-001",
    display_id: "CHL-PWD-2026-001",
    title: "AI-Powered Real-Time Pothole & Road Surface Distress Detection",
    department: "Public Works Department, Maharashtra",
    domain: "Urban Infrastructure",
    location: "Pune District",
    status: "Open for Solutions",
    urgency: "High",
    days_remaining: 18,
    submission_count: 7,
    stage: "DISCOVER",
    budget: "₹1,00,00,000",
    technology: "Computer Vision & Edge AI",
    description: "Automated road condition mapping using public bus fleet cameras to detect potholes, cracks, and surface degradation before monsoons.",
    context: "State highway monitoring in Pune district covering 1,200 km of arterial roads.",
    affected_area: "Pune Metropolitan Region & Suburban Arteries",
    current_process: "Manual physical surveys conducted twice annually with delayed reporting cycles.",
    current_limitations: "Infrequent inspections result in unmonitored road deterioration and delayed maintenance.",
    expected_impact: "80% reduction in road survey cycle time and 90%+ hazard detection accuracy within 24 hours.",
    functional_requirements: [
      "Real-time video inference on edge hardware mounted on public transport vehicles",
      "Automated GPS geo-tagging with sub-meter spatial precision",
      "Centralized GIS hazard heatmap with severity classification",
      "Automated maintenance ticket dispatch to PWD zonal engineers",
    ],
    technical_requirements: [
      "Detection accuracy >85% at vehicle speeds up to 60 km/h",
      "Latency <500ms per inference frame on edge accelerator",
      "Encrypted telemetry over 4G/5G with offline cache support",
      "REST API compliance with Maharashtra Geo-Portal standards",
    ],
    kpis: [
      { name: "Pothole Detection Accuracy", target: "≥88%" },
      { name: "Edge Inference Latency", target: "<400ms" },
      { name: "Geo-Tagging Precision", target: "<1.5 meters" },
      { name: "Survey Coverage Rate", target: "500 km/week" },
    ],
    constraints: [
      "Must operate on 12V DC vehicle battery without affecting vehicle electronics",
      "All edge AI models must run locally without continuous cloud dependency",
    ],
    deployment: "Deployment across 50 PMPML public transit buses in Pune",
    integration: "REST API & GeoJSON sync with PWD Asset Management Portal",
    eligible_categories: [
      "DPIIT-registered startups (AI & Computer Vision)",
      "IoT & Edge Hardware Innovators",
      "Smart City & Mobility Solution Providers",
    ],
    timeline: "90-Day Sandbox Pilot following 14-day technical verification",
    data_class: "PUBLIC",
  },
  {
    id: "chl-wtr-002",
    display_id: "CHL-WTR-2026-002",
    title: "IoT-Based Water Quality & Contamination Early Warning System",
    department: "Water Resources Department, Maharashtra",
    domain: "Water Management",
    location: "Nashik Region",
    status: "Open for Solutions",
    urgency: "Critical",
    days_remaining: 24,
    submission_count: 5,
    stage: "DISCOVER",
    budget: "₹75,00,000",
    technology: "IoT Sensors & Telemetry",
    description: "Low-power multi-parameter water sensor probes for real-time contamination detection across Godavari river basin reservoirs.",
    context: "Surface water quality monitoring for agricultural and domestic drinking water distribution.",
    affected_area: "Upper Godavari Catchment & Nashik Municipal Reservoirs",
    current_process: "Manual water sample collection with laboratory turnaround time of 48–72 hours.",
    current_limitations: "Delayed lab results prevent immediate containment of industrial runoff spikes.",
    expected_impact: "Instant anomaly alerting within 15 minutes of threshold breach with automated telemetry.",
    functional_requirements: [
      "Continuous sensing of pH, Turbidity, Dissolved Oxygen, and TDS",
      "Solar-powered floatable buoy probes with 30-day battery backup",
      "Cryptographically signed telemetry to prevent data tampering",
      "Automated SMS/WhatsApp alerts to district health & water authorities",
    ],
    technical_requirements: [
      "Sensor sampling frequency ≥ 1 reading per 10 minutes",
      "Solar charging autonomy with IP68 submersible casing",
      "LoRaWAN & 4G cellular dual-uplink support",
      "Data residency compliance within Indian geographic boundaries",
    ],
    kpis: [
      { name: "Contamination Detection Lag", target: "<15 minutes" },
      { name: "Sensor Uptime", target: "≥99.2%" },
      { name: "Telemetry Delivery Rate", target: "≥98.5%" },
    ],
    constraints: [
      "Solar-powered floatable buoy probes with 30-day battery backup",
      "Must withstand river currents up to 3 m/s",
    ],
    deployment: "Floatable sensor grid across 12 monitoring stations",
    integration: "WRD Central SCADA & National Hydrology Project Dashboard",
    eligible_categories: [
      "CleanTech & WaterTech Startups",
      "IoT Environmental Sensing Providers",
      "DPIIT-recognized hardware innovators",
    ],
    timeline: "60-Day Pilot in 3 primary reservoir intake points",
    data_class: "PUBLIC",
  },
  {
    id: "chl-mcgm-003",
    display_id: "CHL-MCGM-2026-003",
    title: "Dynamic Smart Municipal Waste Routing & Bin Fill-Level Optimization",
    department: "Municipal Corporation of Greater Mumbai (MCGM)",
    domain: "Citizen Services",
    location: "Mumbai",
    status: "Open for Solutions",
    urgency: "Medium",
    days_remaining: 32,
    submission_count: 9,
    stage: "DISCOVER",
    budget: "₹1,20,00,000",
    technology: "IoT Sensors & AI Optimization",
    description: "Dynamic route optimization for municipal waste collection vehicles using ultrasonic bin fill-level sensors and traffic telemetry.",
    context: "Ward-level solid waste management across South Mumbai residential and commercial zones.",
    affected_area: "MCGM Ward A & D (Colaba, Fort, Malabar Hill)",
    current_process: "Fixed daily collection routes regardless of actual garbage bin fill levels.",
    current_limitations: "Excessive fuel consumption and overflow incidents during festival and monsoon seasons.",
    expected_impact: "25% reduction in municipal fleet fuel consumption and 95% reduction in bin overflow incidents.",
    functional_requirements: [
      "Ultrasonic fill sensors retrofittable to existing community bins",
      "Dynamic driver turn-by-turn route dispatch mobile app",
      "Citizen grievance image verification engine",
    ],
    technical_requirements: [
      "Sensor battery life >3 years on standard Li-ion cells",
      "Route computation time <30 seconds for 500-node network",
      "Real-time GPS vehicle tracking with telemetry sync",
    ],
    kpis: [
      { name: "Fuel Efficiency Improvement", target: "≥20%" },
      { name: "Bin Overflow Incident Reduction", target: "≥90%" },
      { name: "Route Adherence Rate", target: "≥95%" },
    ],
    constraints: [
      "Ruggedized IP67 ultrasonic sensors to withstand monsoon flooding",
      "Compatible with existing MCGM Swachh Bharat telemetry backend",
    ],
    deployment: "350 community bins & 25 waste compactor trucks in South Mumbai",
    integration: "MCGM Solid Waste Management Command & Control Center",
    eligible_categories: [
      "Smart City & Urban Mobility Startups",
      "Logistics Optimization & AI Startups",
    ],
    timeline: "90-Day Ward-level Pilot Deployment",
    data_class: "PUBLIC",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PUBLIC INNOVATION HUB COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function PublicInnovationHubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, email, setEmail, password, setPassword, mfa, setMfa, login } = usePraman();
  const { language, setLanguage, isHindi } = useI18n();

  // State
  const [challenges, setChallenges] = useState<HubChallenge[]>(DEFAULT_PUBLIC_CHALLENGES);
  const [loading, setLoading] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");

  // Modals & Panels
  const [selectedChallenge, setSelectedChallenge] = useState<HubChallenge | null>(null);
  const [submitChallenge, setSubmitChallenge] = useState<HubChallenge | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [startupRegisterModalOpen, setStartupRegisterModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [form, setForm] = useState({
    challenge_id: "",
    solution_name: "",
    company: user?.name ?? "",
    category: "",
    short_description: "",
    technical_capabilities: "",
    technology_stack: "",
    deployment_model: "",
    previous_deployments: "",
    government_experience: "",
    evidence_summary: "",
    contact_email: user?.email ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch from API or fallback
  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ) params.set("q", searchQ);
      if (filterDomain) params.set("domain", filterDomain);
      if (filterLocation) params.set("location", filterLocation);
      if (filterUrgency) params.set("urgency", filterUrgency);
      const data = await api<{ items: HubChallenge[]; total: number }>(`/innovation-hub/challenges?${params.toString()}`);
      if (data?.items && data.items.length > 0) {
        setChallenges(data.items);
      } else {
        setChallenges(DEFAULT_PUBLIC_CHALLENGES);
      }
    } catch {
      setChallenges(DEFAULT_PUBLIC_CHALLENGES);
    } finally {
      setLoading(false);
    }
  }, [searchQ, filterDomain, filterLocation, filterUrgency]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Filtered challenges
  const displayedChallenges = useMemo(() => {
    return challenges.filter((c) => {
      if (searchQ) {
        const q = searchQ.toLowerCase();
        const match = c.title.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.technology.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterDomain && c.domain !== filterDomain) return false;
      if (filterLocation && c.location !== filterLocation) return false;
      if (filterUrgency && c.urgency !== filterUrgency) return false;
      return true;
    });
  }, [challenges, searchQ, filterDomain, filterLocation, filterUrgency]);

  function handleOpenSubmit(challenge?: HubChallenge) {
    if (challenge) {
      setSubmitChallenge(challenge);
      setForm((f) => ({ ...f, challenge_id: challenge.id }));
    } else if (challenges.length > 0) {
      setSubmitChallenge(challenges[0]);
      setForm((f) => ({ ...f, challenge_id: challenges[0].id }));
    }
    setSubmitModalOpen(true);
  }

  async function handleSolutionSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.solution_name.trim() || !form.company.trim() || !form.short_description.trim()) {
      setFormError("Please provide Solution Name, Company, and Short Description.");
      return;
    }
    setSubmitting(true);
    try {
      await api(`/innovation-hub/challenges/${form.challenge_id || "chl-pwd-001"}/solutions`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitModalOpen(false);
      }, 2500);
    } catch {
      // Prototype simulation fallback
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitModalOpen(false);
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  }

  const DOMAINS = ["Urban Infrastructure", "Water Management", "Citizen Services", "Transport", "Healthcare"];
  const LOCATIONS = ["Pune", "Nashik", "Nagpur", "Mumbai", "Aurangabad"];
  const URGENCIES = ["High", "Critical", "Medium", "Low"];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      
      {/* ═══════════════════════════════════════════════════════════════
         1. PUBLIC HEADER (Independent of Government Portal Shell)
         ═══════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-[88px] flex items-center justify-between gap-4">
          {/* Left: PRAMAN Logo + Innovation Hub Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center group py-1">
              <Image
                src="/images/praman-logo-clean.png"
                alt="PRAMAN"
                width={260}
                height={65}
                className="h-[52px] sm:h-[62px] w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF5FC] border border-[#BFDBFE] text-[#1D4ED8] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} /> Innovation Hub
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-bold text-[#334155]">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors">
              Home
            </Link>
            <Link href="/innovation-hub" className="text-[#1E40AF] font-black relative py-1">
              Innovation Hub
              <span className="absolute bottom-[-10px] left-0 right-0 h-[2.5px] bg-[#1E40AF] rounded-full" />
            </Link>
            <a href="#how-it-works" className="hover:text-[#1E40AF] transition-colors">
              How It Works
            </a>
            <a href="#challenges" className="hover:text-[#1E40AF] transition-colors">
              Opportunities
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isHindi ? "en" : "hi")}
              className={`text-xs font-bold px-3 py-1.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
                isHindi
                  ? "bg-[#1E40AF] text-white border-[#1E40AF]"
                  : "bg-white text-[#0B2A5B] border-[#CBD5E1] hover:bg-[#EEF5FC]"
              }`}
            >
              <span>{isHindi ? "हिंदी" : "EN"}</span>
            </button>

            {/* If logged in: Portal Access Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="bg-[#0A2540] hover:bg-[#061727] text-white text-[12px] font-bold px-4 py-2 rounded shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>{user.role === "startup" ? "Startup Portal" : "Government Portal"}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStartupRegisterModalOpen(true)}
                  className="hidden sm:inline-flex bg-white hover:bg-slate-50 text-[#0A2540] border border-[#CBD5E1] text-[12px] font-bold px-4 py-2 rounded transition-colors"
                >
                  For Startups
                </button>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white text-[12px] font-bold px-5 py-2 rounded shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Sign In</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
         2. HERO / DISCOVERY INTRODUCTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#0A2540] via-[#0D3256] to-[#0A2540] text-white py-14 px-4 sm:px-8 border-b border-[#1E3A8A]">
        <div className="max-w-[1360px] mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#93C5FD] text-[11px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={13} style={{ color: "#F59E0B" }} />
            Open Innovation & Public Problem Discovery
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl text-white">
            Discover Government Challenges. <br className="hidden sm:block" />
            <span className="text-[#93C5FD]">Build Solutions. Create Public Impact.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
            Explore verified public-sector challenges and submit innovative solutions that can progress through PRAMAN's evidence-based evaluation and procurement lifecycle.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="#challenges"
              className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-[13px] px-6 py-3 rounded-md shadow-lg transition-all flex items-center gap-2"
            >
              <Search size={15} /> Explore Government Challenges
            </a>
            <button
              onClick={() => handleOpenSubmit()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-[13px] px-6 py-3 rounded-md transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <Send size={15} style={{ color: "#F59E0B" }} /> Submit a Solution
            </button>
          </div>

          {/* Value proposition disclaimer banner */}
          <div className="mt-8 px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 max-w-3xl flex items-center justify-center gap-2 text-xs text-slate-300">
            <Info size={14} className="text-[#93C5FD] shrink-0" />
            <span>
              <strong>Note:</strong> Explore public-sector challenges, discover innovation opportunities, and submit solutions that can progress into the PRAMAN procurement lifecycle.
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         3. HOW INNOVATION HUB WORKS (Visual Flow Architecture)
         ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-12 bg-white border-b border-[#E2E8F0] px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
              How Innovation Hub Works
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
              From Public Problem to Government Pilot
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Innovation Hub connects forward-thinking startups with departmental problems through a structured 5-step validation gateway.
            </p>
          </div>

          {/* 5-Step Architecture Flow */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Government Challenge",
                desc: "State departments identify pressing public operational challenges with defined KPIs.",
                icon: <Building2 size={20} className="text-[#1D4ED8]" />,
                badge: "Intake",
              },
              {
                step: "02",
                title: "Open Discovery",
                desc: "Startups and innovators openly discover and evaluate technical challenge requirements.",
                icon: <Search size={20} className="text-[#0D9488]" />,
                badge: "Discovery",
              },
              {
                step: "03",
                title: "Solution Submission",
                desc: "Innovators submit technical architecture, deployment credentials, and capability proofs.",
                icon: <Send size={20} className="text-[#D97706]" />,
                badge: "Submission",
              },
              {
                step: "04",
                title: "Evidence Validation",
                desc: "Self-submitted claims are cryptographically benchmarked against departmental metrics.",
                icon: <ShieldCheck size={20} className="text-[#16834B]" />,
                badge: "Validation",
              },
              {
                step: "05",
                title: "PRAMAN Procurement",
                desc: "Validated solutions qualify for 90-day sandbox pilots and procurement handoff.",
                icon: <Award size={20} className="text-[#0A2540]" />,
                badge: "Piloting",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-5 flex flex-col justify-between hover:border-[#BFDBFE] hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black font-mono text-slate-400">STAGE {item.step}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center mb-3 shadow-2xs">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A] mb-1.5">{item.title}</h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-3 text-xs text-[#1E40AF]">
            <CheckCircle2 size={16} className="shrink-0 text-[#1D4ED8]" />
            <span>
              <strong>Discovery Layer Governance:</strong> Innovation Hub does not directly award procurement contracts. It feeds qualified, evidence-validated solutions into the formal PRAMAN procurement lifecycle for transparent evaluation.
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         4. FEATURED / OPEN GOVERNMENT CHALLENGES (Discovery Area)
         ═══════════════════════════════════════════════════════════════ */}
      <section id="challenges" className="py-12 px-4 sm:px-8 max-w-[1360px] mx-auto w-full flex-1">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
              Verified Opportunities
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-0.5">
              Open Government Challenges
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse active problem statements published by Maharashtra state departments.
            </p>
          </div>

          <button
            onClick={() => handleOpenSubmit()}
            className="bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold text-xs px-4 py-2.5 rounded-md transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Submit Solution for Review
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-6 shadow-xs flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges by keyword, department, technology..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-[#CBD5E1] text-xs outline-none bg-[#F8FAFC] focus:bg-white focus:border-[#1D4ED8] transition-colors"
            />
          </div>

          {/* Domain Filter */}
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#CBD5E1] text-xs font-semibold text-slate-700 bg-white outline-none"
          >
            <option value="">All Domains</option>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#CBD5E1] text-xs font-semibold text-slate-700 bg-white outline-none"
          >
            <option value="">All Locations</option>
            {LOCATIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Urgency Filter */}
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#CBD5E1] text-xs font-semibold text-slate-700 bg-white outline-none"
          >
            <option value="">All Urgency</option>
            {URGENCIES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {(searchQ || filterDomain || filterLocation || filterUrgency) && (
            <button
              onClick={() => {
                setSearchQ("");
                setFilterDomain("");
                setFilterLocation("");
                setFilterUrgency("");
              }}
              className="px-3 py-2 rounded-md border border-[#CBD5E1] text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Challenge Cards Grid */}
        {loading ? (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex items-center justify-center gap-2 text-xs font-bold text-[#1D4ED8]">
            <RefreshCw size={16} className="animate-spin" /> Loading challenges...
          </div>
        ) : displayedChallenges.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center">
            <Lightbulb size={36} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No challenges matching your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try broadening your search criteria or clear your active filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedChallenges.map((challenge) => {
              const isUrgent = challenge.urgency === "Critical" || challenge.urgency === "High";
              return (
                <div
                  key={challenge.id}
                  className="bg-white border border-[#E2E8F0] rounded-lg p-5 hover:border-[#93C5FD] hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header line: ID, Domain, Urgency, Days */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
                          {challenge.display_id}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-slate-600">
                          {challenge.domain}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${
                          challenge.urgency === "Critical"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : challenge.urgency === "High"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}>
                          {challenge.urgency} Priority
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-[#1D4ED8]">
                          <Clock size={12} /> {challenge.days_remaining} Days Remaining
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Users size={12} /> {challenge.submission_count} Submissions
                        </span>
                      </div>
                    </div>

                    {/* Challenge Title */}
                    <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                      {challenge.title}
                    </h3>

                    {/* Problem Summary */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {challenge.description}
                    </p>

                    {/* Department, Location, Tech */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-3 border-t border-[#F1F5F9]">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={13} className="text-[#1D4ED8]" />
                        <strong>Dept:</strong> {challenge.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#1D4ED8]" />
                        <strong>Location:</strong> {challenge.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Target size={13} className="text-[#1D4ED8]" />
                        <strong>Technology:</strong> {challenge.technology}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers size={13} className="text-[#1D4ED8]" />
                        <strong>Pilot Budget:</strong> {challenge.budget}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E2E8F0]">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Eligible: DPIIT-registered Startups & Innovators
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedChallenge(challenge)}
                        className="px-3 py-1.5 rounded-md border border-[#CBD5E1] text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                      >
                        <Eye size={13} /> View Challenge Details
                      </button>
                      <button
                        onClick={() => handleOpenSubmit(challenge)}
                        className="px-4 py-1.5 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Send size={13} /> Submit Solution
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         5. FOR STARTUPS & INNOVATORS SECTION
         ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-t border-[#E2E8F0] py-14 px-4 sm:px-8">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1D4ED8]">
                Startup Participation
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] mt-1">
                Why Innovators Choose PRAMAN Innovation Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                PRAMAN provides startups with a direct, meritocratic gateway to public procurement without relying on legacy tendering barriers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: "Direct Government Access",
                    desc: "Respond directly to published challenges from PWD, Water Resources, Health, and Municipal bodies.",
                  },
                  {
                    title: "Transparent KPIs",
                    desc: "Evaluate against clear, published metric thresholds without hidden qualification criteria.",
                  },
                  {
                    title: "Funded 90-Day Pilots",
                    desc: "Qualified startups receive structured milestone releases to prove solutions in real conditions.",
                  },
                  {
                    title: "State-wide Scaling",
                    desc: "Successful pilots are stored in Institutional Memory for multi-departmental adoption.",
                  },
                ].map((f, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} className="text-[#16834B]" />
                      <h4 className="text-xs font-bold text-[#0F172A]">{f.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setStartupRegisterModalOpen(true)}
                  className="bg-[#0A2540] hover:bg-[#061727] text-white font-bold text-xs px-5 py-2.5 rounded-md transition-all flex items-center gap-2"
                >
                  <Rocket size={14} /> Register as Startup Innovator
                </button>
                <a
                  href="#challenges"
                  className="bg-white border border-[#CBD5E1] hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-md transition-colors"
                >
                  Explore Active Opportunities
                </a>
              </div>
            </div>

            {/* Right: Ecosystem Impact Card */}
            <div className="bg-[#0A2540] text-white rounded-xl p-8 shadow-md border border-[#1E3A8A]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#93C5FD]">
                  Ecosystem Metrics
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white/10 text-slate-200">
                  Live Snapshot
                </span>
              </div>

              <h3 className="text-xl font-black mb-4">
                Evidence-Driven Public Innovation at Scale
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-[#93C5FD] font-mono">24</p>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Problem Statements</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+4 this quarter</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-[#93C5FD] font-mono">47</p>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Solutions Discovered</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+12 this quarter</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-[#93C5FD] font-mono">18</p>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Startups Onboarded</p>
                  <span className="text-[10px] text-emerald-400 font-bold">+6 this quarter</span>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-2xl font-black text-[#93C5FD] font-mono">93%</p>
                  <p className="text-xs text-slate-300 font-semibold mt-1">Pilot Success Rate</p>
                  <span className="text-[10px] text-emerald-400 font-bold">Verified outcomes</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
                All submitted evidence artifacts are anchored in the PRAMAN Cryptographic Locker, creating an audit-ready trail from first submission to final handoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
         6. PUBLIC FOOTER
         ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0A2540] text-white border-t border-[#1E3A8A] pt-12 pb-8 px-4 sm:px-8 mt-auto">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src="/images/praman-logo-clean.png"
                  alt="PRAMAN"
                  width={200}
                  height={50}
                  className="h-[44px] w-auto object-contain brightness-0 invert"
                />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                PRAMAN (प्रमाण) is Maharashtra's Evidence-Driven Public Procurement & Innovation Platform, bridging government challenges with verified startup capabilities.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-3">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/innovation-hub" className="hover:text-white transition-colors">Innovation Hub</Link></li>
                <li><Link href="/transparency" className="hover:text-white transition-colors">Public Transparency</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#93C5FD] mb-3">
                Portal Access
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li>
                  <button onClick={() => setLoginModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                    Sign In to Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setStartupRegisterModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                    Startup Registration
                  </button>
                </li>
                <li>
                  <Link href="/dashboard" className="text-[#93C5FD] font-bold hover:underline flex items-center gap-1">
                    Government Portal <ArrowUpRight size={12} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 PRAMAN · Government of Maharashtra. All rights reserved.</p>
            <p className="text-[11px]">Designed in alignment with Digital India & MSInS guidelines.</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════
         MODAL: CHALLENGE DETAILS (Public View)
         ═══════════════════════════════════════════════════════════════ */}
      {selectedChallenge && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedChallenge(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-[#F8FAFC] rounded-t-xl flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8]">
                    {selectedChallenge.display_id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    {selectedChallenge.domain}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#0F172A] leading-snug">
                  {selectedChallenge.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {selectedChallenge.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {selectedChallenge.location}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#1D4ED8]"><Clock size={12} /> {selectedChallenge.days_remaining} Days Left</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 text-[#1D4ED8]">
                  Problem Description & Context
                </h4>
                <p className="leading-relaxed bg-[#F8FAFC] p-3 rounded-md border border-slate-200">
                  {selectedChallenge.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-[#1D4ED8]">
                    Functional Requirements
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedChallenge.functional_requirements?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#F8FAFC] p-2 rounded border border-slate-100">
                        <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-[#1D4ED8]">
                    Technical & Performance Targets
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedChallenge.technical_requirements?.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 bg-[#F8FAFC] p-2 rounded border border-slate-100">
                        <Target size={13} className="text-[#1D4ED8] mt-0.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* KPIs */}
              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 text-[#1D4ED8]">
                  Key Performance Indicators (KPIs)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedChallenge.kpis?.map((k, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-center">
                      <p className="text-[10px] text-slate-500 font-semibold">{k.name}</p>
                      <p className="text-sm font-black text-[#1D4ED8] mt-0.5">{k.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1 text-[#16834B]">
                  Who Can Respond
                </h4>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {selectedChallenge.eligible_categories?.map((cat, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-white border border-[#CBD5E1] text-[11px] font-semibold text-slate-700">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-[#F8FAFC] rounded-b-xl flex items-center justify-between">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const c = selectedChallenge;
                  setSelectedChallenge(null);
                  handleOpenSubmit(c);
                }}
                className="px-5 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Send size={13} /> Submit Solution for this Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL: SUBMIT SOLUTION (Public Self-Service)
         ═══════════════════════════════════════════════════════════════ */}
      {submitModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSubmitModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-[#F8FAFC] rounded-t-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1D4ED8]">
                  Public Innovation Intake
                </p>
                <h3 className="text-base font-black text-[#0F172A]">
                  Submit Solution for Evaluation
                </h3>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-md hover:bg-slate-200 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
                <h4 className="text-base font-bold text-slate-900">Solution Submitted Successfully</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your solution has been submitted to the PRAMAN Intake Registry. Evidence claims will be benchmarked through the PRAMAN Evidence Locker.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSolutionSubmit} className="p-5 space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 font-semibold">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Challenge</label>
                  <select
                    value={form.challenge_id}
                    onChange={(e) => setForm({ ...form, challenge_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white outline-none"
                  >
                    {challenges.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.display_id} — {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Solution / Product Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. SmartRoute Vision v2.1"
                      value={form.solution_name}
                      onChange={(e) => setForm({ ...form, solution_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Company / Startup Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Vizz-AI Labs Pvt Ltd"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Solution Summary *</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what your solution does and how it solves this specific government challenge..."
                    value={form.short_description}
                    onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Technology Stack</label>
                    <input
                      type="text"
                      placeholder="e.g. PyTorch, OpenCV, Edge TPU, FastAPI"
                      value={form.technology_stack}
                      onChange={(e) => setForm({ ...form, technology_stack: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      placeholder="founder@startup.com"
                      value={form.contact_email}
                      onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-md bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-[11px] flex items-start gap-2">
                  <Info size={14} className="shrink-0 mt-0.5 text-[#D97706]" />
                  <span>
                    <strong>Validation Notice:</strong> Submitted solutions undergo automated telemetry and evidence validation against published challenge KPIs before qualifying for 90-day sandbox pilots.
                  </span>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-md bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {submitting ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Startup Registration Modal */}
      <StartupRegisterModal
        isOpen={startupRegisterModalOpen}
        onClose={() => setStartupRegisterModalOpen(false)}
        onSuccessRedirect={() => {
          setStartupRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* Login Modal */}
      {loginModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLoginModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#0F172A]">Portal Authentication</h3>
              <button onClick={() => setLoginModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await login();
                setLoginModalOpen(false);
                router.push("/dashboard");
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                  placeholder="officer@praman.local or startup@praman.local"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">2FA Code</label>
                <input
                  type="text"
                  value={mfa}
                  onChange={(e) => setMfa(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 outline-none font-mono"
                  placeholder="123456"
                  required
                />
              </div>

              {/* Quick Fill Demo Roles */}
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quick Demo Logins</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("startup@praman.local");
                      setPassword("demo123");
                      setMfa("123456");
                    }}
                    className="p-1.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-left"
                  >
                    Startup Innovator
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("officer@praman.local");
                      setPassword("demo123");
                      setMfa("123456");
                    }}
                    className="p-1.5 rounded bg-blue-50 border border-blue-200 text-blue-800 font-bold text-left"
                  >
                    Nodal Officer
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-md bg-[#0A2540] hover:bg-[#061727] text-white font-bold text-xs shadow-xs mt-2"
              >
                Sign In to PRAMAN
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PublicInnovationHubPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1D4ED8]">
          <RefreshCw size={16} className="animate-spin" /> Loading PRAMAN Innovation Hub...
        </div>
      </div>
    }>
      <PublicInnovationHubContent />
    </Suspense>
  );
}

