"use client";

import React, { useState, useMemo } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  TestTube2, CheckCircle2, AlertTriangle, Clock, MapPin, Wallet,
  CalendarDays, ArrowRight, ExternalLink, ShieldCheck, FileCheck2,
  ChevronRight, Search, SlidersHorizontal, RotateCcw, Info, Eye,
  Building2, Hash, FileText, Check, X, ShieldAlert, ArrowUpRight,
  Activity, AlertCircle, PlayCircle, Lock
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   MULTI-CASE PILOT & EVIDENCE DATASET
   ═══════════════════════════════════════════════════════════════ */

export type PilotKpi = {
  name: string;
  target: string;
  current: string;
  status: "passed" | "attention" | "failed";
  note?: string;
  proofFile?: string;
};

export type PilotEvidenceItem = {
  id: string;
  name: string;
  category: "Technical" | "Performance" | "Commercial" | "Security" | "Governance";
  status: "Verified" | "Submitted" | "Pending" | "Required";
  uploader: string;
  date: string;
  hash: string;
  verificationNote: string;
  confidence?: string;
};

export type PilotLifecycleStage = {
  key: string;
  label: string;
  status: "completed" | "current" | "upcoming";
  dayRange: string;
  desc: string;
};

export type CasePilotData = {
  caseId: string;
  pilotId: string;
  title: string;
  department: string;
  startup: string;
  location: string;
  budget: string;
  pilotStatus: "IN PROGRESS" | "COMPLETED" | "PAUSED" | "PENDING INTAKE";
  pilotDurationDays: number;
  currentDay: number;
  currentStage: string;
  financialYear: string;
  lifecycle: PilotLifecycleStage[];
  kpis: PilotKpi[];
  evidence: PilotEvidenceItem[];
  nextActionText: string;
  nextActionSubtext: string;
  nextActionButtonLabel: string;
  outcome?: {
    determination: "Procurement Recommended" | "Pilot Completed — No Further Procurement" | "Pilot Extended" | "Further Evidence Required" | "Not Recommended for Procurement";
    summary: string;
    authority: string;
    date: string;
    decisionNumber: string;
  } | null;
};

const PILOT_CASES_DATA: CasePilotData[] = [
  {
    caseId: "PRB-MH-2026-1042",
    pilotId: "PIL-MH-2026-022",
    title: "SMART ROAD CONDITION MONITORING",
    department: "PWD Maharashtra",
    startup: "SkylineAI Solutions",
    location: "Pune Municipal & PWD Zone 4",
    budget: "₹1.00 Cr",
    pilotStatus: "IN PROGRESS",
    pilotDurationDays: 90,
    currentDay: 42,
    currentStage: "DATA COLLECTION",
    financialYear: "FY 2026–27",
    lifecycle: [
      { key: "setup", label: "Pilot Setup", status: "completed", dayRange: "Days 1–14", desc: "Hardware mounting & bus route approval" },
      { key: "deployment", label: "Deployment", status: "completed", dayRange: "Days 15–30", desc: "Edge AI units calibrated on 45 buses" },
      { key: "data_collection", label: "Data Collection", status: "current", dayRange: "Days 31–60", desc: "Real-time road distress telemetry ingest" },
      { key: "evaluation", label: "Evaluation", status: "upcoming", dayRange: "Days 61–75", desc: "Automated KPI benchmark vs ground truth" },
      { key: "review", label: "Government Review", status: "upcoming", dayRange: "Days 76–90", desc: "Final PWD technical acceptance sign-off" },
    ],
    kpis: [
      { name: "Detection Accuracy", target: "≥85%", current: "89.2%", status: "passed", note: "Verified against 200 surveyed pothole segments", proofFile: "Detection_Report_May.pdf" },
      { name: "False Positives", target: "<10%", current: "8.1%", status: "passed", note: "Exceeds benchmark threshold (<10%)", proofFile: "Field_Photos_Sample.zip" },
      { name: "Fleet Coverage", target: "≥90%", current: "76.4%", status: "attention", note: "34 / 45 PMPML buses streaming live data", proofFile: "KPI_Summary_May.xlsx" },
      { name: "Telemetry Latency", target: "<2.0s", current: "1.4s", status: "passed", note: "Edge-to-cloud sync via 4G/5G gateway", proofFile: "Edge_Telemetry_Logs.csv" },
    ],
    evidence: [
      {
        id: "EVID-022-DEP",
        name: "Deployment_Report_Pune.pdf",
        category: "Technical",
        status: "Verified",
        uploader: "PWD Field Evaluator",
        date: "2026-05-15",
        hash: "8F3A92C1...001",
        verificationNote: "Hardware inspection and mounting certificates signed by PWD Mechanical Wing.",
        confidence: "98%",
      },
      {
        id: "EVID-022-TST",
        name: "Test_Results_Calibration.pdf",
        category: "Performance",
        status: "Verified",
        uploader: "SkylineAI Engineering Team",
        date: "2026-05-28",
        hash: "2C1B44A7...002",
        verificationNote: "Dual-camera edge telemetry calibrated over 500 km baseline stretch.",
        confidence: "94%",
      },
      {
        id: "EVID-022-KPI",
        name: "KPI_Evaluation_Midterm.xlsx",
        category: "Commercial",
        status: "Submitted",
        uploader: "Pilot Monitoring Unit",
        date: "2026-06-05",
        hash: "A4F7918E...003",
        verificationNote: "Mid-pilot automated telemetry aggregation submitted for officer review.",
        confidence: "91%",
      },
      {
        id: "EVID-022-SEC",
        name: "Security_Audit_Questionnaire.pdf",
        category: "Security",
        status: "Pending",
        uploader: "CISO / IT Security",
        date: "Due 24 Sept 2026",
        hash: "Pending Upload",
        verificationNote: "CERT-In cybersecurity audit 80% complete; final penetration testing certificate required.",
        confidence: "80%",
      },
      {
        id: "EVID-022-GOV",
        name: "Government_Acceptance_Certificate.pdf",
        category: "Governance",
        status: "Required",
        uploader: "Designated Government Officer",
        date: "Post-Day 90 Review",
        hash: "Pending Generation",
        verificationNote: "Formal acceptance sign-off unlocked upon conclusion of 90-day pilot cycle.",
      },
    ],
    nextActionText: "Submit the required security evidence.",
    nextActionSubtext: "CERT-In cybersecurity penetration audit questionnaire is 80% complete. Final clearance is required prior to government review.",
    nextActionButtonLabel: "Review Security Evidence →",
    outcome: null,
  },
  {
    caseId: "PRB-MH-2026-1043",
    pilotId: "PIL-MH-2026-023",
    title: "URBAN WATER LEAKAGE & DISTRIBUTION NETWORK TELEMETRY",
    department: "Mumbai Municipal Corporation",
    startup: "AquaPulse Dynamics",
    location: "Mumbai Suburban - Ward K/East",
    budget: "₹1.50 Cr",
    pilotStatus: "IN PROGRESS",
    pilotDurationDays: 120,
    currentDay: 24,
    currentStage: "DEPLOYMENT",
    financialYear: "FY 2026–27",
    lifecycle: [
      { key: "setup", label: "Pilot Setup", status: "completed", dayRange: "Days 1–20", desc: "Hydraulic SCADA architecture mapped" },
      { key: "deployment", label: "Deployment", status: "current", dayRange: "Days 21–45", desc: "Acoustic sensor pods installed on pipeline joints" },
      { key: "data_collection", label: "Data Collection", status: "upcoming", dayRange: "Days 46–90", desc: "Pressure transient telemetry collection" },
      { key: "evaluation", label: "Evaluation", status: "upcoming", dayRange: "Days 91–105", desc: "Acoustic leak localization benchmarking" },
      { key: "review", label: "Government Review", status: "upcoming", dayRange: "Days 106–120", desc: "BMC Hydraulic Engineer final sign-off" },
    ],
    kpis: [
      { name: "Acoustic Leak Detection", target: "≥90%", current: "92.4%", status: "passed", note: "Benchmarked on simulated pipeline bursts", proofFile: "Acoustic_Calib_Log.pdf" },
      { name: "Leak Localization Range", target: "<50m", current: "38m", status: "passed", note: "Exceeds precision threshold", proofFile: "GIS_Overlay_Data.kml" },
      { name: "Sensor Pod Density", target: "100 pods", current: "64 pods", status: "attention", note: "36 pods awaiting installation in Sector 4", proofFile: "Pod_Inventory.xlsx" },
      { name: "SCADA Ingestion Rate", target: "≥99%", current: "99.4%", status: "passed", note: "Real-time telemetry streaming active", proofFile: "SCADA_Logs.csv" },
    ],
    evidence: [
      {
        id: "EVID-023-DEP",
        name: "Hydraulic_Site_Readiness.pdf",
        category: "Technical",
        status: "Verified",
        uploader: "BMC Hydraulic Wing",
        date: "2026-06-10",
        hash: "7C3D81A2...001",
        verificationNote: "Pipeline isolation valves and pit access cleared.",
      },
      {
        id: "EVID-023-TST",
        name: "Acoustic_Pod_Calibration.pdf",
        category: "Performance",
        status: "Verified",
        uploader: "AquaPulse Dynamics",
        date: "2026-06-18",
        hash: "3E9A11F4...002",
        verificationNote: "Bench tests confirm acoustic frequency response between 50Hz–2000Hz.",
      },
      {
        id: "EVID-023-SEC",
        name: "SCADA_Network_Isolation.pdf",
        category: "Security",
        status: "Pending",
        uploader: "Municipal IT Security",
        date: "Due 30 Sept 2026",
        hash: "Pending Upload",
        verificationNote: "Network air-gap protocol verification pending IT audit.",
      },
      {
        id: "EVID-023-GOV",
        name: "Ward_Acceptance_Signoff.pdf",
        category: "Governance",
        status: "Required",
        uploader: "Executive Engineer (Water)",
        date: "Post-Day 120",
        hash: "Pending Generation",
        verificationNote: "Required for final procurement readiness gate.",
      },
    ],
    nextActionText: "Complete Zone 1 sensor deployment & upload Cyber Isolation Certificate.",
    nextActionSubtext: "36 acoustic pods remain to be deployed in Sector 4 before data collection stage begins.",
    nextActionButtonLabel: "Review Deployment Evidence →",
    outcome: null,
  },
  {
    caseId: "PRB-MH-2026-1044",
    pilotId: "PIL-MH-2026-024",
    title: "AI EDGE TRAFFIC CONGESTION REDUCTION SYSTEM",
    department: "Nagpur Smart City SPV",
    startup: "NeuralFlow Labs",
    location: "Nagpur Corridor 1 & 2",
    budget: "₹85.00 Lakh",
    pilotStatus: "IN PROGRESS",
    pilotDurationDays: 90,
    currentDay: 68,
    currentStage: "EVALUATION",
    financialYear: "FY 2026–27",
    lifecycle: [
      { key: "setup", label: "Pilot Setup", status: "completed", dayRange: "Days 1–14", desc: "Camera fiber links connected to ICCC" },
      { key: "deployment", label: "Deployment", status: "completed", dayRange: "Days 15–30", desc: "18 junction edge compute boxes live" },
      { key: "data_collection", label: "Data Collection", status: "completed", dayRange: "Days 31–60", desc: "Peak hour traffic video stream telemetry" },
      { key: "evaluation", label: "Evaluation", status: "current", dayRange: "Days 61–75", desc: "Adaptive green timing KPI calculation" },
      { key: "review", label: "Government Review", status: "upcoming", dayRange: "Days 76–90", desc: "Nagpur Traffic Police final clearance" },
    ],
    kpis: [
      { name: "Wait Time Reduction", target: "≥20%", current: "24.8%", status: "passed", note: "Average reduction across 18 arterial junctions", proofFile: "Traffic_Wait_Time.xlsx" },
      { name: "Queue Length Estimation", target: "≥95%", current: "96.1%", status: "passed", note: "Compared against manual traffic counts", proofFile: "Queue_Audit.pdf" },
      { name: "Edge Device Uptime", target: "≥99%", current: "98.6%", status: "attention", note: "Minor power outage logged at Wardha Road junction", proofFile: "Edge_Uptime_Logs.csv" },
      { name: "Emergency Corridor Priority", target: "<30s", current: "19s", status: "passed", note: "Automated green wave triggered for 12 ambulances", proofFile: "Ambulance_Green_Logs.pdf" },
    ],
    evidence: [
      {
        id: "EVID-024-VID",
        name: "Junction_Video_Audit.pdf",
        category: "Technical",
        status: "Verified",
        uploader: "Nagpur SPV Traffic Lead",
        date: "2026-06-25",
        hash: "9A4C22F1...001",
        verificationNote: "30-day continuous video inference audit verified by traffic division.",
      },
      {
        id: "EVID-024-EVL",
        name: "Adaptive_Timing_Benchmark.xlsx",
        category: "Performance",
        status: "Verified",
        uploader: "NeuralFlow Labs",
        date: "2026-07-10",
        hash: "5D1B88E3...002",
        verificationNote: "Telemetry shows 24.8% peak hour congestion index reduction.",
      },
      {
        id: "EVID-024-POL",
        name: "Traffic_Police_Feedback.pdf",
        category: "Governance",
        status: "Submitted",
        uploader: "ACP Traffic Nagpur",
        date: "2026-07-20",
        hash: "2B8E44A1...003",
        verificationNote: "Field observations submitted recommending adoption.",
      },
    ],
    nextActionText: "Finalize Joint SPV Evaluation Dossier.",
    nextActionSubtext: "Evaluation stage is 85% complete. Convene joint review with Traffic Police prior to Government Review stage.",
    nextActionButtonLabel: "View Evaluation Dossier →",
    outcome: null,
  },
  {
    caseId: "PRB-MH-2026-1045",
    pilotId: "PIL-MH-2026-025",
    title: "RURAL HEALTH DRONE DELIVERY NETWORK",
    department: "Public Health Dept Maharashtra",
    startup: "AeroMed Innovations",
    location: "Gadchiroli PHC Cluster",
    budget: "₹1.20 Cr",
    pilotStatus: "COMPLETED",
    pilotDurationDays: 90,
    currentDay: 90,
    currentStage: "GOVERNMENT REVIEW",
    financialYear: "FY 2026–27",
    lifecycle: [
      { key: "setup", label: "Pilot Setup", status: "completed", dayRange: "Days 1–14", desc: "DGCA airspace permissions cleared" },
      { key: "deployment", label: "Deployment", status: "completed", dayRange: "Days 15–30", desc: "Base hubs and cold-chain nests set up" },
      { key: "data_collection", label: "Data Collection", status: "completed", dayRange: "Days 31–60", desc: "150 live medical payload flight missions" },
      { key: "evaluation", label: "Evaluation", status: "completed", dayRange: "Days 61–75", desc: "Cold-chain stability and turnaround telemetry" },
      { key: "review", label: "Government Review", status: "completed", dayRange: "Days 76–90", desc: "Directorate of Health Services sign-off" },
    ],
    kpis: [
      { name: "Emergency Delivery Time", target: "<30 mins", current: "18.4 mins", status: "passed", note: "Delivered antivenom to remote tribal PHC in 18 mins", proofFile: "Flight_Mission_Logs.csv" },
      { name: "Cold-Chain Temperature", target: "2°C - 8°C", current: "100% stable", status: "passed", note: "IoT thermal logger recorded zero temperature breaches", proofFile: "Thermal_Data.pdf" },
      { name: "Flight Success Rate", target: "≥98%", current: "99.2%", status: "passed", note: "149 of 150 successful missions completed safely", proofFile: "DGCA_Compliance.pdf" },
    ],
    evidence: [
      {
        id: "EVID-025-DGC",
        name: "DGCA_BVLOS_Clearance.pdf",
        category: "Technical",
        status: "Verified",
        uploader: "DGCA Airspace Authority",
        date: "2026-04-10",
        hash: "1A2B3C4D...001",
        verificationNote: "Beyond Visual Line of Sight flight authorization cleared.",
      },
      {
        id: "EVID-025-FLT",
        name: "150_Flight_Telemetry_Logs.zip",
        category: "Performance",
        status: "Verified",
        uploader: "AeroMed Innovations",
        date: "2026-06-30",
        hash: "9F8E7D6C...002",
        verificationNote: "Complete GPS, altitude, payload, and battery logs authenticated.",
      },
      {
        id: "EVID-025-MED",
        name: "PHC_Medical_Officer_Signoff.pdf",
        category: "Governance",
        status: "Verified",
        uploader: "Chief Medical Officer Gadchiroli",
        date: "2026-07-15",
        hash: "3C4D5E6F...003",
        verificationNote: "Unanimous medical verification of vaccine and antivenom efficacy.",
      },
    ],
    nextActionText: "Proceed to Procurement Readiness & Decision Gate.",
    nextActionSubtext: "Pilot successfully completed with 100% KPI adherence. Case is ready for authorized government procurement decision.",
    nextActionButtonLabel: "Open Decision Gate →",
    outcome: {
      determination: "Procurement Recommended",
      summary: "The 90-day sandbox pilot successfully met 100% of clinical and telemetry KPIs across 150 live medical payload flights with zero incidents.",
      authority: "Directorate of Health Services, Government of Maharashtra",
      date: "18 September 2026",
      decisionNumber: "GOV-MH-DHS-2026-REC-089",
    },
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PILOT & EVIDENCE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function PilotEvidencePage() {
  const { pilot: contextPilot, loading, error, setTrace } = usePraman();

  // Filter and Selection State
  const [selectedCaseId, setSelectedCaseId] = useState<string>("PRB-MH-2026-1042");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Drawers
  const [selectedEvidence, setSelectedEvidence] = useState<PilotEvidenceItem | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState<boolean>(false);
  const [showNextActionModal, setShowNextActionModal] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>("");

  // Derive unique departments
  const departments = useMemo(() => {
    const list = Array.from(new Set(PILOT_CASES_DATA.map((c) => c.department)));
    return ["All", ...list];
  }, []);

  // Filtered cases for dropdown
  const filteredCases = useMemo(() => {
    return PILOT_CASES_DATA.filter((c) => {
      const matchDept = departmentFilter === "All" || c.department === departmentFilter;
      const matchStatus = statusFilter === "All" || c.pilotStatus === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.startup.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [departmentFilter, statusFilter, searchQuery]);

  // Current active case data
  const currentCase = useMemo(() => {
    return (
      PILOT_CASES_DATA.find((c) => c.caseId === selectedCaseId) ||
      PILOT_CASES_DATA[0]
    );
  }, [selectedCaseId]);

  // Handle case switch
  const handleCaseChange = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActionSuccessMsg("");
  };

  // Reset filters
  const handleResetFilters = () => {
    setDepartmentFilter("All");
    setStatusFilter("All");
    setSearchQuery("");
    setSelectedCaseId("PRB-MH-2026-1042");
  };

  // Open evidence detail
  const handleViewEvidence = (item: PilotEvidenceItem) => {
    setSelectedEvidence(item);
    setShowEvidenceModal(true);
  };

  // Progress percentage
  const progressPct = Math.round(
    (currentCase.currentDay / currentCase.pilotDurationDays) * 100
  );

  return (
    <div className="space-y-5 min-w-0 pb-12 max-w-[1440px] mx-auto">
      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER & FILTERS BAR
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded border bg-white p-4 shadow-sm"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                style={{ background: "var(--gov-navy)" }}
              >
                PILOT & EVIDENCE
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Controlled Sandbox Workspace
              </span>
            </div>
            <h1
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: "var(--gov-navy)" }}
            >
              Pilot Progress & Evidence Verification
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Track pilot progress, performance and evidence required for government evaluation.
            </p>
          </div>

          {/* Compact Right-Side Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search pilot / case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-3 text-xs rounded border bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                style={{ borderColor: "var(--line)", minWidth: "160px" }}
              />
            </div>

            {/* Case Selector Dropdown */}
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="h-8 px-2.5 text-xs font-semibold rounded border bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="Procurement Case Selector"
            >
              {filteredCases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} — {c.startup}
                </option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="Department Filter"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "All" ? "Dept: All" : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="Status Filter"
            >
              <option value="All">Status: All</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Reset */}
            {(departmentFilter !== "All" || statusFilter !== "All" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 rounded border border-dashed border-slate-300 hover:bg-slate-50"
                title="Reset filters"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {actionSuccessMsg && (
        <div
          className="rounded border p-3 flex items-center justify-between text-xs font-medium"
          style={{
            background: "var(--success-light)",
            borderColor: "#bbf7d0",
            color: "var(--success)",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg("")}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. SELECTED PILOT CARD
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded border bg-white p-4 shadow-sm"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {currentCase.caseId}
              </span>
              <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {currentCase.pilotId}
              </span>
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded uppercase"
                style={
                  currentCase.pilotStatus === "COMPLETED"
                    ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
                    : { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }
                }
              >
                {currentCase.pilotStatus === "COMPLETED" ? <CheckCircle2 size={10} /> : <Activity size={10} />}
                {currentCase.pilotStatus}
              </span>
            </div>

            <h2
              className="text-base md:text-lg font-bold uppercase tracking-tight"
              style={{ color: "var(--gov-navy)" }}
            >
              {currentCase.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                <span className="font-semibold text-slate-800">{currentCase.department}</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-blue-700">{currentCase.startup}</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                <span>{currentCase.location}</span>
              </div>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Wallet size={12} className="text-slate-400" />
                <span className="font-semibold">{currentCase.budget}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Link */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-left lg:text-right px-3 py-1.5 rounded bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500">Pilot Duration</p>
              <p className="text-xs font-black text-slate-800">
                {currentCase.pilotDurationDays} Days
              </p>
            </div>

            <div className="text-left lg:text-right px-3 py-1.5 rounded bg-slate-50 border border-slate-200">
              <p className="text-[10px] font-bold uppercase text-slate-500">Current Day</p>
              <p className="text-xs font-black text-blue-700">
                {currentCase.currentDay} / {currentCase.pilotDurationDays}
              </p>
            </div>

            <div className="text-left lg:text-right px-3 py-1.5 rounded bg-blue-50 border border-blue-200">
              <p className="text-[10px] font-bold uppercase text-blue-700">Current Stage</p>
              <p className="text-xs font-black text-blue-900">
                {currentCase.currentStage}
              </p>
            </div>

            <Link
              href="/requirements"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
              style={{ background: "var(--gov-navy)" }}
            >
              View Case <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. PILOT PROGRESS (COMPACT HORIZONTAL LIFECYCLE)
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded border bg-white p-3.5 shadow-sm"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            PILOT PROGRESS & LIFECYCLE
          </p>
          <span className="text-[11px] font-semibold text-slate-500">
            Day {currentCase.currentDay} of {currentCase.pilotDurationDays} ({progressPct}% elapsed)
          </span>
        </div>

        {/* 5-Stage Horizontal Progression */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {currentCase.lifecycle.map((stage, idx) => {
            const isCompleted = stage.status === "completed";
            const isCurrent = stage.status === "current";
            const isUpcoming = stage.status === "upcoming";

            return (
              <div
                key={stage.key}
                className="rounded border p-2.5 transition-all text-left relative overflow-hidden"
                style={
                  isCompleted
                    ? { background: "var(--success-light)", borderColor: "#bbf7d0" }
                    : isCurrent
                    ? { background: "#eff6ff", borderColor: "#bfdbfe" }
                    : { background: "#f8fafc", borderColor: "var(--line)" }
                }
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                  {isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                      <Check size={10} strokeWidth={3} /> Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> Active
                    </span>
                  )}
                  {isUpcoming && (
                    <span className="text-[10px] font-medium text-slate-400">○ Upcoming</span>
                  )}
                </div>

                <p
                  className="text-xs font-bold leading-tight truncate"
                  style={{
                    color: isCompleted
                      ? "var(--success)"
                      : isCurrent
                      ? "var(--gov-navy)"
                      : "var(--ink-soft)",
                  }}
                >
                  {isCompleted ? "✓ " : isCurrent ? "● " : "○ "}
                  {stage.label}
                </p>

                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{stage.dayRange}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN TWO-COLUMN SECTION: KPIs (LEFT) & EVIDENCE + NEXT ACTION (RIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── LEFT COLUMN: PILOT KPIs (7 COLS) ────────────────── */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="rounded border bg-white shadow-sm overflow-hidden"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="px-4 py-3 border-b flex items-center justify-between bg-slate-50"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex items-center gap-2">
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gov-navy)" }}
                >
                  PILOT KPIs
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-100 text-blue-800">
                  {currentCase.kpis.filter((k) => k.status === "passed").length} / {currentCase.kpis.length} On Track
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Continuous Telemetry Ingestion
              </span>
            </div>

            {/* KPI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b text-[10px] font-bold uppercase text-slate-500 bg-white"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <th className="px-4 py-2.5">KPI Parameter</th>
                    <th className="px-3 py-2.5">Target</th>
                    <th className="px-3 py-2.5">Current Telemetry</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-4 py-2.5 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {currentCase.kpis.map((kpi, idx) => {
                    const isPassed = kpi.status === "passed";
                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                background: isPassed ? "var(--success)" : "var(--warning)",
                              }}
                            />
                            <span>{kpi.name}</span>
                          </div>
                          {kpi.note && (
                            <p className="text-[10px] text-slate-500 font-normal mt-0.5 ml-3">
                              {kpi.note}
                            </p>
                          )}
                        </td>
                        <td className="px-3 py-3 text-slate-600 font-mono text-[11px]">
                          {kpi.target}
                        </td>
                        <td className="px-3 py-3 font-bold font-mono text-[11px]">
                          <span
                            className={
                              isPassed ? "text-emerald-700" : "text-amber-700"
                            }
                          >
                            {kpi.current}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                            style={
                              isPassed
                                ? {
                                    background: "var(--success-light)",
                                    color: "var(--success)",
                                    border: "1px solid #bbf7d0",
                                  }
                                : {
                                    background: "var(--warning-light)",
                                    color: "var(--warning)",
                                    border: "1px solid #fde68a",
                                  }
                            }
                          >
                            {isPassed ? (
                              <>
                                <Check size={10} strokeWidth={3} /> PASSED
                              </>
                            ) : (
                              <>
                                <AlertTriangle size={10} /> ATTENTION
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {kpi.proofFile ? (
                            <button
                              onClick={() =>
                                setTrace(
                                  kpiTrace(
                                    kpi.name,
                                    kpi.proofFile || "Telemetry_Proof.pdf",
                                    kpi.current
                                  )
                                )
                              }
                              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 hover:underline"
                            >
                              <Eye size={11} /> Trace
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* KPI Telemetry Footer */}
            <div
              className="px-4 py-2.5 bg-slate-50 border-t flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1.5"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Automated benchmark telemetry cryptographically hashed in Evidence Locker</span>
              </div>
              <Link
                href="/evidence"
                className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1"
              >
                Evidence Locker <ArrowRight size={10} />
              </Link>
            </div>
          </div>

          {/* Pilot Objectives & Scope Summary */}
          <div
            className="rounded border bg-white p-4 shadow-sm"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              PILOT SCOPE & TECHNICAL OBJECTIVES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Sandbox Boundary</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Isolated to designated municipal routes; zero direct dependency on production government IT core.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Milestone Milestone Gate</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Release of next financial tranche tied directly to verification of 60-day telemetry milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: EVIDENCE & NEXT ACTION (5 COLS) ───── */}
        <div className="lg:col-span-5 space-y-4">
          {/* EVIDENCE SECTION */}
          <div
            className="rounded border bg-white shadow-sm overflow-hidden"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="px-4 py-3 border-b flex items-center justify-between bg-slate-50"
              style={{ borderColor: "var(--line)" }}
            >
              <div className="flex items-center gap-2">
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--gov-navy)" }}
                >
                  EVIDENCE
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                  {currentCase.evidence.filter((e) => e.status === "Verified").length} / {currentCase.evidence.length} Verified
                </span>
              </div>
              <Link
                href="/evidence"
                className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold"
              >
                View Locker →
              </Link>
            </div>

            {/* Evidence List */}
            <div className="divide-y divide-slate-100 text-xs">
              {currentCase.evidence.map((item) => {
                const isVerified = item.status === "Verified";
                const isSubmitted = item.status === "Submitted";
                const isPending = item.status === "Pending";
                const isRequired = item.status === "Required";

                return (
                  <div
                    key={item.id}
                    className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 truncate">
                          {item.name}
                        </p>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0"
                          style={
                            item.category === "Security"
                              ? { background: "var(--warning-light)", color: "var(--warning)" }
                              : item.category === "Technical"
                              ? { background: "#eff6ff", color: "#1d4ed8" }
                              : { background: "#f1f5f9", color: "#475569" }
                          }
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.uploader} · {item.date}
                      </p>
                    </div>

                    {/* Status Pill & Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"
                        style={
                          isVerified
                            ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
                            : isSubmitted
                            ? { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }
                            : isPending
                            ? { background: "var(--warning-light)", color: "var(--warning)", border: "1px solid #fde68a" }
                            : { background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }
                        }
                      >
                        {isVerified && <Check size={10} strokeWidth={3} />}
                        {isPending && <AlertTriangle size={10} />}
                        {isRequired && "○"}
                        {item.status}
                      </span>

                      <button
                        onClick={() => handleViewEvidence(item)}
                        className="h-7 px-2 text-[11px] font-semibold text-slate-600 hover:text-blue-700 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        title="View Evidence Details"
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEXT ACTION CARD */}
          <div
            className="rounded border p-4 shadow-sm relative overflow-hidden"
            style={{
              borderColor: currentCase.outcome ? "#bbf7d0" : "#fde68a",
              background: currentCase.outcome ? "var(--success-light)" : "var(--warning-light)",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                style={
                  currentCase.outcome
                    ? { background: "var(--success)", color: "#ffffff" }
                    : { background: "var(--warning)", color: "#ffffff" }
                }
              >
                NEXT ACTION
              </span>
              <span className="text-[10px] font-semibold text-slate-600">
                Action Required
              </span>
            </div>

            <h3
              className="text-sm font-bold mt-1"
              style={{ color: currentCase.outcome ? "var(--success)" : "var(--ink)" }}
            >
              {currentCase.nextActionText}
            </h3>

            <p className="text-xs text-slate-700 mt-1 leading-relaxed">
              {currentCase.nextActionSubtext}
            </p>

            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
              <button
                onClick={() => setShowNextActionModal(true)}
                className="px-3.5 py-2 rounded text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity inline-flex items-center gap-1.5"
                style={{
                  background: currentCase.outcome ? "var(--success)" : "var(--gov-navy)",
                }}
              >
                {currentCase.nextActionButtonLabel}
              </button>

              <span className="text-[10px] text-slate-500 italic">
                Officer authorization required
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              7. PILOT OUTCOME (ONLY WHEN APPLICABLE)
              ═══════════════════════════════════════════════════════════ */}
          {currentCase.outcome ? (
            <div
              className="rounded border p-4 shadow-sm"
              style={{
                background: "var(--success-light)",
                borderColor: "#86efac",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  PILOT OUTCOME DETERMINATION
                </p>
              </div>

              <div className="p-3 rounded bg-white border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800">
                    {currentCase.outcome.determination}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {currentCase.outcome.decisionNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {currentCase.outcome.summary}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Authorized by: {currentCase.outcome.authority}</span>
                  <span>{currentCase.outcome.date}</span>
                </div>
              </div>

              <Link
                href="/readiness"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded py-2 text-xs font-bold text-white shadow-sm"
                style={{ background: "var(--gov-navy)" }}
              >
                Proceed to Readiness & Decisions <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div
              className="rounded border p-3 bg-slate-50 text-[11px] text-slate-500 flex items-start gap-2"
              style={{ borderColor: "var(--line)" }}
            >
              <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <span>
                <strong>Outcome Determination Notice:</strong> Factual pilot outcome will be unlocked upon conclusion of the 90-day Data Collection cycle and Government Review.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: EVIDENCE DETAIL & CRYPTOGRAPHIC HASH
          ═══════════════════════════════════════════════════════════ */}
      {showEvidenceModal && selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-lg bg-white shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between text-white"
              style={{ background: "var(--gov-navy)" }}
            >
              <div className="flex items-center gap-2">
                <FileCheck2 size={16} />
                <h3 className="text-sm font-bold">Evidence Record Details</h3>
              </div>
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">
                    {selectedEvidence.id}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={
                      selectedEvidence.status === "Verified"
                        ? { background: "var(--success-light)", color: "var(--success)" }
                        : { background: "var(--warning-light)", color: "var(--warning)" }
                    }
                  >
                    {selectedEvidence.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedEvidence.name}
                </h4>
              </div>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-slate-800">{selectedEvidence.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted By:</span>
                  <span className="font-semibold text-slate-800">{selectedEvidence.uploader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submission Date:</span>
                  <span className="font-semibold text-slate-800">{selectedEvidence.date}</span>
                </div>
                {selectedEvidence.confidence && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification Confidence:</span>
                    <span className="font-bold text-emerald-700">{selectedEvidence.confidence}</span>
                  </div>
                )}
              </div>

              {/* Cryptographic SHA-256 Hash */}
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                  SHA-256 Cryptographic Hash
                </p>
                <div className="p-2 rounded font-mono text-[10px] bg-slate-900 text-emerald-400 break-all select-all flex items-center justify-between">
                  <span>{selectedEvidence.hash}</span>
                  <Hash size={12} className="text-slate-500 shrink-0 ml-2" />
                </div>
              </div>

              {/* Verification Notes */}
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                  Evaluator Verification Notes
                </p>
                <p className="text-slate-700 p-2.5 rounded bg-slate-50 border border-slate-200 leading-relaxed">
                  {selectedEvidence.verificationNote}
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white"
              >
                Close
              </button>
              <Link
                href="/evidence"
                className="px-3.5 py-1.5 rounded text-xs font-bold text-white shadow-sm"
                style={{ background: "var(--gov-navy)" }}
              >
                Open Evidence Locker →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL: NEXT ACTION EXECUTION WORKFLOW
          ═══════════════════════════════════════════════════════════ */}
      {showNextActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-lg bg-white shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{ borderColor: "var(--line)" }}
          >
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between text-white"
              style={{ background: "var(--gov-navy)" }}
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                <h3 className="text-sm font-bold">Pilot Action Dispatch</h3>
              </div>
              <button
                onClick={() => setShowNextActionModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <p className="font-bold text-slate-900 text-sm">
                {currentCase.nextActionText}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {currentCase.nextActionSubtext}
              </p>

              <div className="p-3 rounded bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                <p className="font-bold">Government Governance Gate</p>
                <p className="text-[11px] text-blue-800">
                  Notifying the designated pilot evaluator and startup point of contact will record an official reminder in the PRAMAN Audit Trail.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t flex justify-end gap-2">
              <button
                onClick={() => setShowNextActionModal(false)}
                className="px-3.5 py-1.5 rounded text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNextActionModal(false);
                  setActionSuccessMsg(
                    `Action request dispatched to ${currentCase.startup} & Evaluator. Recorded in Audit Log.`
                  );
                }}
                className="px-3.5 py-1.5 rounded text-xs font-bold text-white shadow-sm"
                style={{ background: "var(--gov-navy)" }}
              >
                Dispatch Official Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
