"use client";

import React, { useState, useMemo } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Gauge, TrendingUp, ShieldAlert, CheckCircle2, AlertTriangle,
  Building2, MapPin, CalendarDays, Wallet, ArrowRight, Check,
  Clock, Lock, FileText, ChevronRight, ExternalLink, ShieldCheck,
  Send, X, RotateCcw, Search, SlidersHorizontal, Info, Eye,
  Layers, FileCheck, ArrowUpRight, CheckCircle
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   MULTI-CASE PROCUREMENT & READINESS DATASET
   ═══════════════════════════════════════════════════════════════ */

type CaseReadinessData = {
  id: string;
  title: string;
  department: string;
  location: string;
  timeline: string;
  budget: string;
  status: "In Progress" | "Pending Approval" | "Completed";
  currentStage: string;
  financialYear: string;
  readinessScore: number;
  readinessBand: "High Readiness" | "Moderate Readiness" | "Action Required";
  evidencePct: number;
  evidenceItems: string;
  nextMilestoneAmount: string;
  nextMilestoneName: string;
  nextMilestoneStatus: string;
  activeBlockerCount: number;
  blockerTitle: string;
  blockerProgress: string;
  blockerDesc: string;
  dimensions: {
    name: string;
    score: number;
    max: number;
    status: "pass" | "attention" | "blocker";
    desc: string;
  }[];
  financialPlan: {
    name: string;
    amount: string;
    status: "Completed" | "Released" | "Pending Approval" | "Locked";
  }[];
  handoffReadyCount: number;
  handoffTotalCount: number;
  handoffItems: { name: string; ready: boolean }[];
  scaleOpportunities: number;
};

const CASES_DATA: CaseReadinessData[] = [
  {
    id: "PRB-MH-2026-1042",
    title: "Smart Road Condition Monitoring using public transport telemetry",
    department: "PWD Maharashtra",
    location: "Pune",
    timeline: "90 Days",
    budget: "₹1.00 Cr",
    status: "In Progress",
    currentStage: "READINESS & DECISIONS",
    financialYear: "FY 2026–27",
    readinessScore: 91,
    readinessBand: "High Readiness",
    evidencePct: 94,
    evidenceItems: "17 / 18 items",
    nextMilestoneAmount: "₹15L",
    nextMilestoneName: "Mid-Pilot Evaluation",
    nextMilestoneStatus: "Pending Approval",
    activeBlockerCount: 1,
    blockerTitle: "Security questionnaire incomplete",
    blockerProgress: "80% complete",
    blockerDesc: "Complete the required security review & CERT-In cyber audit before final procurement decision.",
    dimensions: [
      { name: "Technical Validation", score: 20, max: 20, status: "pass", desc: "Detection accuracy (88.4%) exceeds ≥85% KPI threshold" },
      { name: "Pilot Performance", score: 19, max: 20, status: "pass", desc: "45 municipal buses streaming telemetry across Pune routes" },
      { name: "Evidence Completeness", score: 18, max: 20, status: "pass", desc: "17 cryptographic evidence records verified in Locker" },
      { name: "Compliance", score: 15, max: 15, status: "pass", desc: "DPIIT active entity + regulatory and ethics approvals cleared" },
      { name: "Budget Alignment", score: 10, max: 10, status: "pass", desc: "Financial utilization aligned within approved ₹1.00 Cr cap" },
      { name: "Security & Data", score: 9, max: 15, status: "attention", desc: "CERT-In questionnaire 80% complete; awaiting final certificate" },
    ],
    financialPlan: [
      { name: "Requirement Approval", amount: "₹0", status: "Completed" },
      { name: "Pilot Initiation", amount: "₹10L", status: "Released" },
      { name: "Mid-Pilot Evaluation", amount: "₹15L", status: "Pending Approval" },
      { name: "KPI Validation", amount: "₹15L", status: "Locked" },
    ],
    handoffReadyCount: 6,
    handoffTotalCount: 7,
    handoffItems: [
      { name: "Structured Requirement", ready: true },
      { name: "Startup Evaluation & Matching", ready: true },
      { name: "Pilot Telemetry Evidence", ready: true },
      { name: "Regulatory & Legal Compliance", ready: true },
      { name: "Financial Milestone Plan", ready: true },
      { name: "Departmental Cost Benefit Analysis", ready: true },
      { name: "Security & CERT-In Certification", ready: false },
    ],
    scaleOpportunities: 3,
  },
  {
    id: "PRB-MH-2026-1043",
    title: "Urban Water Leakage & Distribution Network Telemetry",
    department: "Mumbai Municipal Corporation",
    location: "Mumbai Suburban",
    timeline: "120 Days",
    budget: "₹1.50 Cr",
    status: "Pending Approval",
    currentStage: "REQUIREMENT & PILOT INTAKE",
    financialYear: "FY 2026–27",
    readinessScore: 68,
    readinessBand: "Moderate Readiness",
    evidencePct: 62,
    evidenceItems: "8 / 13 items",
    nextMilestoneAmount: "₹25L",
    nextMilestoneName: "Acoustic Sensor Deployment",
    nextMilestoneStatus: "Pending Approval",
    activeBlockerCount: 2,
    blockerTitle: "Hydraulic GIS map integration pending",
    blockerProgress: "55% complete",
    blockerDesc: "Hydraulic SCADA telemetry maps must be uploaded to the Evidence Locker before pilot release.",
    dimensions: [
      { name: "Technical Validation", score: 14, max: 20, status: "attention", desc: "Acoustic sensor accuracy bench test logged" },
      { name: "Pilot Performance", score: 12, max: 20, status: "attention", desc: "Zone 1 deployment awaiting water engineer sign-off" },
      { name: "Evidence Completeness", score: 13, max: 20, status: "attention", desc: "8 supporting documentation proofs filed" },
      { name: "Compliance", score: 15, max: 15, status: "pass", desc: "Municipal procurement clearance approved" },
      { name: "Budget Alignment", score: 8, max: 10, status: "pass", desc: "Estimated pilot cost ₹25L within ₹1.5 Cr envelope" },
      { name: "Security & Data", score: 6, max: 15, status: "blocker", desc: "SCADA network isolation review incomplete" },
    ],
    financialPlan: [
      { name: "Feasibility Sign-off", amount: "₹0", status: "Completed" },
      { name: "Acoustic Sensor Pods", amount: "₹25L", status: "Pending Approval" },
      { name: "Leak Localization Benchmark", amount: "₹35L", status: "Locked" },
      { name: "City-wide Pipeline Contract", amount: "₹60L", status: "Locked" },
    ],
    handoffReadyCount: 4,
    handoffTotalCount: 7,
    handoffItems: [
      { name: "Structured Requirement", ready: true },
      { name: "Startup Evaluation & Matching", ready: true },
      { name: "Pilot Telemetry Evidence", ready: false },
      { name: "Regulatory & Legal Compliance", ready: true },
      { name: "Financial Milestone Plan", ready: true },
      { name: "Departmental Cost Benefit Analysis", ready: false },
      { name: "Security & CERT-In Certification", ready: false },
    ],
    scaleOpportunities: 1,
  },
  {
    id: "PRB-MH-2026-1044",
    title: "IoT Smart Waste Logistics & Dynamic Bin Level Optimization",
    department: "Nashik Municipal Corporation",
    location: "Nashik City",
    timeline: "60 Days",
    budget: "₹80 Lakh",
    status: "In Progress",
    currentStage: "PILOT & EVIDENCE REVIEW",
    financialYear: "FY 2025–26",
    readinessScore: 84,
    readinessBand: "High Readiness",
    evidencePct: 88,
    evidenceItems: "14 / 16 items",
    nextMilestoneAmount: "₹20L",
    nextMilestoneName: "Fuel Efficiency Validation",
    nextMilestoneStatus: "Pending Approval",
    activeBlockerCount: 1,
    blockerTitle: "Sanitation vehicle GPS log verification",
    blockerProgress: "75% complete",
    blockerDesc: "Awaiting final 30-day fuel log verification from Sanitation Chief Inspector.",
    dimensions: [
      { name: "Technical Validation", score: 18, max: 20, status: "pass", desc: "Ultrasonic sensor pods operating at 99.2% uptime" },
      { name: "Pilot Performance", score: 17, max: 20, status: "pass", desc: "250 community bins monitored in Wards 4 & 7" },
      { name: "Evidence Completeness", score: 17, max: 20, status: "pass", desc: "14 verified dataset uploads in Locker" },
      { name: "Compliance", score: 15, max: 15, status: "pass", desc: "Sanitation council sanction order approved" },
      { name: "Budget Alignment", score: 10, max: 10, status: "pass", desc: "Spend tracking within ₹80L allocation" },
      { name: "Security & Data", score: 7, max: 15, status: "attention", desc: "Cloud endpoint data encryption verification in progress" },
    ],
    financialPlan: [
      { name: "Ward Assessment Sign-off", amount: "₹0", status: "Completed" },
      { name: "Sensor Pod Deployment", amount: "₹15L", status: "Released" },
      { name: "Route Efficiency Review", amount: "₹20L", status: "Pending Approval" },
      { name: "City-wide Rollout", amount: "₹30L", status: "Locked" },
    ],
    handoffReadyCount: 5,
    handoffTotalCount: 7,
    handoffItems: [
      { name: "Structured Requirement", ready: true },
      { name: "Startup Evaluation & Matching", ready: true },
      { name: "Pilot Telemetry Evidence", ready: true },
      { name: "Regulatory & Legal Compliance", ready: true },
      { name: "Financial Milestone Plan", ready: true },
      { name: "Departmental Cost Benefit Analysis", ready: false },
      { name: "Security & CERT-In Certification", ready: false },
    ],
    scaleOpportunities: 2,
  },
  {
    id: "PRB-MH-2026-1045",
    title: "AI-Assisted Telemedicine Triage for Rural Primary Health Centers",
    department: "Health & Family Welfare",
    location: "Nagpur",
    timeline: "180 Days",
    budget: "₹2.20 Cr",
    status: "In Progress",
    currentStage: "PILOT EVALUATION & READINESS",
    financialYear: "FY 2026–27",
    readinessScore: 89,
    readinessBand: "High Readiness",
    evidencePct: 91,
    evidenceItems: "21 / 23 items",
    nextMilestoneAmount: "₹50L",
    nextMilestoneName: "Mid-Term Triage Accuracy",
    nextMilestoneStatus: "Pending Approval",
    activeBlockerCount: 1,
    blockerTitle: "EHR Patient Data Residency Audit",
    blockerProgress: "85% complete",
    blockerDesc: "Verify encryption keys and DISHA compliance for rural tele-consultation archives.",
    dimensions: [
      { name: "Technical Validation", score: 19, max: 20, status: "pass", desc: "Clinical concordancy validated at 92.4% across 5,000 consults" },
      { name: "Pilot Performance", score: 19, max: 20, status: "pass", desc: "20 rural PHC diagnostic stations streaming telemetry" },
      { name: "Evidence Completeness", score: 18, max: 20, status: "pass", desc: "Blinded district medical officer audit logs logged" },
      { name: "Compliance", score: 15, max: 15, status: "pass", desc: "State Ethics Board and ICMR clearance approved" },
      { name: "Budget Alignment", score: 10, max: 10, status: "pass", desc: "Co-funded with National Health Mission" },
      { name: "Security & Data", score: 8, max: 15, status: "attention", desc: "DISHA patient data residency self-audit complete" },
    ],
    financialPlan: [
      { name: "Ethics Protocol Clearance", amount: "₹0", status: "Completed" },
      { name: "Diagnostic Hub Setup", amount: "₹40L", status: "Released" },
      { name: "Mid-Term Triage Review", amount: "₹50L", status: "Pending Approval" },
      { name: "Clinical Safety Audit", amount: "₹30L", status: "Locked" },
    ],
    handoffReadyCount: 6,
    handoffTotalCount: 7,
    handoffItems: [
      { name: "Structured Requirement", ready: true },
      { name: "Startup Evaluation & Matching", ready: true },
      { name: "Pilot Telemetry Evidence", ready: true },
      { name: "Regulatory & Legal Compliance", ready: true },
      { name: "Financial Milestone Plan", ready: true },
      { name: "Departmental Cost Benefit Analysis", ready: true },
      { name: "Security & CERT-In Certification", ready: false },
    ],
    scaleOpportunities: 4,
  },
];

export default function ReadinessPage() {
  const {
    pilot, readiness, calculateReadiness, submitDecision,
    decisionReason, setDecisionReason, decision, loading, error, setTrace
  } = usePraman();

  // Selected Case State
  const [selectedCaseId, setSelectedCaseId] = useState<string>("PRB-MH-2026-1042");
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedFY, setSelectedFY] = useState<string>("All Years");

  // Modals & User Actions
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [selectedDecisionAction, setSelectedDecisionAction] = useState<string>("Proceed to Procurement Review");
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [evidenceRequestModalOpen, setEvidenceRequestModalOpen] = useState(false);
  const [decisionSuccessToast, setDecisionSuccessToast] = useState(false);
  const [evidenceSentToast, setEvidenceSentToast] = useState(false);

  // Filtered cases list
  const filteredCases = useMemo(() => {
    return CASES_DATA.filter((c) => {
      const matchDept = selectedDept === "All Departments" || c.department === selectedDept;
      const matchStatus = selectedStatus === "All Statuses" || c.status === selectedStatus;
      const matchFY = selectedFY === "All Years" || c.financialYear === selectedFY;
      return matchDept && matchStatus && matchFY;
    });
  }, [selectedDept, selectedStatus, selectedFY]);

  // Current active case data
  const activeCase = useMemo(() => {
    const found = filteredCases.find((c) => c.id === selectedCaseId);
    if (found) return found;
    return filteredCases[0] || CASES_DATA[0];
  }, [filteredCases, selectedCaseId]);

  // If live readiness context is available for PRB-MH-2026-1042, blend it safely
  const currentReadinessScore =
    activeCase.id === "PRB-MH-2026-1042" && readiness?.score ? readiness.score : activeCase.readinessScore;
  const currentReadinessBand =
    activeCase.id === "PRB-MH-2026-1042" && readiness?.band ? readiness.band : activeCase.readinessBand;

  // Handle Decision Confirmation
  const handleConfirmDecision = async () => {
    setDecisionModalOpen(false);
    await submitDecision();
    setDecisionSuccessToast(true);
    setTimeout(() => setDecisionSuccessToast(false), 5000);
  };

  const handleSendEvidenceRequest = () => {
    setEvidenceRequestModalOpen(false);
    setEvidenceSentToast(true);
    setTimeout(() => setEvidenceSentToast(false), 4500);
  };

  const handleResetFilters = () => {
    setSelectedDept("All Departments");
    setSelectedStatus("All Statuses");
    setSelectedFY("All Years");
    setSelectedCaseId("PRB-MH-2026-1042");
  };

  return (
    <div className="space-y-4 max-w-[1450px] mx-auto min-w-0 pb-12">
      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER & COMPACT CASE FILTER BAR
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D9E1EA] pb-3 bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B2A5B] bg-[#EEF5FC] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
              DECISION
            </span>
            <span className="text-[10px] font-semibold text-[#5E6B7E]">
              Procurement Readiness Gate v1.2
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-[#172033] tracking-tight">
            Procurement Readiness & Decision Gate
          </h1>
          <p className="text-xs text-[#5E6B7E]">
            Evidence-based readiness assessment before authorized government decision.
          </p>
        </div>

        {/* Compact Right Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Case Selector */}
          <select
            value={activeCase.id}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="p-1.5 px-2.5 text-xs font-bold text-[#0B2A5B] bg-[#EFF6FF] border border-[#BFDBFE] rounded focus:outline-none focus:ring-1 focus:ring-[#0B2A5B] cursor-pointer"
          >
            {filteredCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} — {c.title.slice(0, 28)}...
              </option>
            ))}
          </select>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-1.5 px-2 text-xs rounded border border-[#D9E1EA] bg-[#F8FAFC] text-[#172033] focus:outline-none"
          >
            <option value="All Departments">All Depts</option>
            <option value="PWD Maharashtra">PWD Maharashtra</option>
            <option value="Mumbai Municipal Corporation">Mumbai Municipal</option>
            <option value="Nashik Municipal Corporation">Nashik Municipal</option>
            <option value="Health & Family Welfare">Health & FW</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 px-2 text-xs rounded border border-[#D9E1EA] bg-[#F8FAFC] text-[#172033] focus:outline-none"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending Approval">Pending</option>
          </select>

          <button
            onClick={handleResetFilters}
            title="Reset Filters"
            className="p-1.5 rounded bg-white hover:bg-slate-100 border border-[#D9E1EA] text-[#5E6B7E]"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}

      {/* Notifications */}
      {decisionSuccessToast && (
        <div className="flex items-center gap-2.5 rounded-lg p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] border-l-4 border-l-[#16834B] text-xs text-[#166534] font-bold shadow-sm">
          <CheckCircle2 size={16} className="text-[#16834B] shrink-0" />
          <span>Decision Recorded: Case transitioned to Procurement Review in the immutable audit ledger.</span>
        </div>
      )}

      {evidenceSentToast && (
        <div className="flex items-center gap-2.5 rounded-lg p-3 bg-[#EFF6FF] border border-[#BFDBFE] border-l-4 border-l-[#1D4ED8] text-xs text-[#1E40AF] font-bold shadow-sm">
          <CheckCircle2 size={16} className="text-[#1D4ED8] shrink-0" />
          <span>Formal evidence remediation notice issued to the startup entity via Evidence Locker.</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. SELECTED CASE CARD (Compact Horizontal)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5E6B7E]">
                SELECTED CASE
              </span>
              <span className="font-mono text-xs font-black text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {activeCase.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]">
                {activeCase.status.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                {activeCase.currentStage}
              </span>
            </div>

            <h2 className="text-sm font-bold text-[#172033]">
              {activeCase.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-[#5E6B7E]">
              <span><strong>Department:</strong> {activeCase.department}</span>
              <span><strong>Location:</strong> {activeCase.location}</span>
              <span><strong>Duration:</strong> {activeCase.timeline}</span>
              <span><strong>Budget:</strong> {activeCase.budget}</span>
            </div>
          </div>

          <Link
            href="/pilots"
            className="self-start md:self-center inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-3 py-1.5 rounded border border-[#BFDBFE] transition-colors shrink-0"
          >
            <span>View Case Details</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. PRAMAN LIFECYCLE (Compact Horizontal)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[#172033]">
          <Layers size={14} className="text-[#0B2A5B]" />
          <span className="text-[11px] uppercase tracking-wider text-[#5E6B7E]">Lifecycle:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#16834B] px-2 py-0.5 rounded border border-[#BBF7D0]">
            <Check size={11} /> Requirement
          </span>
          <ChevronRight size={12} className="text-[#CBD5E1]" />
          <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#16834B] px-2 py-0.5 rounded border border-[#BBF7D0]">
            <Check size={11} /> Startup Matching
          </span>
          <ChevronRight size={12} className="text-[#CBD5E1]" />
          <span className="flex items-center gap-1 bg-[#DCFCE7] text-[#16834B] px-2 py-0.5 rounded border border-[#BBF7D0]">
            <Check size={11} /> Pilot & Evidence
          </span>
          <ChevronRight size={12} className="text-[#CBD5E1]" />
          <span className="flex items-center gap-1 bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded border border-[#FDE68A]">
            <Clock size={11} /> Financial Milestones ●
          </span>
          <ChevronRight size={12} className="text-[#CBD5E1]" />
          <span className="flex items-center gap-1 bg-[#0B2A5B] text-white px-2 py-0.5 rounded shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Readiness & Decisions ●
          </span>
          <ChevronRight size={12} className="text-[#CBD5E1]" />
          <span className="flex items-center gap-1 bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded border border-[#CBD5E1]">
            <Lock size={10} /> Procurement ○
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          4. TOP FOUR SUMMARY CARDS
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* CARD 1: READINESS SCORE */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#0B2A5B] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">READINESS SCORE</span>
            <Gauge size={16} className="text-[#0B2A5B]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-[#0B2A5B]">{currentReadinessScore}</span>
              <span className="text-xs font-bold text-[#64748B]">/ 100</span>
            </div>
            <p className="text-[10px] font-bold text-[#16834B] mt-0.5">{currentReadinessBand}</p>
          </div>
        </div>

        {/* CARD 2: EVIDENCE */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#16834B] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">EVIDENCE</span>
            <CheckCircle2 size={16} className="text-[#16834B]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#16834B]">{activeCase.evidencePct}%</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#16834B]">Verified</span>
            </div>
            <p className="text-[10px] text-[#5E6B7E] mt-0.5">{activeCase.evidenceItems}</p>
          </div>
        </div>

        {/* CARD 3: NEXT MILESTONE */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#D97706] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">NEXT MILESTONE</span>
            <Wallet size={16} className="text-[#D97706]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#D97706] font-mono">{activeCase.nextMilestoneAmount}</span>
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.2 rounded">Pending</span>
            </div>
            <p className="text-[10px] text-[#5E6B7E] mt-0.5">{activeCase.nextMilestoneName}</p>
          </div>
        </div>

        {/* CARD 4: ACTIVE BLOCKER */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#DC2626] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">ACTIVE BLOCKER</span>
            <ShieldAlert size={16} className="text-[#DC2626]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#DC2626]">{activeCase.activeBlockerCount}</span>
              <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.2 rounded">Attention</span>
            </div>
            <p className="text-[10px] text-[#5E6B7E] mt-0.5 truncate" title={activeCase.blockerTitle}>
              {activeCase.blockerTitle}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. MAIN TWO-COLUMN WORKSPACE
          LEFT: Readiness Assessment
          RIGHT: Active Blocker + Decision Gate
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
        {/* LEFT: READINESS ASSESSMENT (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#D9E1EA] rounded-lg shadow-sm p-4 space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-[#0B2A5B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                  READINESS ASSESSMENT
                </h3>
              </div>
              <button
                onClick={calculateReadiness}
                disabled={loading === "Calculating readiness"}
                className="text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-2.5 py-1 rounded border border-[#BFDBFE] transition-colors"
              >
                {loading === "Calculating readiness" ? "Assessing..." : "Recalculate Assessment"}
              </button>
            </div>

            {/* Dimensions with Clean Progress Bars */}
            <div className="space-y-3">
              {activeCase.dimensions.map((dim) => {
                const pct = Math.round((dim.score / dim.max) * 100);
                const isPass = dim.status === "pass";
                const isAttention = dim.status === "attention";
                const isBlocker = dim.status === "blocker";

                return (
                  <div key={dim.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#172033]">{dim.name}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isPass
                            ? "bg-[#DCFCE7] text-[#16834B]"
                            : isAttention
                            ? "bg-[#FEF3C7] text-[#B45309]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}>
                          {dim.score} / {dim.max} pts
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: isPass ? "#16834B" : isAttention ? "#D97706" : "#DC2626"
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-[#5E6B7E] leading-tight">{dim.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#D9E1EA] flex items-center justify-between text-[10px] text-[#5E6B7E]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#16834B]" /> Complete / Pass</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D97706]" /> Attention Required</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DC2626]" /> Active Blocker</span>
            </div>
            <button
              onClick={() => setTrace(kpiTrace("Procurement Readiness Assessment", "PRAMAN Readiness Engine", `${currentReadinessScore}/100`))}
              className="font-bold text-[#0B2A5B] hover:underline"
            >
              Inspect Trace →
            </button>
          </div>
        </div>

        {/* RIGHT: ACTIVE BLOCKER & DECISION GATE (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* CARD A: ACTIVE BLOCKER */}
          <div className="bg-white border border-[#FDE68A] bg-[#FFFDF5] rounded-lg p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#B45309]">
                <ShieldAlert size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  ACTIVE BLOCKER
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
                {activeCase.blockerProgress}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-[#78350F]">{activeCase.blockerTitle}</p>
              <p className="text-[11px] text-[#92400E] mt-0.5 leading-relaxed">
                "{activeCase.blockerDesc}"
              </p>
            </div>

            <button
              onClick={() => setSecurityModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A5B] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-3 py-1.5 rounded border border-[#BFDBFE] transition-colors"
            >
              <span>Review Security & Action</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* CARD B: DECISION GATE */}
          <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#0B2A5B]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                  DECISION GATE
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                AWAITING OFFICER DECISION
              </span>
            </div>

            <p className="text-xs text-[#5E6B7E] leading-relaxed">
              Case is ready for procurement review upon completion of the outstanding security verification requirement.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedDecisionAction("Proceed to Procurement Review");
                  setDecisionModalOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded bg-[#16834B] hover:bg-[#136f3f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 size={14} />
                <span>Proceed to Procurement Review</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEvidenceRequestModalOpen(true)}
                  className="py-2 px-2.5 rounded bg-white hover:bg-slate-50 text-[#0B2A5B] font-bold text-xs border border-[#BFDBFE] flex items-center justify-center gap-1 transition-colors"
                >
                  <Send size={12} />
                  <span>Request Evidence</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedDecisionAction("Return for Remediation");
                    setDecisionModalOpen(true);
                  }}
                  className="py-2 px-2.5 rounded bg-white hover:bg-red-50 text-[#DC2626] font-bold text-xs border border-[#FECACA] flex items-center justify-center gap-1 transition-colors"
                >
                  <X size={12} />
                  <span>Remediation</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-center text-[#94A3B8] italic">
              PRAMAN provides decision support. Final procurement decisions remain with authorized government officials.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6. BOTTOM TWO-COLUMN AREA
          LEFT: Financial Milestone Plan
          RIGHT: Next Step + Procurement Handoff
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-w-0">
        {/* LEFT: FINANCIAL MILESTONE PLAN (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#D9E1EA] rounded-lg shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
            <div className="flex items-center gap-2">
              <Wallet size={15} className="text-[#0B2A5B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                FINANCIAL MILESTONE PLAN
              </h3>
            </div>
            <Link
              href="/financial-milestones"
              className="text-[11px] font-bold text-[#0B2A5B] hover:underline flex items-center gap-1"
            >
              <span>View All ({activeCase.financialPlan.length})</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table w-full text-xs">
              <thead>
                <tr>
                  <th>Milestone Name</th>
                  <th style={{ width: 100 }}>Amount</th>
                  <th style={{ width: 130 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeCase.financialPlan.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#172033]">{row.name}</td>
                    <td className="font-mono font-bold text-[#0B2A5B]">{row.amount}</td>
                    <td>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                        row.status === "Completed" || row.status === "Released"
                          ? "bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]"
                          : row.status === "Pending Approval"
                          ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                          : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
                      }`}>
                        {row.status === "Completed" || row.status === "Released" ? (
                          <Check size={10} />
                        ) : row.status === "Pending Approval" ? (
                          <Clock size={10} />
                        ) : (
                          <Lock size={10} />
                        )}
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: NEXT STEP & PROCUREMENT HANDOFF (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* NEXT STEP */}
          <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                NEXT STEP
              </span>
              <span className="text-[10px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                Action Required
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 p-1.5 rounded bg-[#FFFBEB] border border-[#FDE68A] font-bold text-[#78350F]">
                <span className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center text-[10px]">1</span>
                <span>Complete Security Review ({activeCase.blockerProgress})</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded text-[#64748B]">
                <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">2</span>
                <span>Recalculate Readiness Assessment</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded text-[#64748B]">
                <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">3</span>
                <span>Authorized Officer Decision Gate</span>
              </div>
              <div className="flex items-center gap-2 p-1.5 rounded text-[#64748B]">
                <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[10px]">4</span>
                <span>Procurement Handoff Export</span>
              </div>
            </div>

            <button
              onClick={() => setSecurityModalOpen(true)}
              className="w-full py-1.5 rounded bg-[#EEF5FC] hover:bg-[#DBEAFE] text-[#0B2A5B] font-bold text-xs border border-[#BFDBFE] transition-colors"
            >
              View Security Details →
            </button>
          </div>

          {/* PROCUREMENT HANDOFF & SCALE BANNER */}
          <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#172033]">
                PROCUREMENT HANDOFF ({activeCase.handoffReadyCount} / {activeCase.handoffTotalCount} Ready)
              </span>
              <Link
                href="/handoff"
                className="text-[11px] font-bold text-[#0B2A5B] hover:underline flex items-center gap-0.5"
              >
                <span>Handoff Pack</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {activeCase.handoffItems.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 truncate">
                  {item.ready ? (
                    <CheckCircle2 size={12} className="text-[#16834B] shrink-0" />
                  ) : (
                    <Clock size={12} className="text-[#D97706] shrink-0" />
                  )}
                  <span className={item.ready ? "text-[#172033]" : "text-[#B45309] font-bold"}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D9E1EA] flex items-center justify-between text-[11px]">
              <span className="text-[#5E6B7E]">
                Scale Opportunities: <strong>{activeCase.scaleOpportunities}</strong>
              </span>
              <Link href="/scale" className="font-bold text-[#0B2A5B] hover:underline">
                View Scale & Reuse →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: OFFICER DECISION CONFIRMATION
          ═══════════════════════════════════════════════════════════ */}
      {decisionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDecisionModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Officer Decision Gate
                </span>
                <h3 className="text-sm font-bold">
                  Confirm Decision: {selectedDecisionAction}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] space-y-1.5">
                <span className="text-[#5E6B7E]">Target Procurement Case:</span>
                <p className="font-bold text-[#172033] text-sm">{activeCase.id} — {activeCase.title}</p>
                <p className="text-[11px] text-[#5E6B7E]">Readiness Score: {currentReadinessScore}/100 · Evidence: {activeCase.evidencePct}%</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#172033]">Officer Decision Justification:</label>
                <textarea
                  rows={3}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  className="w-full p-2.5 rounded border border-[#D9E1EA] text-xs focus:outline-none focus:ring-1 focus:ring-[#0B2A5B]"
                  placeholder="Record formal government justification for decision trail..."
                />
              </div>

              <div className="p-3 rounded bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Audit Record:</strong> This decision is logged in the permanent PRAMAN institutional memory and immutable governance trail.
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#5E6B7E] bg-white border border-[#D9E1EA] rounded hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className="px-4 py-2 text-xs font-bold text-white bg-[#16834B] hover:bg-[#136f3f] rounded transition-colors shadow-sm"
              >
                Submit Official Decision →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: SECURITY REVIEW DETAIL
          ═══════════════════════════════════════════════════════════ */}
      {securityModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSecurityModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Compliance Inspection
                </span>
                <h3 className="text-sm font-bold">
                  Security Questionnaire & Audit Review
                </h3>
              </div>
              <button
                onClick={() => setSecurityModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded bg-[#FEF3C7] border border-[#FDE68A] space-y-1">
                <p className="font-bold text-[#78350F]">Status: 80% Complete · Pending CERT-In Audit Clearance</p>
                <p className="text-[11px] text-[#92400E]">
                  Entity has completed 16 of 20 mandatory cybersecurity risk controls. Final certificate upload pending.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-[#172033]">Security Control Verification Checklist:</span>
                <div className="divide-y divide-[#E2E8F0] border border-[#D9E1EA] rounded-md overflow-hidden">
                  <div className="p-2.5 bg-white flex items-center justify-between">
                    <span className="text-[#172033]">End-to-end AES-256 Telemetry Encryption</span>
                    <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <div className="p-2.5 bg-white flex items-center justify-between">
                    <span className="text-[#172033]">India Sovereign Data Residency (Mumbai AWS/NIC)</span>
                    <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <div className="p-2.5 bg-white flex items-center justify-between">
                    <span className="text-[#172033]">Role-Based MFA & API Gateway Isolation</span>
                    <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded">PASSED</span>
                  </div>
                  <div className="p-2.5 bg-white flex items-center justify-between">
                    <span className="text-[#172033]">Third-Party CERT-In Penetration Test Certificate</span>
                    <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded">PENDING AUDIT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setSecurityModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#5E6B7E] bg-white border border-[#D9E1EA] rounded hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSecurityModalOpen(false);
                  setEvidenceRequestModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#061727] rounded"
              >
                Request Audit Upload →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 3: EVIDENCE REMEDIATION REQUEST
          ═══════════════════════════════════════════════════════════ */}
      {evidenceRequestModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEvidenceRequestModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Remediation Gate
                </span>
                <h3 className="text-sm font-bold">Request Evidence from Startup</h3>
              </div>
              <button
                onClick={() => setEvidenceRequestModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-[#5E6B7E]">
                Issue a formal compliance notice to the startup entity requesting missing CERT-In audit certification or telemetry clarifications.
              </p>
              <div className="space-y-1">
                <label className="font-bold text-[#172033]">Required Remediation Items:</label>
                <textarea
                  rows={3}
                  defaultValue="Please submit final third-party CERT-In cyber audit certification and telemetry latency verification report for the municipal bus deployment."
                  className="w-full p-2.5 rounded border border-[#D9E1EA] text-xs focus:outline-none focus:ring-1 focus:ring-[#0B2A5B]"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setEvidenceRequestModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#5E6B7E] bg-white border border-[#D9E1EA] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEvidenceRequest}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#061727] rounded"
              >
                Send Formal Request →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
