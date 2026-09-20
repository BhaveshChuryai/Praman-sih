"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel } from "@/components/ui";
import {
  Wallet, CheckCircle2, Clock, Lock, ChevronRight, ArrowRight,
  FileCheck2, Eye, AlertTriangle, Shield, Building2, MapPin,
  CalendarDays, X, Landmark, Target, TrendingUp, Check,
  Layers, ShieldAlert, Sparkles, AlertCircle, ArrowUpRight,
  Download, Filter, RotateCcw, BarChart3, PieChart as PieIcon,
  ShieldCheck, FileText, CheckCircle, HelpCircle, Search,
  ChevronDown, Info, ExternalLink, SlidersHorizontal, ArrowDownRight
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   TYPES & DATA MODELS
   ═══════════════════════════════════════════════════════════════ */

export type MilestoneStatus = "Completed" | "Released" | "Pending Approval" | "In Progress" | "Locked" | "Blocked";

export type Milestone = {
  id: number;
  stage: "Requirement" | "Pilot" | "Evidence" | "Procurement" | "Deployment";
  milestone: string;
  amount: number;
  trigger: string;
  status: MilestoneStatus;
  lockedReason?: string;
  prerequisites?: { name: string; status: "met" | "pending" | "missing" }[];
  conditions?: { text: string; met: boolean }[];
  evidenceCount?: number;
};

export type ProcurementCase = {
  id: string;
  title: string;
  department: string;
  location: string;
  domain: string;
  technology: string;
  timeline: string;
  financialYear: string;
  status: "In Progress" | "Pending Approval" | "Completed" | "Blocked";
  totalValue: number;
  currentStage: string;
  currentStageIndex: number;
  milestones: Milestone[];
};

/* ═══════════════════════════════════════════════════════════════
   COMPREHENSIVE MULTI-CASE DATASET
   ═══════════════════════════════════════════════════════════════ */

const PROCUREMENT_CASES: ProcurementCase[] = [
  {
    id: "PRB-MH-2026-1042",
    title: "Smart Road Condition Monitoring using public transport telemetry",
    department: "PWD Maharashtra",
    location: "Pune District",
    domain: "Urban Infrastructure",
    technology: "Computer Vision & Edge AI",
    timeline: "90 Days",
    financialYear: "FY 2026–27",
    status: "In Progress",
    totalValue: 10000000, // ₹1.00 Cr
    currentStage: "Pilot & Evidence",
    currentStageIndex: 4,
    milestones: [
      {
        id: 1,
        stage: "Requirement",
        milestone: "Requirement Approval & Pilot MoU",
        amount: 0,
        trigger: "Government approval of structured requirement & baseline agreement",
        status: "Completed",
      },
      {
        id: 2,
        stage: "Pilot",
        milestone: "Pilot Initiation & Hardware Telemetry Setup",
        amount: 1000000, // ₹10,00,000 (₹10L)
        trigger: "MoU signed & baseline telemetry active on 45 buses",
        status: "Released",
        evidenceCount: 3,
      },
      {
        id: 3,
        stage: "Pilot",
        milestone: "Mid-Pilot Evaluation (30 Days)",
        amount: 1500000, // ₹15,00,000 (₹15L)
        trigger: "30-day evaluation report + verified detection accuracy ≥85%",
        status: "Pending Approval",
        evidenceCount: 4,
        conditions: [
          { text: "Pilot telemetry streaming continuously from 45 municipal buses", met: true },
          { text: "Cryptographic Evidence Locker verified raw logs (1.4M points)", met: true },
          { text: "30-day preliminary evaluation report compiled", met: true },
          { text: "Target detection accuracy validated (≥85% against ground truth)", met: false },
          { text: "Procurement Officer formal milestone sign-off", met: false },
        ],
      },
      {
        id: 4,
        stage: "Evidence",
        milestone: "Final Pilot KPI Validation & Audit",
        amount: 1500000, // ₹15,00,000 (₹15L)
        trigger: "60-day final pilot telemetry + third-party CERT-In compliance audit",
        status: "Locked",
        lockedReason: "Mid-Pilot Evaluation (Milestone #3) has not yet been approved.",
        prerequisites: [
          { name: "30-Day Evaluation Approval", status: "pending" },
          { name: "Continuous Telemetry Feed", status: "met" },
          { name: "CERT-In Audit Clearance", status: "missing" },
        ],
      },
      {
        id: 5,
        stage: "Procurement",
        milestone: "Procurement Award & Contract Execution",
        amount: 4000000, // ₹40,00,000 (₹40L)
        trigger: "Readiness score ≥80/100 & authorized departmental procurement decision",
        status: "Locked",
        lockedReason: "Procurement Readiness & Handoff stage has not yet been completed.",
        prerequisites: [
          { name: "Technical Pilot Validation", status: "pending" },
          { name: "Procurement Readiness ≥80%", status: "missing" },
          { name: "Competent Authority Decision", status: "missing" },
        ],
      },
      {
        id: 6,
        stage: "Deployment",
        milestone: "Production Deployment & Fleet Handover",
        amount: 2000000, // ₹20,00,000 (₹20L)
        trigger: "Full fleet deployment across 500 vehicles & maintenance SLA handover",
        status: "Locked",
        lockedReason: "Procurement Award contract has not yet been executed.",
        prerequisites: [
          { name: "Commercial Contract Execution", status: "missing" },
          { name: "State Data Center Integration", status: "missing" },
        ],
      },
    ],
  },
  {
    id: "PRB-MH-2026-1043",
    title: "Urban Water Leakage & Distribution Network Telemetry",
    department: "Mumbai Municipal Corporation",
    location: "Mumbai Suburban",
    domain: "Water & Utilities",
    technology: "Acoustic IoT Sensors & GIS",
    timeline: "120 Days",
    financialYear: "FY 2026–27",
    status: "Pending Approval",
    totalValue: 15000000, // ₹1.50 Cr
    currentStage: "Requirement",
    currentStageIndex: 1,
    milestones: [
      {
        id: 1,
        stage: "Requirement",
        milestone: "Feasibility Sign-off & Zone Selection",
        amount: 0,
        trigger: "Departmental approval of pipeline network GIS maps & pilot zones",
        status: "Completed",
      },
      {
        id: 2,
        stage: "Pilot",
        milestone: "Acoustic Sensor Pod Deployment (Zone 1)",
        amount: 2500000, // ₹25L
        trigger: "Installation of 120 acoustic loggers across Bandra-Kurla pipelines",
        status: "Pending Approval",
        evidenceCount: 2,
        conditions: [
          { text: "GIS mapping of high-pressure distribution trunks completed", met: true },
          { text: "Sensor vendor eligibility clearance verified", met: true },
          { text: "Departmental water engineer site clearance", met: false },
          { text: "Procurement Officer formal initiation sign-off", met: false },
        ],
      },
      {
        id: 3,
        stage: "Evidence",
        milestone: "Leak Localization Accuracy Benchmark",
        amount: 3500000, // ₹35L
        trigger: "Non-revenue water (NRW) loss reduction verification (≥18% saved)",
        status: "Locked",
        lockedReason: "Sensor deployment milestone is awaiting initiation approval.",
        prerequisites: [
          { name: "Sensor Pod Hardware Installation", status: "pending" },
          { name: "SCADA Telemetry Integration", status: "missing" },
        ],
      },
      {
        id: 4,
        stage: "Procurement",
        milestone: "City-wide Pipeline Monitoring Contract",
        amount: 6000000, // ₹60L
        trigger: "GeM custom bid clearance & financial authorization",
        status: "Locked",
        lockedReason: "Pilot evidence and NRW benchmarks are not yet verified.",
        prerequisites: [
          { name: "Validated NRW Reduction Report", status: "missing" },
          { name: "Municipal Commissioner Approval", status: "missing" },
        ],
      },
      {
        id: 5,
        stage: "Deployment",
        milestone: "SCADA Integration & Handover",
        amount: 3000000, // ₹30L
        trigger: "Full integration with central hydraulic control room",
        status: "Locked",
        lockedReason: "Procurement award pending.",
        prerequisites: [
          { name: "Central SCADA Handover", status: "missing" },
        ],
      },
    ],
  },
  {
    id: "PRB-MH-2026-1044",
    title: "IoT Smart Waste Logistics & Dynamic Bin Level Optimization",
    department: "Nashik Municipal Corporation",
    location: "Nashik City",
    domain: "Solid Waste Management",
    technology: "Ultrasonic IoT & Route Optimization",
    timeline: "60 Days",
    financialYear: "FY 2025–26",
    status: "In Progress",
    totalValue: 8000000, // ₹80L
    currentStage: "Startup Matching",
    currentStageIndex: 3,
    milestones: [
      {
        id: 1,
        stage: "Requirement",
        milestone: "Ward Route Assessment & Requirement Freeze",
        amount: 0,
        trigger: "Sanitation department approval of 250 waste collection points",
        status: "Completed",
      },
      {
        id: 2,
        stage: "Pilot",
        milestone: "Pilot Hardware Deployment (Ward 4 & 7)",
        amount: 1500000, // ₹15L
        trigger: "Ultrasonic sensor pods installed on 250 community bins",
        status: "Released",
        evidenceCount: 3,
      },
      {
        id: 3,
        stage: "Evidence",
        milestone: "Route Fuel Efficiency & Overflow Validation",
        amount: 2000000, // ₹20L
        trigger: "Demonstrated 20% fuel savings & <2hr bin overflow response",
        status: "Pending Approval",
        evidenceCount: 3,
        conditions: [
          { text: "Bin sensor telemetry logging live (>99% uptime)", met: true },
          { text: "Dynamic vehicle dispatch integration active", met: true },
          { text: "Sanitation inspector fuel log verification", met: true },
          { text: "Zero overflow verification over 30 consecutive days", met: false },
          { text: "Municipal Officer milestone release authorization", met: false },
        ],
      },
      {
        id: 4,
        stage: "Procurement",
        milestone: "City-wide Waste Fleet Rollout",
        amount: 3000000, // ₹30L
        trigger: "Council tender sanction and GeM procurement",
        status: "Locked",
        lockedReason: "30-day fuel efficiency verification is currently pending review.",
        prerequisites: [
          { name: "Verified Fuel Savings Audit", status: "pending" },
          { name: "Nashik Sanitation Council Vote", status: "missing" },
        ],
      },
      {
        id: 5,
        stage: "Deployment",
        milestone: "Operations Command Center Handover",
        amount: 1500000, // ₹15L
        trigger: "Sanitation command dashboard operational sign-off",
        status: "Locked",
        lockedReason: "City-wide rollout contract pending.",
        prerequisites: [
          { name: "Fleet Integration", status: "missing" },
        ],
      },
    ],
  },
  {
    id: "PRB-MH-2026-1045",
    title: "Urban Air Quality Monitoring & Particulate Telemetry",
    department: "Urban Development Department",
    location: "Nagpur",
    domain: "Environment / Smart Cities",
    technology: "IoT Sensors + Data Analytics",
    timeline: "90 Days",
    financialYear: "FY 2026–27",
    status: "In Progress",
    totalValue: 9500000, // ₹95L
    currentStage: "Government Review",
    currentStageIndex: 5,
    milestones: [
      {
        id: 1,
        stage: "Requirement",
        milestone: "Air Quality Baseline & Grid Topology Approval",
        amount: 0,
        trigger: "MPCB and Urban Development approval of 50 sensor locations",
        status: "Completed",
      },
      {
        id: 2,
        stage: "Pilot",
        milestone: "Hyperlocal Sensor Pod Grid Installation (50 Pods)",
        amount: 2500000, // ₹25L
        trigger: "50 solar IoT pods deployed in Nagpur industrial & traffic zones",
        status: "Released",
        evidenceCount: 4,
      },
      {
        id: 3,
        stage: "Pilot",
        milestone: "CPCB Reference Co-Location Benchmark (30 Days)",
        amount: 3000000, // ₹30L
        trigger: "30-day co-location data showing R2 correlation ≥0.92 with reference station",
        status: "Pending Approval",
        evidenceCount: 5,
        conditions: [
          { text: "50 solar IoT sensor pods operating continuously", met: true },
          { text: "CPCB co-location telemetry log compiled (2.1M data points)", met: true },
          { text: "R2 correlation coefficient verified at 0.948 (target ≥0.92)", met: true },
          { text: "MPCB regional scientific officer review sign-off", met: true },
          { text: "Urban Development Department financial sanction release", met: false },
        ],
      },
      {
        id: 4,
        stage: "Evidence",
        milestone: "90-Day Hotspot Anomaly Telemetry Dossier",
        amount: 1500000, // ₹15L
        trigger: "Final 90-day pilot completion & pollution hotspot algorithm audit",
        status: "Locked",
        lockedReason: "Co-location benchmark review (Milestone #3) is pending.",
        prerequisites: [
          { name: "30-Day Co-Location Benchmark", status: "pending" },
          { name: "Continuous NAQI Stream Verification", status: "met" },
        ],
      },
      {
        id: 5,
        stage: "Procurement",
        milestone: "State-wide Hyperlocal Air Monitoring Rollout",
        amount: 2500000, // ₹25L
        trigger: "Final procurement approval & State Clean Air Action Plan funding",
        status: "Locked",
        lockedReason: "Final procurement decision gate pending.",
        prerequisites: [
          { name: "Full Pilot Dossier Validation", status: "missing" },
          { name: "State Clean Air Sanction", status: "missing" },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   PRAMAN 9-STAGE LIFECYCLE LABELS
   ═══════════════════════════════════════════════════════════════ */
const PRAMAN_LIFECYCLE_STEPS = [
  "Problem Intake",
  "Requirement",
  "Eligibility",
  "Startup Matching",
  "Pilot & Evidence",
  "Financial Milestones",
  "Readiness & Decisions",
  "Procurement",
  "Scale & Reuse",
];

/* ═══════════════════════════════════════════════════════════════
   CURRENCY & VALUE FORMATTERS
   ═══════════════════════════════════════════════════════════════ */
function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount === 0) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatINRLakh(amount: number): string {
  if (amount === 0) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000) * 100}L`;
  if (amount >= 100000) return `₹${amount / 100000}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getMilestoneStatusStyle(status: MilestoneStatus) {
  switch (status) {
    case "Completed":
    case "Released":
      return { bg: "#DCFCE7", border: "#BBF7D0", text: "#16834B", dot: "#16834B" };
    case "Pending Approval":
      return { bg: "#FEF3C7", border: "#FDE68A", text: "#B45309", dot: "#D97706" };
    case "In Progress":
      return { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", dot: "#2563EB" };
    case "Blocked":
      return { bg: "#FEE2E2", border: "#FECACA", text: "#DC2626", dot: "#DC2626" };
    case "Locked":
    default:
      return { bg: "#F1F5F9", border: "#CBD5E1", text: "#64748B", dot: "#94A3B8" };
  }
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM TOOLTIPS FOR RECHARTS
   ═══════════════════════════════════════════════════════════════ */
function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0F172A] text-white p-2.5 rounded shadow-lg border border-[#334155] text-xs">
        <p className="font-bold text-white mb-0.5" style={{ color: data.payload.fill || "#FFFFFF" }}>
          {data.name}
        </p>
        <p className="font-black text-sm">
          {formatINR(data.value)} ({data.payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
}

function CustomReadinessTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0F172A] text-white p-2.5 rounded shadow-lg border border-[#334155] text-xs">
        <p className="font-bold mb-0.5" style={{ color: data.payload.fill || "#FFFFFF" }}>
          {data.name}
        </p>
        <p className="font-black text-sm">
          {data.value} {data.value === 1 ? "Milestone" : "Milestones"}
        </p>
      </div>
    );
  }
  return null;
}

function CustomBarTooltip({ active, payload, label, mode }: { active?: boolean; payload?: any[]; label?: string; mode: "amount" | "percentage" }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0F172A] text-white p-2.5 rounded shadow-lg border border-[#334155] text-xs">
        <p className="font-bold text-[#93C5FD] mb-0.5">{label} Stage</p>
        <p className="font-black text-sm">
          {formatINR(data.rawAmount)} ({data.percentage}% of total plan)
        </p>
      </div>
    );
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function FinancialMilestonesPage() {
  const { selectedCaseId: contextSelectedCaseId, selectCase, approveFinancialMilestone } = usePraman();
  const [mounted, setMounted] = useState(false);
  const [allCases, setAllCases] = useState<ProcurementCase[]>(PROCUREMENT_CASES);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Filters & Case Selection State ──────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(contextSelectedCaseId || "PRB-MH-2026-1042");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedFY, setSelectedFY] = useState("All Years");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Keep selectedCaseId synchronized with contextSelectedCaseId
  useEffect(() => {
    if (contextSelectedCaseId && contextSelectedCaseId !== selectedCaseId) {
      setSelectedCaseId(contextSelectedCaseId);
    }
  }, [contextSelectedCaseId]);

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
    selectCase(caseId);
  };

  // Fund Distribution Toggle: Amount vs Percentage
  const [distributionMode, setDistributionMode] = useState<"amount" | "percentage">("amount");

  // Modals & Expandables
  const [approvalModal, setApprovalModal] = useState(false);
  const [approvalTargetMilestone, setApprovalTargetMilestone] = useState<Milestone | null>(null);
  const [approvalDone, setApprovalDone] = useState(false);
  const [approvalAction, setApprovalAction] = useState<string | null>(null);

  const [evidenceModal, setEvidenceModal] = useState(false);
  const [evidenceTargetMilestone, setEvidenceTargetMilestone] = useState<Milestone | null>(null);
  const [downloadToast, setDownloadToast] = useState(false);

  // Expandable locked milestone explanation
  const [expandedLockedId, setExpandedLockedId] = useState<number | null>(null);

  // ── Multi-Case Filtering Logic ──────────────────────────────
  const filteredCases = useMemo(() => {
    return allCases.filter((c) => {
      // Search filter (Case ID, title, or department)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q);

      // Department filter
      const matchesDept =
        selectedDepartment === "All Departments" || c.department === selectedDepartment;

      // FY filter
      const matchesFY =
        selectedFY === "All Years" || c.financialYear === selectedFY;

      // Status filter
      const matchesStatus =
        selectedStatus === "All Statuses" || c.status === selectedStatus;

      return matchesSearch && matchesDept && matchesFY && matchesStatus;
    });
  }, [allCases, searchQuery, selectedDepartment, selectedFY, selectedStatus]);

  // Keep selected case updated if filtered
  const activeCase = useMemo(() => {
    const found = filteredCases.find((c) => c.id === selectedCaseId);
    if (found) return found;
    return filteredCases[0] || allCases[0];
  }, [filteredCases, selectedCaseId, allCases]);

  // Single source of truth: Milestones of the active case
  const milestones = activeCase.milestones || [];

  // Filtered Milestones within the table based on Status Filter (if specific milestone status chosen)
  const displayedMilestones = useMemo(() => {
    if (selectedStatus === "All Statuses" || selectedStatus === "In Progress") {
      return milestones;
    }
    return milestones.filter((m) => m.status === selectedStatus);
  }, [milestones, selectedStatus]);

  // ── Financial Calculations (Derived strictly from activeCase) ─
  const totalPlanned = activeCase.totalValue;

  const released = useMemo(() => {
    return milestones
      .filter((m) => m.status === "Released" || m.status === "Completed")
      .reduce((sum, m) => sum + m.amount, 0);
  }, [milestones]);

  const approvedNotReleased = 0; // Prototype baseline

  const pendingMilestone = useMemo(() => {
    return milestones.find((m) => m.status === "Pending Approval");
  }, [milestones]);

  const pendingAmount = pendingMilestone ? pendingMilestone.amount : 0;

  const lockedAmount = useMemo(() => {
    return milestones
      .filter((m) => m.status === "Locked" || m.status === "Blocked")
      .reduce((sum, m) => sum + m.amount, 0);
  }, [milestones]);

  const remainingValue = totalPlanned - released;
  const remainingUncommitted = Math.max(0, totalPlanned - (released + approvedNotReleased + pendingAmount));

  const releasedPct = Math.round((released / totalPlanned) * 100);
  const pendingPct = Math.round((pendingAmount / totalPlanned) * 100);
  const approvedPct = 0;
  const remainingPct = Math.max(0, 100 - releasedPct - pendingPct - approvedPct);

  // 1. Financial Progress Donut Data
  const financialProgressData = useMemo(() => [
    { name: "Released", value: released, percentage: releasedPct, fill: "#16834B" },
    { name: "Approved / Ready", value: approvedNotReleased, percentage: approvedPct, fill: "#3B82F6" },
    { name: "Pending Approval", value: pendingAmount, percentage: pendingPct, fill: "#D97706" },
    { name: "Locked / Remaining", value: lockedAmount || remainingUncommitted, percentage: remainingPct, fill: "#CBD5E1" },
  ], [released, approvedNotReleased, pendingAmount, lockedAmount, remainingUncommitted, releasedPct, approvedPct, pendingPct, remainingPct]);

  // 2. Fund Distribution by Stage Data (Derived directly from current milestones)
  const fundDistributionData = useMemo(() => {
    const stageMap: { [key: string]: number } = {
      Requirement: 0,
      Pilot: 0,
      Evidence: 0,
      Procurement: 0,
      Deployment: 0,
    };

    milestones.forEach((m) => {
      if (stageMap[m.stage] !== undefined) {
        stageMap[m.stage] += m.amount;
      }
    });

    return [
      {
        stage: "Requirement",
        amountInLakh: stageMap.Requirement / 100000,
        rawAmount: stageMap.Requirement,
        percentage: Math.round((stageMap.Requirement / totalPlanned) * 100),
        displayVal: formatINRLakh(stageMap.Requirement),
      },
      {
        stage: "Pilot",
        amountInLakh: stageMap.Pilot / 100000,
        rawAmount: stageMap.Pilot,
        percentage: Math.round((stageMap.Pilot / totalPlanned) * 100),
        displayVal: formatINRLakh(stageMap.Pilot),
      },
      {
        stage: "Evidence",
        amountInLakh: stageMap.Evidence / 100000,
        rawAmount: stageMap.Evidence,
        percentage: Math.round((stageMap.Evidence / totalPlanned) * 100),
        displayVal: formatINRLakh(stageMap.Evidence),
      },
      {
        stage: "Procurement",
        amountInLakh: stageMap.Procurement / 100000,
        rawAmount: stageMap.Procurement,
        percentage: Math.round((stageMap.Procurement / totalPlanned) * 100),
        displayVal: formatINRLakh(stageMap.Procurement),
      },
      {
        stage: "Deployment",
        amountInLakh: stageMap.Deployment / 100000,
        rawAmount: stageMap.Deployment,
        percentage: Math.round((stageMap.Deployment / totalPlanned) * 100),
        displayVal: formatINRLakh(stageMap.Deployment),
      },
    ];
  }, [milestones, totalPlanned]);

  // 3. Milestone Readiness Donut Data
  const milestoneReadinessData = useMemo(() => {
    const completedCount = milestones.filter((m) => m.status === "Completed" || m.status === "Released").length;
    const inProgressCount = milestones.filter((m) => m.status === "In Progress").length || (activeCase.status === "In Progress" ? 1 : 0);
    const pendingCount = milestones.filter((m) => m.status === "Pending Approval").length;
    const lockedCount = milestones.filter((m) => m.status === "Locked" || m.status === "Blocked").length;

    return [
      { name: "Completed", value: completedCount, fill: "#16834B" },
      { name: "In Progress", value: inProgressCount, fill: "#2563EB" },
      { name: "Pending Approval", value: pendingCount, fill: "#D97706" },
      { name: "Locked", value: lockedCount, fill: "#94A3B8" },
    ];
  }, [milestones, activeCase.status]);

  const completedMilestoneCount = milestones.filter((m) => m.status === "Completed" || m.status === "Released").length;

  // Next Milestone for the detail panel (prioritize Pending Approval, then first Locked)
  const nextMilestone = useMemo(() => {
    return (
      milestones.find((m) => m.status === "Pending Approval") ||
      milestones.find((m) => m.status === "In Progress") ||
      milestones.find((m) => m.status === "Locked") ||
      null
    );
  }, [milestones]);

  // Handlers
  function handleApprovalAction(action: string) {
    setApprovalAction(action);
    if (action === "Approve Milestone") {
      const target = approvalTargetMilestone || nextMilestone;
      if (target) {
        setAllCases((prev) =>
          prev.map((c) => {
            if (c.id === activeCase.id) {
              const updatedMilestones = c.milestones.map((m) => {
                if (m.id === target.id) {
                  return { ...m, status: "Released" as const };
                }
                return m;
              });
              return { ...c, milestones: updatedMilestones };
            }
            return c;
          })
        );
        approveFinancialMilestone(target.id);
      }
    }
    setTimeout(() => {
      setApprovalModal(false);
      setApprovalDone(true);
      setTimeout(() => setApprovalDone(false), 4500);
    }, 400);
  }

  function handleDownloadReport() {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3500);
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedDepartment("All Departments");
    setSelectedFY("All Years");
    setSelectedStatus("All Statuses");
    handleCaseSelect("PRB-MH-2026-1042");
  }

  return (
    <div className="space-y-5 min-w-0 pb-12">
      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
          ═══════════════════════════════════════════════════════════ */}
      <GovPageHeader
        eyebrow="Financial Decision & Milestone Intelligence"
        title="FINANCIAL MILESTONES"
        subtitle="Track financial commitments, milestone eligibility and release readiness across the PRAMAN lifecycle."
        recordId={activeCase.id}
        actions={
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold bg-white text-[#0B2A5B] border border-[#D9E1EA] hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download size={14} className="text-[#0B2A5B]" />
            <span>Download Financial Plan</span>
          </button>
        }
      />

      {/* Notifications / Toast Feedback */}
      {downloadToast && (
        <div className="flex items-center gap-2.5 rounded-lg p-3 bg-[#EFF6FF] border border-[#BFDBFE] border-l-4 border-l-[#1D4ED8] text-xs text-[#1E40AF] font-bold shadow-sm">
          <CheckCircle2 size={16} className="text-[#1D4ED8] shrink-0" />
          <span>Case Financial Plan & Release Audit Summary generated successfully (PDF Simulation).</span>
        </div>
      )}

      {approvalDone && (
        <div className={`flex items-center justify-between gap-3 rounded-lg p-3.5 shadow-sm text-xs font-bold border ${
          approvalAction === "Reject"
            ? "bg-[#FEF2F2] border-[#FECACA] border-l-4 border-l-[#DC2626] text-[#991B1B]"
            : "bg-[#F0FDF4] border-[#BBF7D0] border-l-4 border-l-[#16834B] text-[#166534]"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className={approvalAction === "Reject" ? "text-[#DC2626]" : "text-[#16834B]"} />
            <span>
              {approvalAction === "Approve Milestone" && "Milestone Release Approved — Recorded in immutable departmental financial audit trail."}
              {approvalAction === "Reject" && "Milestone Release Rejected — Formal reason recorded."}
              {approvalAction === "Request More Evidence" && "Additional Telemetry Evidence Requested — Notification dispatched to startup via Evidence Locker."}
            </span>
          </div>
          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#D9E1EA] text-[#5E6B7E]">
            Decision Support Simulation
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. CASE & FINANCIAL FILTERS BAR (Prominent & Multi-Case)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#0B2A5B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              CASE & FINANCIAL FILTERS
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-[#5E6B7E]">
            {filteredCases.length} Procurement Cases Matching
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Case Search Input */}
          <div className="lg:col-span-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case ID, title, or department..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded border border-[#D9E1EA] focus:outline-none focus:ring-1 focus:ring-[#0B2A5B] bg-[#F8FAFC]"
            />
          </div>

          {/* Primary Procurement Case Selector */}
          <div className="lg:col-span-3">
            <select
              value={activeCase.id}
              onChange={(e) => handleCaseSelect(e.target.value)}
              className="w-full p-2 text-xs font-bold text-[#0B2A5B] bg-[#EFF6FF] border border-[#BFDBFE] rounded focus:outline-none focus:ring-1 focus:ring-[#0B2A5B] cursor-pointer"
            >
              {filteredCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full p-2 text-xs rounded border border-[#D9E1EA] bg-[#F8FAFC] text-[#172033] focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="PWD Maharashtra">PWD Maharashtra</option>
              <option value="Mumbai Municipal Corporation">Mumbai Municipal Corporation</option>
              <option value="Nashik Municipal Corporation">Nashik Municipal Corporation</option>
              <option value="Health & Family Welfare">Health & Family Welfare</option>
            </select>
          </div>

          {/* Financial Year Filter */}
          <div className="lg:col-span-1.5">
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full p-2 text-xs rounded border border-[#D9E1EA] bg-[#F8FAFC] text-[#172033] focus:outline-none"
            >
              <option value="All Years">All FY</option>
              <option value="FY 2026–27">FY 2026–27</option>
              <option value="FY 2025–26">FY 2025–26</option>
            </select>
          </div>

          {/* Status Filter & Reset */}
          <div className="lg:col-span-1.5 flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 text-xs rounded border border-[#D9E1EA] bg-[#F8FAFC] text-[#172033] focus:outline-none"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Approval">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 rounded bg-white hover:bg-slate-100 border border-[#D9E1EA] text-[#5E6B7E]"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. SELECTED CASE HEADER
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Case Context */}
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5E6B7E]">
                SELECTED PROCUREMENT CASE
              </span>
              <span className="font-mono text-xs font-black text-[#0B2A5B] bg-[#EEF5FC] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
                {activeCase.id}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                activeCase.status === "In Progress"
                  ? "bg-[#DCFCE7] text-[#16834B] border-[#BBF7D0]"
                  : "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
              }`}>
                {activeCase.status}
              </span>
              <span className="text-[10px] font-semibold text-[#5E6B7E] bg-slate-100 px-2 py-0.5 rounded">
                {activeCase.financialYear}
              </span>
            </div>

            <h2 className="text-base font-bold text-[#172033]">
              {activeCase.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5E6B7E]">
              <span className="flex items-center gap-1">
                <Building2 size={13} className="text-[#0B2A5B]" />
                <strong>Dept:</strong> {activeCase.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[#0B2A5B]" />
                <strong>Location:</strong> {activeCase.location}
              </span>
              <span className="flex items-center gap-1">
                <Target size={13} className="text-[#0B2A5B]" />
                <strong>Domain:</strong> {activeCase.domain}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={13} className="text-[#0B2A5B]" />
                <strong>Pilot Timeline:</strong> {activeCase.timeline}
              </span>
            </div>
          </div>

          {/* Right Metrics & Quick Nav */}
          <div className="flex flex-wrap items-center gap-3 lg:border-l lg:border-[#D9E1EA] lg:pl-4">
            <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-lg p-2.5 text-center min-w-[130px]">
              <span className="text-[10px] font-bold uppercase text-[#5E6B7E] block">Estimated Value</span>
              <span className="text-base font-black text-[#0B2A5B] font-mono block">
                {formatINR(activeCase.totalValue)}
              </span>
            </div>

            <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-lg p-2.5 text-center min-w-[130px]">
              <span className="text-[10px] font-bold uppercase text-[#5E6B7E] block">Current Stage</span>
              <span className="text-xs font-bold text-[#1D4ED8] block">
                {activeCase.currentStage}
              </span>
              <span className="text-[9px] text-[#5E6B7E]">
                {activeCase.currentStageIndex + 1} of 9 Stages
              </span>
            </div>

            <Link
              href="/requirements"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-3 py-2 rounded border border-[#BFDBFE] transition-colors"
            >
              <span>View Requirement</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          4. PRAMAN 9-STAGE LIFECYCLE
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5E6B7E]">
            PRAMAN PROCUREMENT & FINANCIAL LIFECYCLE
          </span>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            <span className="text-[#16834B] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#16834B]" /> Completed
            </span>
            <span className="text-[#0B2A5B] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0B2A5B] animate-pulse" /> Active Stage
            </span>
            <span className="text-[#94A3B8] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" /> Upcoming
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pt-1 pb-1 text-xs">
          {PRAMAN_LIFECYCLE_STEPS.map((step, idx) => {
            const isCompleted = idx < activeCase.currentStageIndex;
            const isCurrent = idx === activeCase.currentStageIndex;
            const isUpcoming = idx > activeCase.currentStageIndex;

            return (
              <React.Fragment key={step}>
                <div className={`px-2.5 py-1.5 rounded font-bold text-[11px] whitespace-nowrap flex items-center gap-1.5 ${
                  isCurrent
                    ? "bg-[#0B2A5B] text-white shadow-sm"
                    : isCompleted
                    ? "bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]"
                    : "bg-[#F8FAFC] text-[#64748B] border border-[#D9E1EA]"
                }`}>
                  {isCompleted && <Check size={11} />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  {isUpcoming && <Lock size={10} className="text-[#94A3B8]" />}
                  <span>{step}</span>
                </div>
                {idx < PRAMAN_LIFECYCLE_STEPS.length - 1 && (
                  <ChevronRight size={13} className="text-[#CBD5E1] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. FINANCIAL SUMMARY CARDS (4 Dynamic Cards)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: TOTAL PLANNED */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#0B2A5B] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">TOTAL PLANNED</span>
            <Wallet size={16} className="text-[#0B2A5B]" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black text-[#0B2A5B] font-mono mt-1">
              {formatINR(totalPlanned)}
            </p>
            <p className="text-[10px] text-[#5E6B7E] mt-0.5">Budget Commitment</p>
          </div>
        </div>

        {/* Card 2: RELEASED SO FAR */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#16834B] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">RELEASED SO FAR</span>
            <CheckCircle2 size={16} className="text-[#16834B]" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black text-[#16834B] font-mono mt-1">
              {formatINR(released)}
            </p>
            <p className="text-[10px] font-bold text-[#16834B] mt-0.5">
              {releasedPct}% of total planned
            </p>
          </div>
        </div>

        {/* Card 3: NEXT MILESTONE */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#D97706] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">NEXT MILESTONE</span>
            <Clock size={16} className="text-[#D97706]" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black text-[#D97706] font-mono mt-1">
              {pendingAmount > 0 ? formatINR(pendingAmount) : (nextMilestone ? formatINR(nextMilestone.amount) : "₹0")}
            </p>
            <p className="text-[10px] font-bold text-[#B45309] mt-0.5">
              {pendingAmount > 0 ? "Pending Approval" : "Next in Pipeline"}
            </p>
          </div>
        </div>

        {/* Card 4: REMAINING VALUE */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm border-t-4 border-t-[#64748B] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">REMAINING</span>
            <Landmark size={16} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-xl md:text-2xl font-black text-[#475569] font-mono mt-1">
              {formatINR(remainingValue)}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5">
              {100 - releasedPct}% unreleased
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6. FINANCIAL STATUS HORIZONTAL SUMMARY
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-lg p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#172033]">Financial Allocation Breakdown:</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16834B]" />
            <span className="text-[#5E6B7E]">Released:</span>
            <span className="font-bold text-[#16834B] font-mono">{formatINR(released)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
            <span className="text-[#5E6B7E]">Approved / Ready:</span>
            <span className="font-bold text-[#1D4ED8] font-mono">₹0</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
            <span className="text-[#5E6B7E]">Pending Approval:</span>
            <span className="font-bold text-[#D97706] font-mono">{formatINR(pendingAmount)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
            <span className="text-[#5E6B7E]">Locked / Planned:</span>
            <span className="font-bold text-[#64748B] font-mono">{formatINR(lockedAmount)}</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          7. VISUAL ANALYTICS (3 Compact Cards)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CARD 1: Financial Progress (Donut Chart) */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PieIcon size={15} className="text-[#0B2A5B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Financial Progress
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
              {releasedPct}% Released
            </span>
          </div>

          <div className="relative w-full h-40 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={financialProgressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {financialProgressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 rounded" />
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-lg font-black text-[#0B2A5B] leading-none">{releasedPct}%</p>
              <p className="text-[9px] font-bold text-[#16834B] mt-1">{formatINR(released)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-[#D9E1EA] pt-2.5 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16834B] shrink-0" />
              <span className="text-[#5E6B7E]">Released:</span>
              <span className="font-bold ml-auto">{formatINR(released)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] shrink-0" />
              <span className="text-[#5E6B7E]">Approved:</span>
              <span className="font-bold ml-auto">₹0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
              <span className="text-[#5E6B7E]">Pending:</span>
              <span className="font-bold text-[#D97706] ml-auto">{formatINR(pendingAmount)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#CBD5E1] shrink-0" />
              <span className="text-[#5E6B7E]">Locked:</span>
              <span className="font-bold text-[#64748B] ml-auto">{formatINR(lockedAmount)}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Fund Distribution by Stage (Bar Chart) */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart3 size={15} className="text-[#0B2A5B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Fund Distribution by Stage
              </h3>
            </div>

            <div className="flex bg-[#F1F5F9] rounded p-0.5 border border-[#D9E1EA]">
              <button
                onClick={() => setDistributionMode("amount")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  distributionMode === "amount" ? "bg-white text-[#0B2A5B] shadow-xs" : "text-[#64748B]"
                }`}
              >
                Amount
              </button>
              <button
                onClick={() => setDistributionMode("percentage")}
                className={`px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                  distributionMode === "percentage" ? "bg-white text-[#0B2A5B] shadow-xs" : "text-[#64748B]"
                }`}
              >
                %
              </button>
            </div>
          </div>

          <div className="w-full h-40">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundDistributionData} margin={{ top: 15, right: 5, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="stage" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} unit={distributionMode === "amount" ? "L" : "%"} />
                  <Tooltip content={<CustomBarTooltip mode={distributionMode} />} />
                  <Bar dataKey={distributionMode === "amount" ? "amountInLakh" : "percentage"} fill="#0B2A5B" radius={[4, 4, 0, 0]}>
                    {fundDistributionData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={index === 1 ? "#2563EB" : index === 3 ? "#0B2A5B" : index === 4 ? "#0D9488" : "#94A3B8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 rounded" />
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold border-t border-[#D9E1EA] pt-2.5 mt-2">
            {fundDistributionData.map((d) => (
              <div key={d.stage} className="text-center flex-1">
                <span className="text-[#94A3B8] text-[9px] block">{d.stage.slice(0, 4)}</span>
                <span className="text-[#0B2A5B]">{distributionMode === "amount" ? d.displayVal : `${d.percentage}%`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: Milestone Readiness (Status Donut) */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-[#16834B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Milestone Readiness
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
              {milestones.length} Gates Defined
            </span>
          </div>

          <div className="relative w-full h-40 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomReadinessTooltip />} />
                  <Pie
                    data={milestoneReadinessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {milestoneReadinessData.map((entry, index) => (
                      <Cell key={`cell-readiness-${index}`} fill={entry.fill} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 rounded" />
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-lg font-black text-[#0B2A5B] leading-none">
                {completedMilestoneCount} / {milestones.length}
              </p>
              <p className="text-[9px] font-bold text-[#16834B] mt-1">Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-[#D9E1EA] pt-2.5 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16834B] shrink-0" />
              <span className="text-[#5E6B7E]">Completed:</span>
              <span className="font-bold ml-auto">{completedMilestoneCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
              <span className="text-[#5E6B7E]">In Progress:</span>
              <span className="font-bold ml-auto">{activeCase.status === "In Progress" ? 1 : 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706] shrink-0" />
              <span className="text-[#5E6B7E]">Pending:</span>
              <span className="font-bold text-[#D97706] ml-auto">{pendingMilestone ? 1 : 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#94A3B8] shrink-0" />
              <span className="text-[#5E6B7E]">Locked:</span>
              <span className="font-bold text-[#64748B] ml-auto">{milestones.filter(m => m.status === "Locked").length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          8. MAIN WORKSPACE: TABLE (LEFT) + NEXT MILESTONE (RIGHT)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
        {/* LEFT: FINANCIAL MILESTONE PLAN TABLE (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden">
            <div className="p-3.5 border-b border-[#D9E1EA] bg-[#F8FAFC] flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                  FINANCIAL MILESTONE PLAN — {activeCase.id}
                </h2>
                <p className="text-[10px] text-[#5E6B7E]">
                  Sequential release gates tied to validated telemetry and milestone performance
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {displayedMilestones.length} Milestones Scheduled
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="gov-table w-full text-xs">
                <thead>
                  <tr>
                    <th style={{ width: 32, textAlign: "center" }}>#</th>
                    <th style={{ width: 95 }}>Stage</th>
                    <th>Milestone</th>
                    <th style={{ width: 95 }}>Amount</th>
                    <th>Trigger / Conditions</th>
                    <th style={{ width: 115 }}>Status</th>
                    <th style={{ width: 80, textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedMilestones.map((m) => {
                    const sc = getMilestoneStatusStyle(m.status);
                    const isPending = m.status === "Pending Approval";
                    const isLocked = m.status === "Locked" || m.status === "Blocked";
                    const isExpanded = expandedLockedId === m.id;

                    return (
                      <React.Fragment key={m.id}>
                        <tr className={isPending ? "bg-[#FFFDF5] border-l-4 border-l-[#D97706]" : ""}>
                          <td className="text-center font-bold text-[#64748B]">{m.id}</td>
                          <td>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#475569]">
                              {m.stage}
                            </span>
                          </td>
                          <td>
                            <p className="font-bold text-[#172033]">{m.milestone}</p>
                          </td>
                          <td className="font-mono font-bold text-[#0B2A5B]">
                            {m.amount > 0 ? formatINR(m.amount) : "₹0"}
                          </td>
                          <td className="text-[11px] text-[#5E6B7E] leading-snug">
                            {m.trigger}
                          </td>
                          <td>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                              {m.status}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {isPending ? (
                              <button
                                onClick={() => {
                                  setApprovalTargetMilestone(m);
                                  setApprovalModal(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#D97706] hover:bg-[#b45309] rounded shadow-xs"
                              >
                                Review
                              </button>
                            ) : m.status === "Released" || m.status === "Completed" ? (
                              <button
                                onClick={() => {
                                  setEvidenceTargetMilestone(m);
                                  setEvidenceModal(true);
                                }}
                                className="px-2.5 py-1 text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded"
                              >
                                View
                              </button>
                            ) : isLocked ? (
                              <button
                                onClick={() => setExpandedLockedId(isExpanded ? null : m.id)}
                                className="text-[10px] font-bold text-[#64748B] hover:text-[#0B2A5B] underline"
                              >
                                {isExpanded ? "Hide Reason" : "Why Locked?"}
                              </button>
                            ) : (
                              <span className="text-[#94A3B8]">—</span>
                            )}
                          </td>
                        </tr>

                        {/* Expandable Explanation for Locked Milestones */}
                        {isLocked && isExpanded && (
                          <tr className="bg-[#F8FAFC]">
                            <td colSpan={7} className="p-3 border-b border-[#D9E1EA]">
                              <div className="rounded bg-[#EFF6FF] border border-[#BFDBFE] p-3 text-xs space-y-2">
                                <div className="flex items-center gap-1.5 text-[#1D4ED8] font-bold">
                                  <Info size={14} />
                                  <span>Why is Milestone #{m.id} Locked?</span>
                                </div>
                                <p className="text-[#1E3A8A]">
                                  <strong>Reason:</strong> {m.lockedReason || "Prerequisite pilot evaluation stage has not been completed."}
                                </p>
                                {m.prerequisites && (
                                  <div className="space-y-1">
                                    <span className="font-bold text-[#172033] text-[11px]">Required Pre-conditions:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                                      {m.prerequisites.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 text-[#475569]">
                                          {p.status === "met" ? (
                                            <CheckCircle2 size={12} className="text-[#16834B]" />
                                          ) : p.status === "pending" ? (
                                            <Clock size={12} className="text-[#D97706]" />
                                          ) : (
                                            <Lock size={12} className="text-[#94A3B8]" />
                                          )}
                                          <span>{p.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E1EA] flex items-center gap-2 text-[11px] text-[#5E6B7E]">
              <ShieldCheck size={14} className="text-[#0B2A5B] shrink-0" />
              <span>
                PRAMAN Governance Policy: Fund releases execute only upon validated cryptographic telemetry proof and authorized officer review.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: NEXT FINANCIAL MILESTONE & RELEASE CONDITIONS (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {nextMilestone ? (
            <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 bg-[#0B2A5B] text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/70">
                    NEXT FINANCIAL MILESTONE
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    nextMilestone.status === "Pending Approval"
                      ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                      : "bg-white/20 text-white border-white/30"
                  }`}>
                    {nextMilestone.status}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  {nextMilestone.milestone}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Linked Stage: {nextMilestone.stage}
                </p>
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div className="p-3 rounded bg-[#FFFBEB] border border-[#FDE68A] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-semibold text-[#78350F]">Milestone Release Amount:</span>
                    <span className="text-lg font-black text-[#D97706] font-mono">
                      {formatINR(nextMilestone.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#92400E] leading-snug">
                    {nextMilestone.trigger}
                  </p>
                </div>

                {/* RELEASE CONDITIONS CHECKLIST */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#172033] uppercase text-[10px] tracking-wider">
                      RELEASE CONDITIONS
                    </span>
                    <span className="text-[11px] font-bold text-[#16834B]">
                      {nextMilestone.conditions
                        ? `${nextMilestone.conditions.filter((c) => c.met).length} of ${nextMilestone.conditions.length} satisfied`
                        : "Verification in progress"}
                    </span>
                  </div>

                  {nextMilestone.conditions ? (
                    <div className="space-y-1.5">
                      {nextMilestone.conditions.map((c, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded border flex items-start gap-2 text-[11px] ${
                            c.met
                              ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]"
                              : "bg-[#F8FAFC] border-[#D9E1EA] text-[#64748B]"
                          }`}
                        >
                          {c.met ? (
                            <CheckCircle2 size={13} className="text-[#16834B] shrink-0 mt-0.5" />
                          ) : (
                            <Clock size={13} className="text-[#D97706] shrink-0 mt-0.5" />
                          )}
                          <span className="leading-snug">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#5E6B7E] italic">
                      Prerequisite gates must clear before release conditions activate.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-[#D9E1EA]">
                  {nextMilestone.status === "Pending Approval" && (
                    <button
                      onClick={() => {
                        setApprovalTargetMilestone(nextMilestone);
                        setApprovalModal(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded bg-[#D97706] hover:bg-[#b45309] text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <FileCheck2 size={14} />
                      <span>Review & Approve Release →</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEvidenceTargetMilestone(nextMilestone);
                      setEvidenceModal(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded bg-[#EEF5FC] hover:bg-[#DBEAFE] text-[#0B2A5B] font-bold text-xs border border-[#BFDBFE] transition-colors"
                  >
                    <Eye size={13} />
                    <span>View Supporting Evidence ({nextMilestone.evidenceCount || 3} items)</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E1EA] text-[10px] text-center text-[#5E6B7E]">
                Official decision-support gate · Approval generates verifiable audit log record.
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#D9E1EA] rounded-lg p-6 text-center text-xs text-[#5E6B7E]">
              <CheckCircle2 size={24} className="text-[#16834B] mx-auto mb-2" />
              <p className="font-bold text-[#172033]">All Milestones Released</p>
              <p className="text-[11px] mt-1">This procurement case has reached final disbursement.</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          9. FINANCIAL GOVERNANCE & QUICK LINKS
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Governance Info Panel */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#0B2A5B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              FINANCIAL GOVERNANCE & INTEGRATION
            </h3>
          </div>
          <p className="text-xs text-[#5E6B7E] leading-relaxed">
            PRAMAN provides milestone-based financial decision support. Milestone eligibility does not automatically
            release funds. Financial progression requires validated telemetry evidence + milestone completion + authorized officer review.
          </p>
          <div className="p-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1D4ED8] flex items-center gap-2 font-medium">
            <Landmark size={14} className="shrink-0" />
            <span>Integrated with Public Financial Management System (PFMS) & GeM Procurement Gateways.</span>
          </div>
        </div>

        {/* Quick Reports / Actions */}
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#0B2A5B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              FINANCIAL DOCUMENTS & REPORTS
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={handleDownloadReport}
              className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] hover:bg-slate-100 text-[#172033] flex items-center gap-2 text-left"
            >
              <FileText size={13} className="text-[#0B2A5B]" />
              <span>Budget Allocation Order</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] hover:bg-slate-100 text-[#172033] flex items-center gap-2 text-left"
            >
              <BarChart3 size={13} className="text-[#0B2A5B]" />
              <span>Utilization Certificate</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] hover:bg-slate-100 text-[#172033] flex items-center gap-2 text-left"
            >
              <ShieldCheck size={13} className="text-[#16834B]" />
              <span>Financial Audit Trail</span>
            </button>
            <button
              onClick={handleDownloadReport}
              className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] hover:bg-slate-100 text-[#172033] flex items-center gap-2 text-left"
            >
              <Download size={13} className="text-[#0B2A5B]" />
              <span>Full Export (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: REVIEW FINANCIAL MILESTONE MODAL
          ═══════════════════════════════════════════════════════════ */}
      {approvalModal && (approvalTargetMilestone || nextMilestone) && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setApprovalModal(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Officer Authorization Gate
                </span>
                <h3 className="text-sm font-bold">REVIEW FINANCIAL MILESTONE</h3>
              </div>
              <button
                onClick={() => setApprovalModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#5E6B7E]">Milestone Name:</span>
                  <span className="font-bold text-[#172033]">
                    {(approvalTargetMilestone || nextMilestone)?.milestone}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5E6B7E]">Amount to Authorize:</span>
                  <span className="font-black text-[#D97706] font-mono text-base">
                    {formatINR((approvalTargetMilestone || nextMilestone)?.amount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5E6B7E]">Linked PRAMAN Stage:</span>
                  <span className="font-semibold text-[#0B2A5B]">
                    {(approvalTargetMilestone || nextMilestone)?.stage}
                  </span>
                </div>
              </div>

              {/* Release Conditions in Modal */}
              <div className="space-y-1.5">
                <span className="font-bold text-[#172033] uppercase text-[10px] tracking-wider">
                  Release Conditions Status:
                </span>
                <div className="space-y-1">
                  {(approvalTargetMilestone || nextMilestone)?.conditions?.map((c, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded border flex items-center gap-2 text-[11px] ${
                        c.met ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]" : "bg-[#F8FAFC] border-[#D9E1EA] text-[#64748B]"
                      }`}
                    >
                      {c.met ? <CheckCircle2 size={12} className="text-[#16834B]" /> : <Clock size={12} className="text-[#D97706]" />}
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Governance Notice */}
              <div className="p-3 rounded bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Governance Policy:</strong> Approval records milestone eligibility in the PRAMAN workflow.
                  It does not execute an immediate commercial financial transfer.
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleApprovalAction("Reject")}
                className="px-3.5 py-2 text-xs font-bold text-[#DC2626] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] rounded"
              >
                Reject Release
              </button>
              <button
                onClick={() => handleApprovalAction("Request More Evidence")}
                className="px-3.5 py-2 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] border border-[#BFDBFE] hover:bg-[#DBEAFE] rounded"
              >
                Request More Evidence
              </button>
              <button
                onClick={() => handleApprovalAction("Approve Milestone")}
                className="px-4 py-2 text-xs font-bold text-white bg-[#16834B] hover:bg-[#136f3f] rounded transition-colors shadow-sm"
              >
                Approve Milestone →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: EVIDENCE DETAIL MODAL
          ═══════════════════════════════════════════════════════════ */}
      {evidenceModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEvidenceModal(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                  Cryptographic Evidence Trail
                </span>
                <h3 className="text-sm font-bold">
                  {evidenceTargetMilestone?.milestone || "Milestone Evidence Records"}
                </h3>
              </div>
              <button
                onClick={() => setEvidenceModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-3.5 text-xs">
              <p className="text-[#5E6B7E]">
                Attached telemetry datasets, verified reports, and audit artifacts anchored in the PRAMAN Evidence Locker:
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={15} className="text-[#16834B]" />
                    <div>
                      <p className="font-bold text-[#172033]">MoU & Pilot Initiation Document</p>
                      <p className="text-[10px] text-[#5E6B7E]">SHA-256: <code>e8b4...12f9</code></p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded">Verified</span>
                </div>

                <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck2 size={15} className="text-[#16834B]" />
                    <div>
                      <p className="font-bold text-[#172033]">Raw Fleet Telemetry Ingestion Log</p>
                      <p className="text-[10px] text-[#5E6B7E]">1,420,000 datapoints · PMPML buses</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded">Verified</span>
                </div>

                <div className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-[#D97706]" />
                    <div>
                      <p className="font-bold text-[#172033]">30-Day Automated Evaluation Report</p>
                      <p className="text-[10px] text-[#5E6B7E]">Awaiting Final Officer Gate</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#B45309] bg-[#FEF3C7] px-2 py-0.5 rounded">Review</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1D4ED8]">
                All evidence artifacts are cryptographically signed and immutable.
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end">
              <button
                onClick={() => setEvidenceModal(false)}
                className="px-4 py-2 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded"
              >
                Close Evidence Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
