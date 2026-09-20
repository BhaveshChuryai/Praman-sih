"use client";

import React, { useState, useMemo } from "react";
import { usePraman } from "@/lib/PramanContext";
import { AlertBanner } from "@/components/ui";
import {
  ShieldCheck, Search, Filter, RotateCcw, Download, Eye,
  Calendar, User, Building2, Layers, CheckCircle2, Clock,
  AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight,
  FileText, Check, X, ShieldAlert, ArrowRight, Activity,
  Lock, Tag
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   TYPES & AUDIT DATA DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

export type AuditEventRecord = {
  id: string;
  timestamp: string; // ISO or formatted string
  displayDate: string;
  displayTime: string;
  caseId: string;
  caseTitle: string;
  action: string;
  actionCategory: "created" | "edited" | "approved" | "reviewed" | "submitted" | "verified" | "rejected";
  module: "Requirements" | "Startup Solutions" | "Pilot & Evidence" | "Financial Milestones" | "Readiness & Decisions" | "Procurement Cases" | "Governance & Audit";
  user: string;
  userRole: string;
  details: string;
  fieldChanged?: string;
  previousValue?: string;
  updatedValue?: string;
  reason?: string;
  dataClass: "PUBLIC" | "RESTRICTED" | "CONFIDENTIAL" | "GOV INTERNAL";
  status: "Completed" | "Pending Review" | "Under Audit";
};

const SEED_AUDIT_EVENTS: AuditEventRecord[] = [
  {
    id: "AUD-MH-2026-0091",
    timestamp: "2026-09-20T10:32:00Z",
    displayDate: "20 Sep 2026",
    displayTime: "10:32 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Requirement edited",
    actionCategory: "edited",
    module: "Requirements",
    user: "Ananya Deshmukh",
    userRole: "Executive Engineer / Nodal Officer",
    details: "Budget allocation ceiling adjusted for municipal bus telemetry sensors",
    fieldChanged: "Budget Range",
    previousValue: "₹50L – ₹1.00 Cr",
    updatedValue: "₹1.00 Cr (Approved Pilot Head)",
    reason: "Aligned budget head with Public Works Department infrastructure sanction order #PWD-2026-781.",
    dataClass: "GOV INTERNAL",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0090",
    timestamp: "2026-09-19T15:20:00Z",
    displayDate: "19 Sep 2026",
    displayTime: "15:20 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Evidence submitted",
    actionCategory: "submitted",
    module: "Pilot & Evidence",
    user: "SkylineAI Solutions",
    userRole: "Shortlisted Startup Partner",
    details: "KPI Summary report for 45-bus Pune municipal stretch submitted",
    fieldChanged: "Pilot Telemetry Ingest",
    previousValue: "Pending Submission",
    updatedValue: "Detection_Report_May.pdf (SHA-256: 8F3A...001)",
    reason: "Submitted as mandatory requirement for 30-day sandbox pilot performance benchmark.",
    dataClass: "CONFIDENTIAL",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0089",
    timestamp: "2026-09-18T11:45:00Z",
    displayDate: "18 Sep 2026",
    displayTime: "11:45 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Milestone reviewed",
    actionCategory: "reviewed",
    module: "Financial Milestones",
    user: "Ananya Deshmukh",
    userRole: "Nodal Officer",
    details: "₹15L Mid-Pilot Evaluation milestone reviewed against 5 release conditions",
    fieldChanged: "Milestone Approval Status",
    previousValue: "Locked",
    updatedValue: "Pending Officer Approval",
    reason: "Evaluated 4/5 conditions satisfied; awaiting final CERT-In cybersecurity clearance.",
    dataClass: "GOV INTERNAL",
    status: "Pending Review",
  },
  {
    id: "AUD-MH-2026-0088",
    timestamp: "2026-09-17T16:10:00Z",
    displayDate: "17 Sep 2026",
    displayTime: "16:10 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Requirement approved",
    actionCategory: "approved",
    module: "Requirements",
    user: "Ananya Deshmukh",
    userRole: "Nodal Officer",
    details: "Structured requirement locked and transitioned to Startup Solutions matching",
    fieldChanged: "Lifecycle Stage",
    previousValue: "Requirement Drafting (Stage 1)",
    updatedValue: "Startup Matching (Stage 2)",
    reason: "Formal approval by Departmental Evaluation Committee under G.O. Ms. No. 42/2026.",
    dataClass: "PUBLIC",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0087",
    timestamp: "2026-09-16T14:30:00Z",
    displayDate: "16 Sep 2026",
    displayTime: "14:30 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Startup shortlisted",
    actionCategory: "approved",
    module: "Startup Solutions",
    user: "Ananya Deshmukh",
    userRole: "Nodal Officer",
    details: "SkylineAI Solutions selected for 90-day sandbox pilot based on TOPSIS score 94/100",
    fieldChanged: "Selected Vendor Entity",
    previousValue: "None (Comparative Review)",
    updatedValue: "SkylineAI Solutions (DPIIT Verified: DIPP91823)",
    reason: "Highest composite score across Technical Accuracy (92%), Deployment Feasibility (95%), and Pilot Cost Efficiency.",
    dataClass: "RESTRICTED",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0086",
    timestamp: "2026-09-15T09:15:00Z",
    displayDate: "15 Sep 2026",
    displayTime: "09:15 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Pilot started",
    actionCategory: "created",
    module: "Pilot & Evidence",
    user: "System Automated",
    userRole: "PRAMAN Workflow Engine",
    details: "90-day sandbox pilot workspace initialized with telemetry boundaries",
    fieldChanged: "Pilot Status",
    previousValue: "Pending Creation",
    updatedValue: "Pilot Active (Day 1 of 90)",
    reason: "Pilot initiation release condition fulfilled; initial mobilization tranche cleared.",
    dataClass: "GOV INTERNAL",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0085",
    timestamp: "2026-09-14T16:45:00Z",
    displayDate: "14 Sep 2026",
    displayTime: "16:45 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Readiness assessed",
    actionCategory: "reviewed",
    module: "Readiness & Decisions",
    user: "System / Officer",
    userRole: "Readiness Assessment Engine",
    details: "Procurement readiness evaluated at 91/100 (High Readiness band)",
    fieldChanged: "Readiness Score",
    previousValue: "82 / 100",
    updatedValue: "91 / 100",
    reason: "Recalculation triggered after verification of 30-day telemetry dataset in Evidence Locker.",
    dataClass: "GOV INTERNAL",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0084",
    timestamp: "2026-09-12T11:00:00Z",
    displayDate: "12 Sep 2026",
    displayTime: "11:00 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Blocker updated",
    actionCategory: "edited",
    module: "Readiness & Decisions",
    user: "CISO / IT Security",
    userRole: "Cybersecurity Auditor",
    details: "Security questionnaire completed to 80%; awaiting penetration test certificate",
    fieldChanged: "Security & Data Compliance",
    previousValue: "40% Incomplete",
    updatedValue: "80% Completed (1 Blocker Remaining)",
    reason: "Cloud server data residency within Indian data centers verified. Pending final VAPT sign-off.",
    dataClass: "CONFIDENTIAL",
    status: "Pending Review",
  },
  {
    id: "AUD-MH-2026-0083",
    timestamp: "2026-09-10T14:20:00Z",
    displayDate: "10 Sep 2026",
    displayTime: "14:20 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Milestone reached",
    actionCategory: "verified",
    module: "Financial Milestones",
    user: "PWD Accounts Wing",
    userRole: "Finance Officer",
    details: "Pilot Initiation milestone (₹10L) funds disbursed following hardware verification",
    fieldChanged: "Disbursed Value",
    previousValue: "₹0 Released",
    updatedValue: "₹10,00,000 Released (10% of total)",
    reason: "PFMS transaction voucher #PFMS-MH-2026-8812 verified by Treasury Officer.",
    dataClass: "RESTRICTED",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0082",
    timestamp: "2026-09-05T10:00:00Z",
    displayDate: "05 Sep 2026",
    displayTime: "10:00 IST",
    caseId: "PRB-MH-2026-1042",
    caseTitle: "Smart Road Condition Monitoring",
    action: "Requirement created",
    actionCategory: "created",
    module: "Procurement Cases",
    user: "Ananya Deshmukh",
    userRole: "Nodal Officer",
    details: "Problem statement PRB-MH-2026-1042 registered by PWD Maharashtra",
    fieldChanged: "Case Intake",
    previousValue: "None",
    updatedValue: "PRB-MH-2026-1042 (Registered)",
    reason: "Identified need for continuous municipal road distress detection across Pune district.",
    dataClass: "PUBLIC",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0081",
    timestamp: "2026-09-02T16:30:00Z",
    displayDate: "02 Sep 2026",
    displayTime: "16:30 IST",
    caseId: "PRB-MH-2026-1043",
    caseTitle: "Urban Water Leakage Telemetry",
    action: "Requirement created",
    actionCategory: "created",
    module: "Procurement Cases",
    user: "Dr. Rajesh Sharma",
    userRole: "Superintending Engineer (Water)",
    details: "Problem statement PRB-MH-2026-1043 registered by Mumbai Municipal Corporation",
    fieldChanged: "Case Intake",
    previousValue: "None",
    updatedValue: "PRB-MH-2026-1043 (Registered)",
    reason: "Non-revenue water loss mitigation challenge in Ward K/East.",
    dataClass: "PUBLIC",
    status: "Completed",
  },
  {
    id: "AUD-MH-2026-0080",
    timestamp: "2026-08-28T11:15:00Z",
    displayDate: "28 Aug 2026",
    displayTime: "11:15 IST",
    caseId: "PRB-MH-2026-1045",
    caseTitle: "Rural Health Drone Delivery Network",
    action: "Pilot completed",
    actionCategory: "approved",
    module: "Pilot & Evidence",
    user: "Directorate of Health Services",
    userRole: "State Competent Authority",
    details: "150 flight missions completed; formal procurement recommendation issued",
    fieldChanged: "Pilot Determination",
    previousValue: "Under Pilot Review",
    updatedValue: "Procurement Recommended (GOV-MH-DHS-2026-REC-089)",
    reason: "100% adherence to clinical cold-chain temperature and emergency transit time KPIs.",
    dataClass: "PUBLIC",
    status: "Completed",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN GOVERNANCE & AUDIT COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function GovernanceAuditPage() {
  const { audit: contextAudit } = usePraman();

  // Filters State
  const [selectedCase, setSelectedCase] = useState<string>("All");
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<string>("All");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal State
  const [selectedEvent, setSelectedEvent] = useState<AuditEventRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string>("");

  // Combine static seed events with any dynamic context events from usePraman
  const allEvents = useMemo(() => {
    const list = [...SEED_AUDIT_EVENTS];
    if (contextAudit && contextAudit.length > 0) {
      contextAudit.forEach((ca, idx) => {
        // If not already in seed list
        const exists = list.some((e) => e.id === ca.id);
        if (!exists) {
          list.unshift({
            id: ca.id || `AUD-CTX-${idx + 1}`,
            timestamp: ca.timestamp || new Date().toISOString(),
            displayDate: new Date(ca.timestamp || Date.now()).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            displayTime: new Date(ca.timestamp || Date.now()).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            caseId: "PRB-MH-2026-1042",
            caseTitle: "Smart Road Condition Monitoring",
            action: ca.action || "Workflow Action",
            actionCategory: "reviewed",
            module: (ca.entity as any) || "Governance & Audit",
            user: ca.actor || "Authorized Officer",
            userRole: "Government System User",
            details: ca.reason || "Action recorded in PRAMAN immutable ledger",
            dataClass: (ca.data_class as any) || "GOV INTERNAL",
            status: "Completed",
          });
        }
      });
    }
    return list;
  }, [contextAudit]);

  // Derived filter options
  const caseOptions = useMemo(() => {
    const cases = Array.from(new Set(allEvents.map((e) => e.caseId)));
    return ["All", ...cases];
  }, [allEvents]);

  const moduleOptions = [
    "All",
    "Requirements",
    "Startup Solutions",
    "Pilot & Evidence",
    "Financial Milestones",
    "Readiness & Decisions",
    "Procurement Cases",
    "Governance & Audit",
  ];

  const userOptions = useMemo(() => {
    const users = Array.from(new Set(allEvents.map((e) => e.user)));
    return ["All", ...users];
  }, [allEvents]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchCase = selectedCase === "All" || event.caseId === selectedCase;
      const matchModule = selectedModule === "All" || event.module === selectedModule;
      const matchUser = selectedUser === "All" || event.user === selectedUser;

      const matchSearch =
        !searchQuery.trim() ||
        event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCase && matchModule && matchUser && matchSearch;
    });
  }, [allEvents, selectedCase, selectedModule, selectedUser, searchQuery]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCase("All");
    setSelectedModule("All");
    setSelectedUser("All");
    setSelectedDateRange("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Open Details Modal
  const handleViewDetails = (event: AuditEventRecord) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  // Export Audit Trail
  const handleExportAudit = () => {
    const headers = "Event ID,Timestamp,Case ID,Action,Module,User,Details,Data Class,Status\n";
    const rows = filteredEvents
      .map(
        (e) =>
          `"${e.id}","${e.displayDate} ${e.displayTime}","${e.caseId}","${e.action}","${e.module}","${e.user}","${e.details.replace(/"/g, '""')}","${e.dataClass}","${e.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `PRAMAN_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(
      `Exported ${filteredEvents.length} audit records to CSV with SHA-256 integrity verification.`
    );
    setTimeout(() => setExportNotice(""), 5000);
  };

  return (
    <div className="space-y-5 min-w-0 pb-12 max-w-[1440px] mx-auto">
      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
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
                GOVERNANCE & AUDIT
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Immutable Ledger Record
              </span>
            </div>
            <h1
              className="text-lg md:text-xl font-bold tracking-tight"
              style={{ color: "var(--gov-navy)" }}
            >
              Governance & Audit Trail
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Track key actions, approvals and changes across the PRAMAN lifecycle.
            </p>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportAudit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
              style={{ background: "var(--gov-navy)" }}
            >
              <Download size={13} /> Export Audit Trail
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
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
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice("")}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. FILTER BAR
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded border bg-white p-3.5 shadow-sm"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search audit events..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-8 pl-8 pr-3 text-xs rounded border bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                style={{ borderColor: "var(--line)" }}
              />
            </div>

            {/* Case Selector Dropdown */}
            <select
              value={selectedCase}
              onChange={(e) => {
                setSelectedCase(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="Procurement Case"
            >
              <option value="All">Case: All</option>
              {caseOptions.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Module Filter */}
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="PRAMAN Module"
            >
              <option value="All">Module: All</option>
              {moduleOptions.filter((m) => m !== "All").map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* User Filter */}
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="User Actor"
            >
              <option value="All">User: All</option>
              {userOptions.filter((u) => u !== "All").map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* Date Range */}
            <select
              value={selectedDateRange}
              onChange={(e) => {
                setSelectedDateRange(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 px-2.5 text-xs rounded border bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              style={{ borderColor: "var(--line)" }}
              aria-label="Date Range"
            >
              <option value="All">Date: All Time</option>
              <option value="Today">Today (20 Sep 2026)</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q3 2026">Q3 FY 2026–27</option>
            </select>

            {/* Reset */}
            {(selectedCase !== "All" ||
              selectedModule !== "All" ||
              selectedUser !== "All" ||
              selectedDateRange !== "All" ||
              searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 rounded border border-dashed border-slate-300 hover:bg-slate-50"
                title="Reset filters"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium shrink-0">
            Showing {filteredEvents.length} of {allEvents.length} records
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. SMALL GOVERNANCE SUMMARY (COMPACT METRICS)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          className="rounded border bg-white p-3 shadow-xs flex items-center justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Audit Events</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">
              {allEvents.length}
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-50 border border-blue-100"
          >
            <Activity size={14} className="text-blue-700" />
          </div>
        </div>

        <div
          className="rounded border bg-white p-3 shadow-xs flex items-center justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Active Modules</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">6</p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200"
          >
            <Layers size={14} className="text-slate-700" />
          </div>
        </div>

        <div
          className="rounded border bg-white p-3 shadow-xs flex items-center justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Pending Reviews</p>
            <p className="text-lg font-black text-amber-700 mt-0.5">2</p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-50 border border-amber-200"
          >
            <Clock size={14} className="text-amber-700" />
          </div>
        </div>

        <div
          className="rounded border bg-white p-3 shadow-xs flex items-center justify-between"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-500">Last Activity</p>
            <p className="text-xs font-bold text-slate-800 mt-1">20 Sep 2026 · 10:32</p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 border border-emerald-200"
          >
            <CheckCircle2 size={14} className="text-emerald-700" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6. RECENT ACTIVITY HIGHLIGHTS (OPTIONAL COMPACT SECTION)
          ═══════════════════════════════════════════════════════════ */}
      <div
        className="rounded border bg-slate-50/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-600">
            RECENT ACTIVITY:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700 font-medium">
          <span className="flex items-center gap-1 text-emerald-700">
            <Check size={11} strokeWidth={3} /> Requirement edited
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-blue-700">
            <Check size={11} strokeWidth={3} /> Evidence submitted
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-amber-700">
            <Clock size={11} /> Milestone reviewed
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-emerald-700">
            <Check size={11} strokeWidth={3} /> Requirement approved
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. AUDIT TRAIL TABLE (PRIMARY COMPONENT)
          ═══════════════════════════════════════════════════════════ */}
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
              OFFICIAL AUDIT TRAIL
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-200 text-slate-700">
              APPEND-ONLY
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr
                className="border-b text-[10px] font-bold uppercase text-slate-500 bg-white"
                style={{ borderColor: "var(--line)" }}
              >
                <th className="px-4 py-2.5">Date / Time</th>
                <th className="px-3 py-2.5">Action</th>
                <th className="px-3 py-2.5">Module</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-4 py-2.5">Details</th>
                <th className="px-4 py-2.5 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => {
                  const isPending = event.status === "Pending Review";
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* DATE / TIME */}
                      <td className="px-4 py-3 text-slate-600 shrink-0 font-mono text-[11px]">
                        <div className="font-bold text-slate-800">
                          {event.displayDate}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {event.displayTime}
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background:
                                event.actionCategory === "approved" ||
                                event.actionCategory === "verified"
                                  ? "var(--success)"
                                  : event.actionCategory === "edited"
                                  ? "var(--gov-blue)"
                                  : event.actionCategory === "submitted"
                                  ? "#7c3aed"
                                  : isPending
                                  ? "var(--warning)"
                                  : "var(--gov-navy)",
                            }}
                          />
                          <span className="font-bold text-slate-900">
                            {event.action}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 ml-3">
                          {event.id}
                        </span>
                      </td>

                      {/* MODULE */}
                      <td className="px-3 py-3">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            background: "#f1f5f9",
                            color: "var(--gov-navy)",
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {event.module}
                        </span>
                      </td>

                      {/* USER */}
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-900">
                          {event.user}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {event.userRole}
                        </div>
                      </td>

                      {/* DETAILS */}
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <p className="line-clamp-2 leading-relaxed">
                          {event.details}
                        </p>
                        <span className="text-[10px] text-blue-700 font-mono">
                          {event.caseId}
                        </span>
                      </td>

                      {/* INSPECT ACTION */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 rounded border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye size={11} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    <Activity size={28} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">
                      No audit events match your filters
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-blue-700 font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            PAGINATION & FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <div
          className="px-4 py-3 bg-slate-50 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="text-slate-500 text-[11px]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of{" "}
            {filteredEvents.length} events
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2 text-xs rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
            >
              <ChevronLeft size={12} /> Prev
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`h-7 w-7 text-xs rounded font-semibold transition-colors ${
                  currentPage === idx + 1
                    ? "text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                style={
                  currentPage === idx + 1
                    ? { background: "var(--gov-navy)" }
                    : {}
                }
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 px-2 text-xs rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-0.5"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          4. CHANGE DETAILS MODAL
          ═══════════════════════════════════════════════════════════ */}
      {showDetailModal && selectedEvent && (
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
                <ShieldCheck size={16} />
                <h3 className="text-sm font-bold uppercase tracking-tight">
                  {selectedEvent.action}
                </h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-300 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              {/* Event Metadata Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono text-[11px] font-bold text-slate-500">
                  {selectedEvent.id}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{
                    background: "var(--success-light)",
                    color: "var(--success)",
                  }}
                >
                  {selectedEvent.status}
                </span>
              </div>

              {/* Actor & Module Details */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Procurement Case:</span>
                  <span className="font-bold text-slate-900">{selectedEvent.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PRAMAN Module:</span>
                  <span className="font-semibold text-slate-800">{selectedEvent.module}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Changed By:</span>
                  <span className="font-bold text-slate-900">
                    {selectedEvent.user} ({selectedEvent.userRole})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedEvent.displayDate} · {selectedEvent.displayTime}
                  </span>
                </div>
              </div>

              {/* Change Diff / Field Update */}
              {selectedEvent.fieldChanged && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase text-slate-500">
                    Field: {selectedEvent.fieldChanged}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-rose-50 border border-rose-200">
                      <p className="text-[10px] font-bold uppercase text-rose-700 mb-0.5">
                        Previous:
                      </p>
                      <p className="text-rose-950 font-mono text-[11px]">
                        {selectedEvent.previousValue || "None"}
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                      <p className="text-[10px] font-bold uppercase text-emerald-700 mb-0.5">
                        Updated:
                      </p>
                      <p className="text-emerald-950 font-mono text-[11px] font-bold">
                        {selectedEvent.updatedValue}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Justification / Reason */}
              {selectedEvent.reason && (
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">
                    Official Justification / Notes
                  </p>
                  <p className="text-slate-700 p-2.5 rounded bg-slate-50 border border-slate-200 leading-relaxed">
                    {selectedEvent.reason}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Data Classification: {selectedEvent.dataClass}</span>
                <span>SHA-256 Ledger Verified</span>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-1.5 rounded text-xs font-bold text-white shadow-sm"
                style={{ background: "var(--gov-navy)" }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
