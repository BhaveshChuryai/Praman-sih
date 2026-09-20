"use client";

import { useState, useMemo, useEffect } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel } from "@/components/ui";
import {
  Wallet, CheckCircle2, Clock, Lock, ChevronRight, ArrowRight,
  FileCheck2, Eye, AlertTriangle, Shield, Building2, MapPin,
  CalendarDays, X, Landmark, Target, TrendingUp, Check,
  Layers, ShieldAlert, Sparkles, AlertCircle, ArrowUpRight,
  Download, Filter, RotateCcw, BarChart3, PieChart as PieIcon,
  ShieldCheck, FileText, CheckCircle, HelpCircle
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

/* ═══════════════════════════════════════════════════════════════
   DEMO CASE & MILESTONE DEFINITIONS (Single Source of Truth)
   ═══════════════════════════════════════════════════════════════ */

const DEMO_CASE = {
  id: "PRB-MH-2026-1042",
  title: "Road damage detection using public transport telemetry",
  department: "PWD Maharashtra",
  location: "Pune District",
  domain: "Computer Vision & Edge AI",
  timeline: "90 Days",
  totalValue: 10000000, // ₹1,00,00,000 (₹1 Cr)
  currentStage: "Sandbox Pilot",
  completedStages: 5, // 5 completed, currently on stage 6
  totalStages: 9,
};

const LIFECYCLE_STAGES = [
  { name: "Problem Intake", state: "Completed" },
  { name: "Requirement Structuring", state: "Completed" },
  { name: "Eligibility", state: "Completed" },
  { name: "Startup Matching", state: "Completed" },
  { name: "Explainable Ranking", state: "Completed" },
  { name: "Sandbox Pilot", state: "Current" },
  { name: "Evidence & KPI", state: "Action Required" },
  { name: "Procurement Readiness", state: "Upcoming" },
  { name: "Decision / Handoff", state: "Upcoming" },
];

type MilestoneStatus = "Completed" | "Released" | "Pending Approval" | "In Progress" | "Locked";

type Milestone = {
  id: number;
  stage: string;
  milestone: string;
  amount: number;
  trigger: string;
  status: MilestoneStatus;
  conditions?: { text: string; met: boolean }[];
};

const MILESTONES: Milestone[] = [
  {
    id: 1,
    stage: "Requirement",
    milestone: "Requirement approved",
    amount: 0,
    trigger: "Government approval of structured requirement",
    status: "Completed",
  },
  {
    id: 2,
    stage: "Pilot",
    milestone: "Pilot initiation",
    amount: 1000000, // ₹10,00,000
    trigger: "MoU signed & baseline telemetry started",
    status: "Released",
  },
  {
    id: 3,
    stage: "Pilot",
    milestone: "Mid-pilot evaluation (30 days)",
    amount: 1500000, // ₹15,00,000
    trigger: "30-day evaluation report + KPI ≥85%",
    status: "Pending Approval",
    conditions: [
      { text: "Pilot started & telemetry streaming", met: true },
      { text: "Pilot telemetry data received in cryptographic locker", met: true },
      { text: "30-day preliminary evaluation completed", met: true },
      { text: "KPI targets met (≥85% detection accuracy)", met: false },
      { text: "Nodal Officer formal sign-off & release authorization", met: false },
    ],
  },
  {
    id: 4,
    stage: "Evidence",
    milestone: "KPI validation",
    amount: 1500000, // ₹15,00,000
    trigger: "Final pilot report with verified KPIs",
    status: "Locked",
  },
  {
    id: 5,
    stage: "Procurement",
    milestone: "Procurement award",
    amount: 4000000, // ₹40,00,000
    trigger: "Contract signing & compliance clearance",
    status: "Locked",
  },
  {
    id: 6,
    stage: "Deployment",
    milestone: "Production deployment",
    amount: 2000000, // ₹20,00,000
    trigger: "Successful deployment & handover",
    status: "Locked",
  },
];

/* ═══════════════════════════════════════════════════════════════
   FORMATTING & COLOR HELPERS
   ═══════════════════════════════════════════════════════════════ */

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount === 0) return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatINRLakh(amount: number): string {
  if (amount === 0) return "₹0";
  if (amount >= 10000000) return `₹${(amount / 10000000) * 100}L`;
  if (amount >= 100000) return `₹${amount / 100000}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function statusBadgeStyle(status: MilestoneStatus): { bg: string; border: string; text: string; dot: string } {
  switch (status) {
    case "Completed":
    case "Released":
      return { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", dot: "#16834B" };
    case "Pending Approval":
      return { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", dot: "#D97706" };
    case "In Progress":
      return { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", dot: "#2563EB" };
    case "Locked":
    default:
      return { bg: "#F8FAFC", border: "#E2E8F0", text: "#64748B", dot: "#94A3B8" };
  }
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM TOOLTIPS FOR CHARTS
   ═══════════════════════════════════════════════════════════════ */

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div style={{
        background: "#0F172A", color: "#FFFFFF", padding: "8px 12px",
        borderRadius: 6, fontSize: "0.74rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #334155"
      }}>
        <p style={{ margin: "0 0 2px", fontWeight: 700, color: data.payload.fill || "#FFFFFF" }}>
          {data.name}
        </p>
        <p style={{ margin: 0, fontWeight: 800 }}>
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
      <div style={{
        background: "#0F172A", color: "#FFFFFF", padding: "8px 12px",
        borderRadius: 6, fontSize: "0.74rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #334155"
      }}>
        <p style={{ margin: "0 0 2px", fontWeight: 700, color: data.payload.fill || "#FFFFFF" }}>
          {data.name}
        </p>
        <p style={{ margin: 0, fontWeight: 800 }}>
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
      <div style={{
        background: "#0F172A", color: "#FFFFFF", padding: "8px 12px",
        borderRadius: 6, fontSize: "0.74rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid #334155"
      }}>
        <p style={{ margin: "0 0 2px", fontWeight: 700, color: "#93C5FD" }}>{label} Stage</p>
        <p style={{ margin: 0, fontWeight: 800 }}>
          {formatINR(data.rawAmount)} ({data.percentage}% of total)
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
  const { problem } = usePraman();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Primary Case Context
  const caseData = useMemo(() => {
    if (problem) {
      return {
        id: problem.display_id || problem.id,
        title: problem.title,
        department: problem.department,
        location: problem.location,
        domain: problem.domain,
        timeline: `${problem.timeline_days} Days`,
        totalValue: DEMO_CASE.totalValue,
        currentStage: DEMO_CASE.currentStage,
        completedStages: DEMO_CASE.completedStages,
        totalStages: DEMO_CASE.totalStages,
      };
    }
    return DEMO_CASE;
  }, [problem]);

  // Filters state
  const [selectedCase, setSelectedCase] = useState(caseData.id);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedFY, setSelectedFY] = useState("FY 2026–27");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Fund Distribution Toggle: Amount vs Percentage
  const [distributionMode, setDistributionMode] = useState<"amount" | "percentage">("amount");

  // Review & Approval Modal state
  const [approvalModal, setApprovalModal] = useState(false);
  const [approvalDone, setApprovalDone] = useState(false);
  const [approvalAction, setApprovalAction] = useState<string | null>(null);

  // Evidence view modal simulation
  const [evidenceModal, setEvidenceModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState(false);

  // Derive Financial Calculations (Single Source of Truth)
  const released = useMemo(() => {
    return MILESTONES.filter((m) => m.status === "Released" || m.status === "Completed")
      .reduce((sum, m) => sum + m.amount, 0);
  }, []);

  const approvedNotReleased = 0; // ₹0 prototype baseline

  const nextMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.status === "Pending Approval");
  }, []);

  const nextMilestoneAmount = nextMilestone ? nextMilestone.amount : 0;
  const remainingValue = caseData.totalValue - released;
  const remainingUncommitted = caseData.totalValue - (released + approvedNotReleased + nextMilestoneAmount);

  const releasedPct = Math.round((released / caseData.totalValue) * 100);
  const pendingPct = Math.round((nextMilestoneAmount / caseData.totalValue) * 100);
  const approvedPct = 0;
  const remainingPct = Math.round((remainingUncommitted / caseData.totalValue) * 100);

  // 1. Financial Progress Donut Data
  const financialProgressData = useMemo(() => [
    { name: "Released", value: released, percentage: releasedPct, fill: "#16834B" },
    { name: "Approved / Not Released", value: approvedNotReleased, percentage: approvedPct, fill: "#3B82F6" },
    { name: "Pending Approval", value: nextMilestoneAmount, percentage: pendingPct, fill: "#D97706" },
    { name: "Remaining", value: remainingUncommitted, percentage: remainingPct, fill: "#CBD5E1" },
  ], [released, approvedNotReleased, nextMilestoneAmount, remainingUncommitted, releasedPct, approvedPct, pendingPct, remainingPct]);

  // 2. Fund Distribution by Stage Data (Derived from Milestones)
  const fundDistributionData = useMemo(() => {
    const stageMap: { [key: string]: number } = {
      Requirement: 0,
      Pilot: 0,
      Evidence: 0,
      Procurement: 0,
      Deployment: 0,
    };

    MILESTONES.forEach(m => {
      if (stageMap[m.stage] !== undefined) {
        stageMap[m.stage] += m.amount;
      }
    });

    return [
      {
        stage: "Requirement",
        amountInLakh: stageMap.Requirement / 100000,
        rawAmount: stageMap.Requirement,
        percentage: Math.round((stageMap.Requirement / caseData.totalValue) * 100),
        displayVal: "₹0",
      },
      {
        stage: "Pilot",
        amountInLakh: stageMap.Pilot / 100000,
        rawAmount: stageMap.Pilot,
        percentage: Math.round((stageMap.Pilot / caseData.totalValue) * 100),
        displayVal: "₹25L",
      },
      {
        stage: "Evidence",
        amountInLakh: stageMap.Evidence / 100000,
        rawAmount: stageMap.Evidence,
        percentage: Math.round((stageMap.Evidence / caseData.totalValue) * 100),
        displayVal: "₹15L",
      },
      {
        stage: "Procurement",
        amountInLakh: stageMap.Procurement / 100000,
        rawAmount: stageMap.Procurement,
        percentage: Math.round((stageMap.Procurement / caseData.totalValue) * 100),
        displayVal: "₹40L",
      },
      {
        stage: "Deployment",
        amountInLakh: stageMap.Deployment / 100000,
        rawAmount: stageMap.Deployment,
        percentage: Math.round((stageMap.Deployment / caseData.totalValue) * 100),
        displayVal: "₹20L",
      },
    ];
  }, [caseData.totalValue]);

  // 3. Milestone Readiness Donut Data (Status Counts)
  const milestoneReadinessData = useMemo(() => {
    const completedCount = MILESTONES.filter(m => m.status === "Completed" || m.status === "Released").length;
    const inProgressCount = 1; // Stage 6 Sandbox Pilot active
    const pendingCount = MILESTONES.filter(m => m.status === "Pending Approval").length;
    const lockedCount = MILESTONES.filter(m => m.status === "Locked").length - 1; // 2 locked upcoming

    return [
      { name: "Completed", value: completedCount, fill: "#16834B" },
      { name: "In Progress", value: inProgressCount, fill: "#2563EB" },
      { name: "Pending Approval", value: pendingCount, fill: "#D97706" },
      { name: "Locked", value: lockedCount > 0 ? lockedCount : 2, fill: "#94A3B8" },
    ];
  }, []);

  // Filtered Milestones Table
  const displayedMilestones = useMemo(() => {
    if (statusFilter === "All Statuses") return MILESTONES;
    return MILESTONES.filter(m => m.status === statusFilter);
  }, [statusFilter]);

  function handleApprovalAction(action: string) {
    setApprovalAction(action);
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
    setSelectedDepartment("All Departments");
    setSelectedFY("FY 2026–27");
    setStatusFilter("All Statuses");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
      
      {/* ═══════════════════════════════════════════════════════════════
         1. PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <GovPageHeader
        eyebrow="Financial Governance"
        title="FINANCIAL MILESTONES"
        subtitle="Track financial commitments, approvals and releases across the procurement lifecycle."
        recordId={caseData.id}
        actions={
          <button
            onClick={handleDownloadReport}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 6,
              fontSize: "0.78rem",
              fontWeight: 700,
              background: "#FFFFFF",
              color: "var(--gov-navy)",
              border: "1px solid var(--line)",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Download size={14} style={{ color: "var(--gov-blue)" }} />
            Download Report
          </button>
        }
      />

      {/* Toast Notification for Report Download */}
      {downloadToast && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "10px 16px",
          background: "#EFF6FF", border: "1px solid #BFDBFE", borderLeft: "4px solid #1D4ED8",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", fontSize: "0.78rem", color: "#1E40AF", fontWeight: 700
        }}>
          <CheckCircle2 size={16} style={{ color: "#1D4ED8" }} />
          Financial Milestones & Audit Trail report generated successfully (PDF simulation).
        </div>
      )}

      {/* Toast Notification for Approval Workflow */}
      {approvalDone && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 18px",
          background: approvalAction === "Reject" ? "#FEF2F2" : "#F0FDF4",
          border: `1px solid ${approvalAction === "Reject" ? "#FECACA" : "#BBF7D0"}`,
          borderLeft: `4px solid ${approvalAction === "Reject" ? "#DC2626" : "#16834B"}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}>
          <CheckCircle2 size={16} style={{ color: approvalAction === "Reject" ? "#DC2626" : "#16834B" }} />
          <div>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: approvalAction === "Reject" ? "#991B1B" : "#166534" }}>
              {approvalAction === "Approve Release" && "Milestone Release Approved — Recorded in immutable departmental audit trail."}
              {approvalAction === "Reject" && "Milestone Release Rejected — Audit record updated."}
              {approvalAction === "Request More Evidence" && "Additional Evidence Requested — Notification dispatched to startup via Cryptographic Locker."}
            </span>
          </div>
          <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)", marginLeft: "auto", background: "white", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--line)" }}>
            Prototype Simulation
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         2. FILTER BAR (Primary: SELECT PROCUREMENT CASE)
         ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
        padding: "14px 18px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12
      }}>
        {/* Primary Case Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 340px", minWidth: 260 }}>
          <span style={{
            fontSize: "0.72rem", fontWeight: 800, color: "var(--gov-navy)",
            textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap"
          }}>
            Select Procurement Case:
          </span>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            style={{
              padding: "7px 12px", fontSize: "0.82rem", fontWeight: 700,
              border: "1.5px solid #BFDBFE", borderRadius: 6,
              background: "#EFF6FF", color: "#1D4ED8", outline: "none", cursor: "pointer",
              width: "100%", maxWidth: 440
            }}
          >
            <option value={caseData.id}>{caseData.id} — {caseData.title}</option>
          </select>
        </div>

        {/* Additional Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {/* Department Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 600 }}>Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                padding: "6px 10px", fontSize: "0.75rem", fontWeight: 600,
                border: "1px solid var(--line)", borderRadius: 5, background: "#F8FAFC", color: "var(--ink)", outline: "none"
              }}
            >
              <option value="All Departments">All Departments</option>
              <option value="PWD Maharashtra">PWD Maharashtra</option>
              <option value="Health & Family Welfare">Health & Family Welfare</option>
              <option value="Urban Development">Urban Development</option>
            </select>
          </div>

          {/* FY Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 600 }}>FY:</span>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              style={{
                padding: "6px 10px", fontSize: "0.75rem", fontWeight: 600,
                border: "1px solid var(--line)", borderRadius: 5, background: "#F8FAFC", color: "var(--ink)", outline: "none"
              }}
            >
              <option value="FY 2026–27">FY 2026–27</option>
              <option value="FY 2025–26">FY 2025–26</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "6px 10px", fontSize: "0.75rem", fontWeight: 600,
                border: "1px solid var(--line)", borderRadius: 5, background: "#F8FAFC", color: "var(--ink)", outline: "none"
              }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Released">Released</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Locked">Locked</option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "6px 12px", borderRadius: 5, fontSize: "0.74rem", fontWeight: 700,
              background: "var(--gov-navy)", color: "#FFFFFF", border: "none", cursor: "pointer"
            }}
          >
            <Filter size={12} /> Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "6px 10px", borderRadius: 5, fontSize: "0.74rem", fontWeight: 600,
              background: "#FFFFFF", color: "var(--ink-mid)", border: "1px solid var(--line)", cursor: "pointer"
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         3. SELECTED PROCUREMENT CASE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
        padding: "16px 20px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16
      }}>
        {/* Left: Active badge, ID, Title, Context pills */}
        <div style={{ flex: "1 1 450px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: "0.68rem", fontWeight: 800, color: "#16834B",
              background: "#DCFCE7", border: "1px solid #BBF7D0", padding: "2px 8px", borderRadius: 4,
              textTransform: "uppercase", letterSpacing: "0.05em"
            }}>
              ACTIVE
            </span>
            <span style={{
              fontFamily: "monospace", fontSize: "0.72rem", fontWeight: 800,
              color: "#1D4ED8", background: "#EFF6FF", padding: "2px 8px", borderRadius: 4, border: "1px solid #BFDBFE"
            }}>
              {caseData.id}
            </span>
          </div>

          <h2 style={{ fontSize: "1.08rem", fontWeight: 800, color: "var(--gov-navy)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
            {caseData.title}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: "0.76rem", color: "var(--ink-mid)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Building2 size={13} style={{ color: "var(--gov-blue)" }} /> {caseData.department}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <MapPin size={13} style={{ color: "var(--gov-blue)" }} /> {caseData.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Target size={13} style={{ color: "var(--gov-blue)" }} /> {caseData.domain}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <CalendarDays size={13} style={{ color: "var(--gov-blue)" }} /> {caseData.timeline}
            </span>
          </div>
        </div>

        {/* Right: Current Stage & Total Value */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right", paddingRight: 16, borderRight: "1px solid var(--line)" }}>
            <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.65rem" }}>CURRENT STAGE</p>
            <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gov-blue)", margin: "0 0 2px" }}>
              {caseData.currentStage}
            </p>
            <span style={{ fontSize: "0.68rem", color: "var(--ink-soft)", fontWeight: 600 }}>
              {caseData.completedStages} of {caseData.totalStages} stages completed
            </span>
          </div>

          <div style={{ textAlign: "right", background: "#F8FAFC", padding: "10px 16px", borderRadius: 6, border: "1px solid var(--line)" }}>
            <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.65rem" }}>Total Project Value</p>
            <p style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--gov-navy)", margin: 0, fontFamily: "monospace" }}>
              {formatINR(caseData.totalValue)}
            </p>
            <span style={{ fontSize: "0.68rem", color: "var(--ink-soft)", fontWeight: 600 }}>₹1.00 Cr (Estimated)</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         4. PRAMAN 9-STAGE LIFECYCLE
         ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8, padding: "14px 18px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)", overflowX: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p className="gov-section-label" style={{ margin: 0, fontSize: "0.68rem" }}>End-to-End Case Progression</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.68rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#16834B", fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16834B" }} /> Completed
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#1236B8", fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1236B8" }} /> Current Stage
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#D97706", fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706" }} /> Action Required
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#64748B", fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94A3B8" }} /> Upcoming
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "fit-content" }}>
          {LIFECYCLE_STAGES.map((s, i) => {
            const isDone = s.state === "Completed";
            const isCurrent = s.state === "Current";
            const isAction = s.state === "Action Required";
            const isUpcoming = s.state === "Upcoming";

            let bg = "#F8FAFC";
            let border = "1px solid var(--line)";
            let color = "#64748B";
            let shadow = "none";

            if (isDone) {
              bg = "#F0FDF4";
              border = "1px solid #BBF7D0";
              color = "#15803D";
            } else if (isCurrent) {
              bg = "#1236B8";
              border = "1px solid #1236B8";
              color = "#FFFFFF";
              shadow = "0 2px 6px rgba(18, 54, 184, 0.25)";
            } else if (isAction) {
              bg = "#FFFBEB";
              border = "1px solid #FDE68A";
              color = "#B45309";
            }

            return (
              <div key={s.name} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  padding: "6px 10px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 4,
                  background: bg, border, color, boxShadow: shadow
                }}>
                  {isDone && <Check size={11} style={{ color: "#16834B" }} />}
                  {isCurrent && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFFFFF", display: "inline-block" }} />}
                  {isAction && <Clock size={11} style={{ color: "#D97706" }} />}
                  {isUpcoming && <Lock size={10} style={{ color: "#94A3B8" }} />}
                  {s.name}
                </div>
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <ChevronRight size={13} style={{ color: "#CBD5E1", flexShrink: 0, margin: "0 2px" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         5. FINANCIAL SUMMARY — EXACT 4 CARDS (Consistent Height & Alignment)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Total Project Value */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", borderTop: "3px solid var(--gov-navy)",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="gov-section-label" style={{ margin: 0 }}>Total Project Value</span>
            <Wallet size={16} style={{ color: "var(--gov-navy)" }} />
          </div>
          <div>
            <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--gov-navy)", margin: "4px 0 2px", fontFamily: "monospace" }}>
              {formatINR(caseData.totalValue)}
            </p>
            <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 600 }}>
              ₹1 Cr (Estimated)
            </span>
          </div>
        </div>

        {/* CARD 2: Released So Far */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", borderTop: "3px solid #16834B",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="gov-section-label" style={{ margin: 0 }}>Released So Far</span>
            <CheckCircle2 size={16} style={{ color: "#16834B" }} />
          </div>
          <div>
            <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#16834B", margin: "4px 0 2px", fontFamily: "monospace" }}>
              {formatINR(released)}
            </p>
            <span style={{ fontSize: "0.7rem", color: "#15803D", fontWeight: 700 }}>
              {releasedPct}% of total
            </span>
          </div>
        </div>

        {/* CARD 3: Next Milestone Amount */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", borderTop: "3px solid #D97706",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="gov-section-label" style={{ margin: 0 }}>Next Milestone Amount</span>
            <Clock size={16} style={{ color: "#D97706" }} />
          </div>
          <div>
            <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#D97706", margin: "4px 0 2px", fontFamily: "monospace" }}>
              {nextMilestone ? formatINR(nextMilestone.amount) : "—"}
            </p>
            <span style={{ fontSize: "0.7rem", color: "#B45309", fontWeight: 700, background: "#FEF3C7", padding: "1px 6px", borderRadius: 3 }}>
              Pending Approval
            </span>
          </div>
        </div>

        {/* CARD 4: Remaining Value */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", borderTop: "3px solid #64748B",
          boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 110
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="gov-section-label" style={{ margin: 0 }}>Remaining Value</span>
            <Landmark size={16} style={{ color: "#64748B" }} />
          </div>
          <div>
            <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--ink-mid)", margin: "4px 0 2px", fontFamily: "monospace" }}>
              {formatINR(remainingValue)}
            </p>
            <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)", fontWeight: 600 }}>
              {100 - releasedPct}% remaining
            </span>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
         6. NEW FINANCIAL VISUALIZATION AREA (3 Compact Cards)
            LEFT: Financial Progress (Donut)
            CENTER: Fund Distribution by Stage (Bar Chart)
            RIGHT: Milestone Readiness (Donut)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* VISUAL 1: Financial Progress (Donut Chart) */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <PieIcon size={15} style={{ color: "var(--gov-blue)" }} />
              <h3 style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                Financial Progress
              </h3>
            </div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#16834B", background: "#DCFCE7", padding: "1px 6px", borderRadius: 3 }}>
              {releasedPct}% Released
            </span>
          </div>

          {/* Donut Chart with Centered Value */}
          <div style={{ position: "relative", width: "100%", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={financialProgressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
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
              <div style={{ height: "100%", width: "100%", background: "#F8FAFC", borderRadius: 6 }} />
            )}

            {/* Center Label */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gov-navy)", margin: 0, lineHeight: 1 }}>
                {releasedPct}%
              </p>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16834B", margin: "2px 0 0" }}>
                {formatINR(released)} Released
              </p>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px",
            fontSize: "0.7rem", borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 6
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16834B", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Released:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink)" }}>{formatINR(released)} ({releasedPct}%)</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Approved:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink)" }}>₹0 (0%)</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Pending:</span>
              <strong style={{ marginLeft: "auto", color: "#B45309" }}>{formatINR(nextMilestoneAmount)} ({pendingPct}%)</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Remaining:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink-soft)" }}>{formatINR(remainingUncommitted)} ({remainingPct}%)</strong>
            </div>
          </div>
        </div>

        {/* VISUAL 2: Fund Distribution by Stage (Bar Chart) */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <BarChart3 size={15} style={{ color: "var(--gov-blue)" }} />
              <h3 style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                Fund Distribution by Stage
              </h3>
            </div>

            {/* Compact Toggle [ Amount ] [ Percentage ] */}
            <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 4, padding: 2, border: "1px solid var(--line)" }}>
              <button
                onClick={() => setDistributionMode("amount")}
                style={{
                  padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, borderRadius: 3, border: "none", cursor: "pointer",
                  background: distributionMode === "amount" ? "#FFFFFF" : "transparent",
                  color: distributionMode === "amount" ? "var(--gov-navy)" : "var(--ink-soft)",
                  boxShadow: distributionMode === "amount" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                }}
              >
                Amount
              </button>
              <button
                onClick={() => setDistributionMode("percentage")}
                style={{
                  padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, borderRadius: 3, border: "none", cursor: "pointer",
                  background: distributionMode === "percentage" ? "#FFFFFF" : "transparent",
                  color: distributionMode === "percentage" ? "var(--gov-navy)" : "var(--ink-soft)",
                  boxShadow: distributionMode === "percentage" ? "0 1px 2px rgba(0,0,0,0.06)" : "none"
                }}
              >
                Percentage
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{ width: "100%", height: 160 }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundDistributionData} margin={{ top: 18, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis
                    dataKey="stage"
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    unit={distributionMode === "amount" ? "L" : "%"}
                  />
                  <Tooltip content={<CustomBarTooltip mode={distributionMode} />} />
                  <Bar
                    dataKey={distributionMode === "amount" ? "amountInLakh" : "percentage"}
                    fill="#1E3A8A"
                    radius={[4, 4, 0, 0]}
                  >
                    {fundDistributionData.map((entry, index) => {
                      const isPilot = entry.stage === "Pilot";
                      return (
                        <Cell
                          key={`bar-${index}`}
                          fill={isPilot ? "#2563EB" : index === 3 ? "#0284C7" : index === 4 ? "#0D9488" : "#94A3B8"}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: "100%", width: "100%", background: "#F8FAFC", borderRadius: 6 }} />
            )}
          </div>

          {/* Values Row below Chart */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: "0.68rem", fontWeight: 700, color: "var(--ink-mid)",
            borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 6
          }}>
            {fundDistributionData.map((d) => (
              <div key={d.stage} style={{ textAlign: "center", flex: 1 }}>
                <span style={{ color: "var(--ink-soft)", fontSize: "0.62rem", display: "block" }}>{d.stage}</span>
                <span style={{ color: "var(--gov-navy)", fontWeight: 800 }}>
                  {distributionMode === "amount" ? d.displayVal : `${d.percentage}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL 3: Milestone Readiness (Status Donut) */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle size={15} style={{ color: "#16834B" }} />
              <h3 style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                Milestone Readiness
              </h3>
            </div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1E40AF", background: "#EFF6FF", padding: "1px 6px", borderRadius: 3 }}>
              6 Gates Defined
            </span>
          </div>

          {/* Donut Chart with Centered Status Counter */}
          <div style={{ position: "relative", width: "100%", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomReadinessTooltip />} />
                  <Pie
                    data={milestoneReadinessData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
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
              <div style={{ height: "100%", width: "100%", background: "#F8FAFC", borderRadius: 6 }} />
            )}

            {/* Center Label */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              <p style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gov-navy)", margin: 0, lineHeight: 1 }}>
                3 / 6
              </p>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#16834B", margin: "2px 0 0" }}>
                Milestones On Track
              </p>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 10px",
            fontSize: "0.7rem", borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 6
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16834B", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Completed:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink)" }}>2</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>In Progress:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink)" }}>1</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Pending:</span>
              <strong style={{ marginLeft: "auto", color: "#B45309" }}>1</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94A3B8", flexShrink: 0 }} />
              <span style={{ color: "var(--ink-mid)" }}>Locked:</span>
              <strong style={{ marginLeft: "auto", color: "var(--ink-soft)" }}>2</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
         7 & 8. FINANCIAL MILESTONE PLAN (TABLE) + NEXT MILESTONE DETAILS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 min-w-0">
        
        {/* Detailed Milestone Plan Table */}
        <Panel
          title={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 800 }}>
                FINANCIAL MILESTONE PLAN
              </span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--ink-soft)" }}>
                {displayedMilestones.length} Milestones Scheduled
              </span>
            </div>
          }
          icon={<Wallet size={15} style={{ color: "var(--gov-blue)" }} />}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="gov-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr>
                  <th style={{ width: 32, textAlign: "center" }}>#</th>
                  <th style={{ width: 100 }}>Stage</th>
                  <th>Milestone</th>
                  <th style={{ width: 110 }}>Amount</th>
                  <th>Trigger / Conditions</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 90, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedMilestones.map((m) => {
                  const sc = statusBadgeStyle(m.status);
                  const isPending = m.status === "Pending Approval";
                  return (
                    <tr key={m.id} style={{ background: isPending ? "#FFFDF5" : undefined }}>
                      <td style={{ fontWeight: 800, color: "var(--ink-soft)", textAlign: "center" }}>{m.id}</td>
                      <td>
                        <span style={{
                          fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px",
                          borderRadius: 4, background: "#F1F5F9", color: "var(--ink-mid)"
                        }}>
                          {m.stage}
                        </span>
                      </td>
                      <td>
                        <p style={{ fontWeight: isPending ? 800 : 700, color: "var(--ink)", margin: 0 }}>
                          {m.milestone}
                        </p>
                      </td>
                      <td style={{ fontWeight: 800, color: isPending ? "#B45309" : "var(--ink)", fontFamily: "monospace" }}>
                        {m.amount > 0 ? formatINR(m.amount) : "₹0"}
                      </td>
                      <td>
                        <span style={{ fontSize: "0.72rem", color: "var(--ink-mid)", lineHeight: 1.35 }}>
                          {m.trigger}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "3px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700,
                          background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                          {m.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {isPending && (
                          <button
                            onClick={() => setApprovalModal(true)}
                            style={{
                              fontSize: "0.72rem", fontWeight: 800, padding: "4px 12px",
                              borderRadius: 4, border: "1px solid #FDE68A",
                              background: "#D97706", color: "#FFFFFF",
                              cursor: "pointer", boxShadow: "0 1px 3px rgba(217, 119, 6, 0.2)",
                            }}
                          >
                            Review
                          </button>
                        )}
                        {m.status === "Released" && (
                          <button
                            onClick={() => setEvidenceModal(true)}
                            style={{
                              fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px",
                              borderRadius: 4, border: "1px solid var(--line)",
                              background: "#FFFFFF", color: "var(--ink-mid)", cursor: "pointer"
                            }}
                          >
                            View
                          </button>
                        )}
                        {m.status === "Completed" && (
                          <button
                            onClick={() => setEvidenceModal(true)}
                            style={{
                              fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px",
                              borderRadius: 4, border: "1px solid var(--line)",
                              background: "#FFFFFF", color: "var(--ink-mid)", cursor: "pointer"
                            }}
                          >
                            View
                          </button>
                        )}
                        {m.status === "Locked" && (
                          <span style={{ fontSize: "0.7rem", color: "var(--ink-soft)" }}>
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{
            marginTop: 12, padding: "8px 12px", borderRadius: 5,
            background: "#F8FAFC", border: "1px solid var(--line)",
            fontSize: "0.68rem", color: "var(--ink-soft)", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <ShieldCheck size={13} style={{ color: "var(--gov-blue)" }} />
            Single source of truth — Fund releases execute only upon validated cryptographic telemetry proof and officer authorization.
          </div>
        </Panel>

        {/* Next Milestone Details Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {nextMilestone && (
            <Panel
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.86rem", fontWeight: 800 }}>
                    NEXT MILESTONE DETAILS
                  </span>
                  <span style={{
                    fontSize: "0.62rem", fontWeight: 800, padding: "2px 7px",
                    borderRadius: 3, background: "#FEF3C7", color: "#B45309",
                    border: "1px solid #FDE68A", textTransform: "uppercase"
                  }}>
                    Pending Approval
                  </span>
                </div>
              }
              icon={<Clock size={15} style={{ color: "#D97706" }} />}
              accent="saffron"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                
                {/* Milestone summary header */}
                <div style={{ background: "#FFFBEB", padding: "12px 14px", borderRadius: 6, border: "1px solid #FDE68A" }}>
                  <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#78350F", margin: "0 0 4px" }}>
                    Mid-Pilot Evaluation (30 days)
                  </p>
                  <p style={{ fontSize: "1.35rem", fontWeight: 900, color: "#D97706", margin: "0 0 6px", fontFamily: "monospace" }}>
                    {formatINR(nextMilestone.amount)}
                  </p>
                  <p style={{ fontSize: "0.73rem", color: "#92400E", margin: 0, lineHeight: 1.4 }}>
                    To be released after successful 30-day pilot evaluation and KPI validation.
                  </p>
                </div>

                {/* Conditions Checklist */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <p className="gov-section-label" style={{ margin: 0, fontSize: "0.66rem" }}>Conditions Checklist</p>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16834B" }}>3 of 5 met</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {nextMilestone.conditions?.map((c, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        fontSize: "0.74rem", color: c.met ? "#166534" : "var(--ink-soft)",
                        fontWeight: c.met ? 600 : 400, padding: "6px 8px", borderRadius: 4,
                        background: c.met ? "#F0FDF4" : "#F8FAFC",
                        border: `1px solid ${c.met ? "#BBF7D0" : "var(--line)"}`
                      }}>
                        {c.met ? (
                          <CheckCircle2 size={13} style={{ color: "#16834B", flexShrink: 0, marginTop: 2 }} />
                        ) : (
                          <Clock size={13} style={{ color: "#D97706", flexShrink: 0, marginTop: 2 }} />
                        )}
                        <span style={{ lineHeight: 1.35 }}>{c.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
                  <button
                    onClick={() => setApprovalModal(true)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      width: "100%", padding: "10px 14px", borderRadius: 6,
                      border: "none", background: "#D97706",
                      color: "#FFFFFF", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(217, 119, 6, 0.25)",
                    }}
                  >
                    <FileCheck2 size={14} /> Review & Approve
                  </button>
                  <button
                    onClick={() => setEvidenceModal(true)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      width: "100%", padding: "8px 14px", borderRadius: 6,
                      border: "1px solid var(--line)", background: "#FFFFFF",
                      color: "var(--ink-mid)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <Eye size={13} /> View Evidence
                  </button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         9. FINANCIAL GOVERNANCE & QUICK LINKS
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Financial Governance */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px 18px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Shield size={16} style={{ color: "var(--gov-navy)" }} />
            <h3 style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
              FINANCIAL GOVERNANCE
            </h3>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: 0 }}>
            "All releases are subject to departmental approval, compliance checks and audit trail requirements."
          </p>
          <div style={{
            padding: "8px 12px", borderRadius: 5, background: "#EFF6FF", border: "1px solid #BFDBFE",
            fontSize: "0.7rem", color: "#1D4ED8", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
          }}>
            <Landmark size={13} />
            Integrated with Public Financial Management System (PFMS) & GeM Gateways.
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
          padding: "16px 18px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={16} style={{ color: "var(--gov-blue)" }} />
            <h3 style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
              QUICK LINKS
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              onClick={() => handleDownloadReport()}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 5,
                background: "#F8FAFC", border: "1px solid var(--line)", color: "var(--ink)",
                fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", textAlign: "left"
              }}
            >
              <FileText size={13} style={{ color: "var(--gov-blue)" }} />
              Budget Documents
            </button>
            <button
              onClick={() => handleDownloadReport()}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 5,
                background: "#F8FAFC", border: "1px solid var(--line)", color: "var(--ink)",
                fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", textAlign: "left"
              }}
            >
              <BarChart3 size={13} style={{ color: "var(--gov-blue)" }} />
              Utilization Reports
            </button>
            <button
              onClick={() => handleDownloadReport()}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 5,
                background: "#F8FAFC", border: "1px solid var(--line)", color: "var(--ink)",
                fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", textAlign: "left"
              }}
            >
              <ShieldCheck size={13} style={{ color: "#16834B" }} />
              Audit Trail
            </button>
            <button
              onClick={() => handleDownloadReport()}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 5,
                background: "#F8FAFC", border: "1px solid var(--line)", color: "var(--ink)",
                fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", textAlign: "left"
              }}
            >
              <Download size={13} style={{ color: "var(--gov-navy)" }} />
              Export to PDF
            </button>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
         10. REVIEW & APPROVE MODAL (Officer Decision Workflow)
         ═══════════════════════════════════════════════════════════════ */}
      {approvalModal && nextMilestone && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setApprovalModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#F8FAFC", borderRadius: "10px 10px 0 0"
            }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#D97706", margin: "0 0 2px" }}>
                  Officer Authorization Gate
                </p>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                  Review & Approve Milestone Release
                </h3>
              </div>
              <button
                onClick={() => setApprovalModal(false)}
                style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Milestone info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "#F8FAFC", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)" }}>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Milestone</p>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>{nextMilestone.milestone}</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Amount</p>
                  <p style={{ fontSize: "1.05rem", fontWeight: 900, color: "#D97706", margin: 0, fontFamily: "monospace" }}>{formatINR(nextMilestone.amount)}</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Purpose</p>
                  <p style={{ fontSize: "0.76rem", color: "var(--ink-mid)", margin: 0 }}>30-day evaluation report & detection accuracy verification</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Trigger</p>
                  <p style={{ fontSize: "0.76rem", color: "var(--ink-mid)", margin: 0 }}>30-day evaluation report + KPI ≥85%</p>
                </div>
              </div>

              {/* Conditions Checklist */}
              <div>
                <p className="gov-section-label" style={{ marginBottom: 6 }}>Pre-Release Evidence Gates</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {nextMilestone.conditions?.map((c, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: "0.76rem", color: c.met ? "#166534" : "var(--ink-mid)",
                      fontWeight: c.met ? 600 : 400, padding: "6px 10px", borderRadius: 4,
                      background: c.met ? "#F0FDF4" : "#F8FAFC",
                      border: `1px solid ${c.met ? "#BBF7D0" : "var(--line)"}`,
                    }}>
                      {c.met ? <CheckCircle2 size={13} style={{ color: "#16834B" }} /> : <Clock size={13} style={{ color: "#D97706" }} />}
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Notice */}
              <div style={{
                padding: "10px 14px", borderRadius: 6,
                background: "#FEF3C7", border: "1px solid #FDE68A",
                fontSize: "0.74rem", color: "#92400E", fontWeight: 600,
                display: "flex", alignItems: "flex-start", gap: 8,
              }}>
                <AlertTriangle size={15} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
                <span>Officer authorization generates a digitally-signed fund release voucher recorded in the blockchain-anchored audit trail.</span>
              </div>
            </div>

            {/* Modal actions: [ Approve Release ] [ Request More Evidence ] [ Reject ] */}
            <div style={{
              padding: "14px 20px", borderTop: "1px solid var(--line)",
              background: "#F8FAFC", borderRadius: "0 0 10px 10px",
              display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end",
            }}>
              <button
                onClick={() => handleApprovalAction("Approve Release")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 18px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 800,
                  background: "#16834B", color: "white", border: "none", cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(22, 131, 75, 0.2)",
                }}
              >
                <CheckCircle2 size={14} /> Approve Release
              </button>
              <button
                onClick={() => handleApprovalAction("Request More Evidence")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 700,
                  background: "#FFFFFF", color: "var(--gov-blue)", border: "1px solid #BFDBFE", cursor: "pointer",
                }}
              >
                <FileCheck2 size={14} /> Request More Evidence
              </button>
              <button
                onClick={() => handleApprovalAction("Reject")}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 700,
                  background: "#FFFFFF", color: "#DC2626", border: "1px solid #FECACA", cursor: "pointer",
                }}
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         11. EVIDENCE DETAIL MODAL
         ═══════════════════════════════════════════════════════════════ */}
      {evidenceModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setEvidenceModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{
              padding: "16px 20px", borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#F8FAFC", borderRadius: "10px 10px 0 0"
            }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gov-blue)", margin: "0 0 2px" }}>
                  Evidence Locker Records
                </p>
                <h3 style={{ fontSize: "0.96rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                  Cryptographic Evidence Trail
                </h3>
              </div>
              <button
                onClick={() => setEvidenceModal(false)}
                style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: "10px 12px", background: "#F8FAFC", border: "1px solid var(--line)", borderRadius: 6 }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gov-navy)", margin: "0 0 4px" }}>
                  Attached Telemetry & Milestone Proofs
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.74rem", color: "var(--ink-mid)", lineHeight: 1.6 }}>
                  <li>Signed Pilot Agreement & MoU (SHA-256: <code>e8b4...12f9</code>)</li>
                  <li>Initial Telemetry Ingestion Log (1,420,000 datapoints)</li>
                  <li>30-Day Automated Evaluation Report (Pending Officer Gate)</li>
                </ul>
              </div>
              <p style={{ fontSize: "0.72rem", color: "var(--ink-soft)", margin: 0 }}>
                All evidence artifacts are timestamped and cryptographically anchored in the PRAMAN Evidence Locker.
              </p>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", background: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setEvidenceModal(false)}
                style={{
                  padding: "6px 14px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 700,
                  background: "var(--gov-navy)", color: "#FFFFFF", border: "none", cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
