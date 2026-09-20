"use client";

import React, { useState, useMemo } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, AlertBanner, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Target, Sparkles, CheckCircle2, Users, ShieldCheck, ArrowRight,
  FileText, Building2, CalendarDays, Check, Landmark, X, Info,
  ChevronRight, AlertTriangle, Scale, Eye, SlidersHorizontal,
  Layers, BarChart2, ShieldAlert, FileCheck, HelpCircle, ExternalLink,
  Lock, RefreshCw, Send, CheckSquare, Square
} from "lucide-react";
import Link from "next/link";
import type { Recommendation } from "@/types/praman";

/* ═══════════════════════════════════════════════════════════════
   EVALUATION FRAMEWORK CRITERIA DEFINITION
   ═══════════════════════════════════════════════════════════════ */
const EVALUATION_CRITERIA = [
  { label: "Requirement Match", weight: "30%", maxPts: 30, desc: "Alignment to structured government requirement & domain needs" },
  { label: "Evidence Strength", weight: "25%", maxPts: 25, desc: "Independently verified pilot telemetry & field evidence" },
  { label: "Pilot Performance", weight: "20%", maxPts: 20, desc: "Demonstrated performance against core government KPI targets" },
  { label: "Implementation Risk", weight: "15%", maxPts: 15, desc: "Integration complexity, cybersecurity & dependency assessment" },
  { label: "Historical Performance", weight: "10%", maxPts: 10, desc: "Institutional memory track record across similar public deployments" },
];

/* ═══════════════════════════════════════════════════════════════
   DEFAULT / FALLBACK SAMPLE DATA FOR EXPLAINABILITY
   ═══════════════════════════════════════════════════════════════ */
function getStartupExplainability(recOrId: any, nameOrDomain?: string, scoreOverride?: number) {
  const rec = typeof recOrId === "object" && recOrId !== null ? recOrId : null;
  const name = rec?.startup?.name || (typeof nameOrDomain === "string" ? nameOrDomain : "Startup Solution");
  const dpiit = rec?.startup?.dpiit || "DPIIT-MH-2024-91823";
  const score = scoreOverride || rec?.score || 90;
  const capabilities = rec?.startup?.capabilities || ["AI Analytics", "Telemetry Sync", "Cloud Integration"];
  const problemDomain = rec ? nameOrDomain : "Smart Infrastructure";

  return {
    tagline: `${capabilities.join(" · ")} for ${problemDomain || "Smart Infrastructure"}`,
    location: "Maharashtra, India",
    dpiit,
    experienceYears: 4,
    whyFactors: [
      `High alignment with requirement specifications: ${score}% multi-criteria fit`,
      `Verified operational field telemetry evidence for ${capabilities[0] || "core system"}`,
      `Demonstrated performance across prior public deployments`,
      `Active DPIIT recognized startup entity with clean statutory compliance`,
      `Low integration overhead with existing departmental gateways`,
    ],
    evidenceCoverage: {
      total: 10,
      verified: Math.min(8, Math.max(5, Math.round(score / 12))),
      selfDeclared: 2,
      missing: 1,
      items: [
        `${name} Sandbox Field Telemetry Log — Independently Verified`,
        `Core Technical KPI Validation Dataset — Verified`,
        `CERT-In Cyber Compliance Assessment — In Progress`,
        `System Architecture & API Integration Dossier — Complete`,
        `Edge & Network Latency Benchmark Logs — Verified`,
      ],
    },
    risksAndGaps: [
      "Telemetry API compatibility: Requires live validation with departmental central gateway",
      "Field environmental variability: High monsoon / adverse condition telemetry requires continuous monitoring",
    ],
    scoreBreakdown: {
      reqMatch: Math.round(score * 0.3),
      evidence: Math.round(score * 0.25),
      pilotPerf: Math.round(score * 0.2),
      risk: Math.round(score * 0.15),
      historical: Math.round(score * 0.1),
      total: score,
    },
  };
}

export default function MatchingPage() {
  const {
    user, requirement, recommendations, pilot, matchStartups, shortlistStartup,
    shortlist, loading, error, setTrace, activeScenario, selectedStartupId, problem, selectedCaseId
  } = usePraman();

  // If user is a startup, render the dedicated applications view
  if (user?.role === "startup") {
    return <StartupApplicationsView user={user} />;
  }

  // Determine current active recommendations (at least 4 candidates per scenario)
  const currentRecs = recommendations.length > 0 ? recommendations : (activeScenario?.recommendations || []);

  // Active state
  const [selectedRecId, setSelectedRecId] = useState<string>("");
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "breakdown" | "evidence" | "risks">("overview");

  // Modals
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [targetShortlistRec, setTargetShortlistRec] = useState<any>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [evidenceRequestModalOpen, setEvidenceRequestModalOpen] = useState(false);
  const [evidenceRequestNote, setEvidenceRequestNote] = useState("");
  const [evidenceRequestSent, setEvidenceRequestSent] = useState(false);

  // Set default selection when recommendations load or scenario changes
  const effectiveSelectedId = selectedRecId || (
    currentRecs.find(r => r.startup.id === selectedStartupId)?.id || currentRecs[0]?.id || ""
  );
  const selectedRec = currentRecs.find(r => r.id === effectiveSelectedId) || currentRecs[0] || null;

  // Selected startup enriched data
  const selectedDetails = useMemo(() => {
    return getStartupExplainability(selectedRec, problem?.domain || activeScenario?.domain);
  }, [selectedRec, problem?.domain, activeScenario?.domain]);

  const canMatch = requirement?.status === "Approved";
  const hasMatched = currentRecs.length > 0;
  const canShortlist = hasMatched && (!pilot || pilot.startup !== selectedRec?.startup.name);

  // Toggle selection for comparison
  const toggleCompare = (id: string) => {
    setSelectedForCompare(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleOpenShortlist = (rec: any) => {
    setTargetShortlistRec(rec || selectedRec || currentRecs[0]);
    setShortlistModalOpen(true);
  };

  const handleConfirmShortlist = async () => {
    setShortlistModalOpen(false);
    const recToShortlist = targetShortlistRec || selectedRec || currentRecs[0];
    if (recToShortlist) {
      await shortlistStartup(recToShortlist.startup.id);
    } else {
      await shortlist();
    }
  };

  return (
    <div className="space-y-5 min-w-0 pb-12">
      {/* ═══════════════════════════════════════════════════════════
          1. PAGE HEADER
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9E1EA] pb-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B2A5B] bg-[#EEF5FC] px-2.5 py-0.5 rounded border border-[#BFDBFE]">
              Procurement Intelligence
            </span>
            <span className="text-[10px] font-semibold text-[#5E6B7E] flex items-center gap-1">
              <RefreshCw size={11} className="text-[#0B2A5B]" />
              Evaluation v1.2 · 20 Sep 2026 · 06:32 IST
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-[#172033] tracking-tight">
            STARTUP DISCOVERY & EXPLAINABLE MATCHING
          </h1>
          <p className="text-xs text-[#5E6B7E]">
            Discover, verify and evaluate startup solutions against the approved government requirement.
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {hasMatched ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]">
              <CheckCircle2 size={13} />
              <span>MATCHING COMPLETE</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
              <AlertTriangle size={13} />
              <span>{canMatch ? "READY FOR MATCHING" : "AWAITING REQ APPROVAL"}</span>
            </span>
          )}

          <button
            onClick={matchStartups}
            disabled={!canMatch || loading !== ""}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded transition-all shadow-sm ${
              !canMatch
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-[#0B2A5B] hover:bg-[#061727] text-white border border-[#0B2A5B]"
            }`}
          >
            <Target size={13} />
            <span>{hasMatched ? "Re-Run Matching Engine" : "Run Eligibility & Matching"}</span>
          </button>

          {hasMatched && !pilot && (
            <button
              onClick={() => handleOpenShortlist(selectedRec || currentRecs[0])}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded bg-[#16834B] hover:bg-[#136f3f] text-white transition-all shadow-sm"
            >
              <Users size={13} />
              <span>Shortlist for Pilot Review →</span>
            </button>
          )}

          {pilot && (
            <Link
              href="/pilots"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded bg-[#EEF5FC] text-[#0B2A5B] border border-[#BFDBFE] hover:bg-[#DBEAFE] transition-colors"
            >
              <FileCheck size={13} />
              <span>Go to Pilot Workspace</span>
            </Link>
          )}
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div className="flex items-center gap-2.5 rounded-lg px-4 py-3 bg-[#EEF5FC] border border-[#BFDBFE] border-l-4 border-l-[#0B2A5B]">
          <Sparkles size={16} className="text-[#0B2A5B] animate-spin" />
          <span className="text-xs font-bold text-[#0B2A5B]">{loading}…</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          2. REQUIREMENT SNAPSHOT (Compact Horizontal Card)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5E6B7E]">
                REQUIREMENT SNAPSHOT
              </span>
              <span className="text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#0B2A5B] px-2 py-0.5 rounded border border-[#CBD5E1]">
                {requirement?.id ? `REQ-MH-2026-${requirement.id}` : "REQ-MH-2026-1042"}
              </span>
              <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0] flex items-center gap-1">
                <Check size={10} /> Approved for Procurement
              </span>
            </div>
            <h2 className="text-sm font-bold text-[#172033]">
              {requirement?.title || "Smart Road Condition Monitoring using public transport telemetry"}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5E6B7E]">
              <span><strong>Department:</strong> {requirement?.department || "PWD Maharashtra"}</span>
              <span><strong>Location:</strong> {requirement?.location || "Pune"}</span>
              <span><strong>Domain:</strong> {requirement?.domain || "Urban Infrastructure"}</span>
              <span><strong>Tech:</strong> {requirement?.technology || "Computer Vision"}</span>
              <span><strong>Budget:</strong> {requirement?.budget || "₹50L – ₹1Cr"}</span>
              <span><strong>Timeline:</strong> {requirement?.timeline || "90 Days"}</span>
            </div>
          </div>

          <Link
            href="/requirements"
            className="self-start md:self-center inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-3 py-1.5 rounded border border-[#BFDBFE] transition-colors shrink-0"
          >
            <span>View Requirement</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3. MATCHING OVERVIEW (4 Summary Cards)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Candidate Solutions", value: "124", desc: "Startups in DPIIT database", icon: Users, tone: "blue" },
          { label: "Eligible Startups", value: "36", desc: "Passed deterministic gates", icon: ShieldCheck, tone: "green" },
          { label: "Evaluated Solutions", value: "12", desc: "Semantic & dense match", icon: Target, tone: "amber" },
          { label: "Shortlisted for Review", value: String(currentRecs.length > 0 ? currentRecs.length : 3), desc: "Multi-criteria ranked", icon: CheckCircle2, tone: "purple" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-[#D9E1EA] rounded-lg p-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">{item.label}</span>
                <Icon size={15} className="text-[#0B2A5B]" />
              </div>
              <p className="text-2xl font-black text-[#0B2A5B] mt-1 tracking-tight">{item.value}</p>
              <p className="text-[10px] text-[#5E6B7E] mt-0.5">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          4. PRAMAN MATCHING PIPELINE & METHODOLOGY
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#0B2A5B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              PRAMAN Matching Pipeline & Filtration Funnel
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-[#5E6B7E]">
            Hybrid BM25 + Dense Embeddings + RRF Fusion + TOPSIS Ranking
          </span>
        </div>

        {/* Funnel Flow */}
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { count: "124", label: "Candidates Discovered", sub: "DPIIT Repository" },
            { count: "36", label: "Eligible Startups", sub: "Gate 1 Pass" },
            { count: "12", label: "Semantically Matched", sub: "BM25 + Dense" },
            { count: "8", label: "Evidence Verified", sub: "Telemetry Validation" },
            { count: "3", label: "Shortlisted for Review", sub: "Final TOPSIS Rank" },
          ].map((step, i, arr) => (
            <div key={i} className="relative flex flex-col items-center p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA]">
              <span className="text-base font-black text-[#0B2A5B]">{step.count}</span>
              <span className="text-[10px] font-bold text-[#172033] mt-0.5 leading-tight">{step.label}</span>
              <span className="text-[9px] text-[#5E6B7E] mt-0.5">{step.sub}</span>
              {i < arr.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-0.5 border border-[#D9E1EA]">
                  <ArrowRight size={11} className="text-[#0B2A5B]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technical Sub-row */}
        <div className="pt-2 border-t border-[#D9E1EA] flex flex-wrap items-center justify-between text-[10px] text-[#5E6B7E] gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[#172033]">Execution Pipeline:</span>
            {["Hard Eligibility Filters", "Keyword Matching (BM25)", "Semantic Similarity", "Evidence Analysis", "Multi-Criteria Ranking"].map((s, idx, a) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="bg-[#EEF5FC] text-[#0B2A5B] px-1.5 py-0.5 rounded font-semibold border border-[#BFDBFE]">{s}</span>
                {idx < a.length - 1 && <span className="text-[#94A3B8]">→</span>}
              </span>
            ))}
          </div>
          <button
            onClick={() => setMethodModalOpen(true)}
            className="font-bold text-[#0B2A5B] hover:underline flex items-center gap-1"
          >
            <span>Inspect Algorithm & Weights</span>
            <ExternalLink size={10} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          5. EVALUATION FRAMEWORK (Criteria Weights Card)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-[#0B2A5B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              Evaluation Framework · Multi-Criteria Weight Distribution
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
              Total Weight: 100% ✓
            </span>
            <button
              onClick={() => setMethodModalOpen(true)}
              className="text-[10px] font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-2 py-0.5 rounded border border-[#BFDBFE]"
            >
              View Method
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {EVALUATION_CRITERIA.map((crit) => (
            <div key={crit.label} className="p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#172033]">{crit.label}</span>
                  <span className="text-[11px] font-black text-[#0B2A5B] bg-[#EEF5FC] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                    {crit.weight}
                  </span>
                </div>
                <p className="text-[9px] text-[#5E6B7E] mt-1 leading-snug">{crit.desc}</p>
              </div>
              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[#0B2A5B] h-full rounded-full"
                  style={{ width: crit.weight }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          6. MAIN WORKSPACE: TABLE (LEFT) + SELECTED SOLUTION (RIGHT)
          ═══════════════════════════════════════════════════════════ */}
      {hasMatched ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
          {/* LEFT: RECOMMENDED STARTUPS TABLE (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden">
              <div className="p-3.5 border-b border-[#D9E1EA] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                    RECOMMENDED STARTUPS — EVALUATION RESULTS
                  </h2>
                  <p className="text-[10px] text-[#5E6B7E]">
                    Ranked by multi-criteria TOPSIS optimization against Requirement REQ-MH-2026-1042
                  </p>
                </div>
                {selectedForCompare.length >= 2 && (
                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded bg-[#0B2A5B] text-white hover:bg-[#061727] transition-all shadow-sm self-start sm:self-auto"
                  >
                    <SlidersHorizontal size={12} />
                    <span>Compare Selected ({selectedForCompare.length})</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="gov-table w-full">
                  <thead>
                    <tr>
                      <th style={{ width: 34 }}>Select</th>
                      <th style={{ width: 44 }}>Rank</th>
                      <th>Startup</th>
                      <th>Eligibility</th>
                      <th>Evidence</th>
                      <th>Overall Score</th>
                      <th>Band</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecs.map((rec: any, idx: number) => {
                      const isSelected = (selectedRec?.id === rec.id) || (!selectedRec && idx === 0);
                      const isChecked = selectedForCompare.includes(rec.id);
                      const details = getStartupExplainability(rec.id, rec.startup?.name || "Startup", rec.score || 85);
                      const scoreVal = rec.score || details.scoreBreakdown.total;

                      return (
                        <tr
                          key={rec.id}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? "bg-[#F0F7FF] border-l-4 border-l-[#0B2A5B]" : "hover:bg-slate-50"
                          }`}
                          onClick={() => setSelectedRecId(rec.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => toggleCompare(rec.id)}
                              className="text-[#5E6B7E] hover:text-[#0B2A5B]"
                            >
                              {isChecked ? (
                                <CheckSquare size={15} className="text-[#0B2A5B]" />
                              ) : (
                                <Square size={15} />
                              )}
                            </button>
                          </td>
                          <td>
                            <span className={`font-black text-xs px-2 py-0.5 rounded ${
                              rec.rank === 1
                                ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                                : "bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]"
                            }`}>
                              #{rec.rank}
                            </span>
                          </td>
                          <td>
                            <p className="font-bold text-xs text-[#172033]">{rec.startup?.name}</p>
                            <p className="text-[10px] text-[#5E6B7E]">
                              {rec.startup?.capabilities?.slice(0, 2).join(" · ") || details.tagline}
                            </p>
                          </td>
                          <td>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]">
                              <CheckCircle2 size={10} />
                              <span>{rec.eligibility?.status ?? "PASS"}</span>
                            </span>
                          </td>
                          <td>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF5FC] text-[#0B2A5B] border border-[#BFDBFE]">
                              <FileCheck size={10} />
                              <span>{rec.rank === 1 ? "Verified" : rec.rank === 2 ? "Verified" : "Partial"}</span>
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="text-sm font-black text-[#0B2A5B] hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrace(kpiTrace(`${rec.startup?.name} · Score ${scoreVal}/100`, "PRAMAN Multi-Criteria Engine", String(scoreVal)));
                              }}
                            >
                              {scoreVal}
                            </button>
                            <span className="text-[10px] text-[#5E6B7E] ml-0.5">/100</span>
                          </td>
                          <td>
                            <Badge tone={rec.rank === 1 ? "gov" : "neutral"}>
                              {rec.band || (scoreVal >= 90 ? "High Match" : "Good Match")}
                            </Badge>
                          </td>
                          <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setSelectedRecId(rec.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded transition-colors ${
                                isSelected
                                  ? "bg-[#0B2A5B] text-white"
                                  : "bg-[#EEF5FC] text-[#0B2A5B] hover:bg-[#DBEAFE] border border-[#BFDBFE]"
                              }`}
                            >
                              <span>View Details →</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Compare Trigger Footer */}
              <div className="p-3 bg-[#F8FAFC] border-t border-[#D9E1EA] flex flex-wrap items-center justify-between text-xs text-[#5E6B7E] gap-2">
                <div className="flex items-center gap-2">
                  <Info size={13} className="text-[#0B2A5B]" />
                  <span>Select checkboxes above to compare multiple solutions side-by-side.</span>
                </div>
                {selectedForCompare.length >= 2 ? (
                  <button
                    onClick={() => setCompareModalOpen(true)}
                    className="font-bold text-[#0B2A5B] hover:underline"
                  >
                    Open Side-by-Side Comparison ({selectedForCompare.length}) →
                  </button>
                ) : (
                  <span className="text-[11px] italic text-[#94A3B8]">Select at least 2 startups to compare</span>
                )}
              </div>
            </div>

            {/* Quick Helper / Governance Tip */}
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#D9E1EA] text-xs text-[#5E6B7E] flex items-start gap-2.5">
              <ShieldAlert size={16} className="text-[#0B2A5B] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#172033]">Government Decision Support Standard</p>
                <p className="mt-0.5 leading-relaxed">
                  Matching rankings are deterministic and explainable. The PRAMAN algorithm generates decision recommendations
                  based on weighted technical evidence; final pilot authorization requires officer discretion.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: SELECTED SOLUTION INTELLIGENCE PANEL (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden sticky top-4">
              {/* Header */}
              <div className="p-4 border-b border-[#D9E1EA] bg-[#0B2A5B] text-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/70">
                    SELECTED SOLUTION INTELLIGENCE
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white border border-white/30">
                    Rank #{selectedRec?.rank ?? 1}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">
                  {selectedRec?.startup?.name || "SkylineAI Solutions"}
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  {selectedDetails.tagline}
                </p>
              </div>

              {/* Sub-Tabs */}
              <div className="flex border-b border-[#D9E1EA] bg-[#F8FAFC] text-xs font-bold text-[#5E6B7E]">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "breakdown", label: "Score Breakdown" },
                  { id: "evidence", label: "Evidence" },
                  { id: "risks", label: "Risks & Gaps" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-[#0B2A5B] text-[#0B2A5B] bg-white"
                        : "border-transparent hover:text-[#172033]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="p-4 space-y-4 text-xs">
                {/* ── TAB 1: OVERVIEW & WHY THIS SOLUTION ── */}
                {activeTab === "overview" && (
                  <div className="space-y-3.5">
                    {/* Startup Meta */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] text-[11px]">
                      <div>
                        <span className="text-[#5E6B7E]">DPIIT Reg:</span>
                        <p className="font-mono font-bold text-[#172033]">{selectedDetails.dpiit}</p>
                      </div>
                      <div>
                        <span className="text-[#5E6B7E]">HQ Location:</span>
                        <p className="font-bold text-[#172033]">{selectedDetails.location}</p>
                      </div>
                    </div>

                    {/* WHY THIS SOLUTION */}
                    <div className="rounded border border-[#BFDBFE] bg-[#EEF5FC] p-3 space-y-2">
                      <div className="flex items-center gap-1.5 text-[#0B2A5B]">
                        <Sparkles size={14} />
                        <h4 className="text-[11px] font-black uppercase tracking-wider">
                          WHY THIS SOLUTION?
                        </h4>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        {selectedDetails.whyFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#0A2540]">
                            <CheckCircle2 size={12} className="text-[#16834B] shrink-0 mt-0.5" />
                            <span className="leading-snug">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility Checks */}
                    {selectedRec?.eligibility?.checks && (
                      <div className="border border-[#D9E1EA] rounded-md overflow-hidden">
                        <div className="bg-[#F8FAFC] px-3 py-1.5 border-b border-[#D9E1EA] flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">
                            Deterministic Eligibility Gates
                          </span>
                          <span className="text-[10px] font-bold text-[#16834B]">ALL PASS</span>
                        </div>
                        <div className="divide-y divide-[#E2E8F0]">
                          {selectedRec.eligibility.checks.map((chk: any) => (
                            <div key={chk.code} className="px-3 py-1.5 flex items-center justify-between text-[11px]">
                              <span className="text-[#172033] font-medium">{chk.name}</span>
                              <span className="text-[#16834B] font-bold flex items-center gap-1">
                                <Check size={11} /> {chk.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 2: SCORE BREAKDOWN ── */}
                {activeTab === "breakdown" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#F8FAFC] p-2.5 rounded border border-[#D9E1EA]">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">Cumulative TOPSIS Score</span>
                        <p className="text-xl font-black text-[#0B2A5B]">
                          {selectedRec?.score || selectedDetails.scoreBreakdown.total} / 100
                        </p>
                      </div>
                      <Badge tone={selectedRec?.rank === 1 ? "gov" : "neutral"}>
                        {selectedRec?.band || "High Match"}
                      </Badge>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { label: "Requirement Match", score: selectedDetails.scoreBreakdown.reqMatch, max: 30 },
                        { label: "Evidence Strength", score: selectedDetails.scoreBreakdown.evidence, max: 25 },
                        { label: "Pilot Performance", score: selectedDetails.scoreBreakdown.pilotPerf, max: 20 },
                        { label: "Implementation Risk", score: selectedDetails.scoreBreakdown.risk, max: 15 },
                        { label: "Historical Performance", score: selectedDetails.scoreBreakdown.historical, max: 10 },
                      ].map((dim) => {
                        const pct = Math.round((dim.score / dim.max) * 100);
                        return (
                          <div key={dim.label} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-semibold text-[#172033]">{dim.label}</span>
                              <span className="font-bold text-[#0B2A5B]">{dim.score} / {dim.max} pts</span>
                            </div>
                            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-[#0B2A5B] h-full rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setTrace(kpiTrace(`${selectedRec?.startup?.name} Evaluation Breakdown`, "PRAMAN Multi-Criteria Engine", String(selectedDetails.scoreBreakdown.total)))}
                        className="text-[11px] font-bold text-[#0B2A5B] hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>Inspect Full Audit Log Trace</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: EVIDENCE COVERAGE ── */}
                {activeTab === "evidence" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#5E6B7E]">Evidence Verification Rate</span>
                        <p className="text-lg font-black text-[#0B2A5B]">
                          {selectedDetails.evidenceCoverage.verified} of {selectedDetails.evidenceCoverage.total} Verified
                        </p>
                      </div>
                      <div className="text-right text-[10px]">
                        <p className="text-[#16834B] font-bold">{selectedDetails.evidenceCoverage.verified} Verified</p>
                        <p className="text-[#D97706] font-bold">{selectedDetails.evidenceCoverage.selfDeclared} Self-declared</p>
                        <p className="text-[#94A3B8] font-bold">{selectedDetails.evidenceCoverage.missing} Missing</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-[#172033]">Supporting Telemetry & Documentation:</p>
                      <div className="divide-y divide-[#E2E8F0] border border-[#D9E1EA] rounded-md overflow-hidden">
                        {selectedDetails.evidenceCoverage.items.map((item, idx) => (
                          <div key={idx} className="p-2 bg-white flex items-start gap-2 text-[11px]">
                            <FileCheck size={13} className="text-[#16834B] shrink-0 mt-0.5" />
                            <span className="text-[#172033] leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/evidence"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded bg-[#EEF5FC] text-[#0B2A5B] border border-[#BFDBFE] font-bold text-xs hover:bg-[#DBEAFE] transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>Open Evidence Ledger</span>
                    </Link>
                  </div>
                )}

                {/* ── TAB 4: RISKS & GAPS ── */}
                {activeTab === "risks" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded bg-[#FEF3C7] border border-[#FDE68A] space-y-2">
                      <div className="flex items-center gap-1.5 text-[#B45309]">
                        <AlertTriangle size={14} />
                        <h4 className="text-[11px] font-bold uppercase tracking-wider">
                          Identified Risks & Data Gaps
                        </h4>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        {selectedDetails.risksAndGaps.map((risk, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[#92400E]">
                            <span className="shrink-0">•</span>
                            <span className="leading-snug">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA] text-[11px] text-[#5E6B7E]">
                      <p className="font-semibold text-[#172033] mb-1">Recommended Officer Mitigation:</p>
                      <p className="leading-relaxed">
                        Request baseline telemetry API verification before issuing the final 30-day pilot milestone sign-off.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEvidenceRequestSent(false);
                        setEvidenceRequestModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded bg-[#0B2A5B] text-white font-bold text-xs hover:bg-[#061727] transition-colors shadow-sm"
                    >
                      <Send size={12} />
                      <span>Request Additional Evidence</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-[#F8FAFC] border-t border-[#D9E1EA] space-y-2">
                {!pilot ? (
                  <button
                    onClick={() => handleOpenShortlist(selectedRec)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded bg-[#16834B] hover:bg-[#136f3f] text-white font-bold text-xs transition-all shadow-sm"
                  >
                    <Users size={14} />
                    <span>Shortlist {selectedRec?.startup?.name || "Selected Startup"} for Pilot Review →</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded bg-[#DCFCE7] border border-[#BBF7D0] flex items-center justify-center gap-2 text-xs font-bold text-[#16834B]">
                    <CheckCircle2 size={15} />
                    <span>Pilot Workspace Active ({pilot?.name || "Pilot Created"})</span>
                  </div>
                )}

                <p className="text-[10px] text-center text-[#5E6B7E]">
                  Shortlisting activates the controlled 90-day pilot validation workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Not Matched State */
        <div className="bg-white border border-[#D9E1EA] rounded-lg p-12 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#EEF5FC] border border-[#BFDBFE] flex items-center justify-center mx-auto text-[#0B2A5B]">
            <Target size={24} />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#172033]">
              Startup Matching Engine Ready
            </h3>
            <p className="text-xs text-[#5E6B7E]">
              {canMatch
                ? "Click 'Run Eligibility & Matching' to evaluate candidates against the approved government requirements."
                : "Requirements must be approved by the procurement officer before matching can execute."}
            </p>
          </div>
          <div>
            <button
              onClick={matchStartups}
              disabled={!canMatch || loading !== ""}
              className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded transition-all shadow-sm ${
                !canMatch
                  ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  : "bg-[#0B2A5B] hover:bg-[#061727] text-white"
              }`}
            >
              <Target size={14} />
              <span>{canMatch ? "Run Eligibility & Matching" : "Approve Requirements First"}</span>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          7. MATCHING DECISION TRAIL (Bottom Lifecycle)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#5E6B7E]">
            MATCHING DECISION TRAIL · PRAMAN PROCUREMENT LIFECYCLE
          </span>
          <span className="text-[10px] font-bold text-[#0B2A5B]">Current: Officer Review</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {[
            { label: "Requirement Approved", done: true },
            { label: "Eligibility Completed", done: true },
            { label: "Startup Discovery", done: true },
            { label: "Evidence Analysis", done: true },
            { label: "Explainable Ranking", done: true },
            { label: "Officer Review", current: true },
            { label: "Pilot Recommendation", pending: true },
          ].map((stage, i, arr) => (
            <React.Fragment key={stage.label}>
              <div className={`px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1.5 ${
                stage.current
                  ? "bg-[#0B2A5B] text-white shadow-sm"
                  : stage.done
                  ? "bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]"
                  : "bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]"
              }`}>
                {stage.done && <Check size={11} />}
                {stage.current && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                <span>{stage.label}</span>
              </div>
              {i < arr.length - 1 && <ChevronRight size={12} className="text-[#94A3B8]" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL 1: SHORTLIST CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════ */}
      {shortlistModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShortlistModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users size={18} />
                <h3 className="text-sm font-bold">SHORTLIST FOR PILOT REVIEW</h3>
              </div>
              <button
                onClick={() => setShortlistModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded bg-[#F8FAFC] border border-[#D9E1EA] space-y-1.5">
                <p className="font-semibold text-[#5E6B7E]">Selected Innovation Entity:</p>
                <p className="text-sm font-black text-[#0B2A5B]">
                  {targetShortlistRec?.startup?.name || "SkylineAI Solutions"}
                </p>
                <p className="text-[11px] text-[#5E6B7E]">
                  Rank #{targetShortlistRec?.rank ?? 1} · Overall Match Score: {targetShortlistRec?.score ?? 93}/100
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#EEF5FC] border border-[#BFDBFE] text-xs text-[#0B2A5B] space-y-1">
                <p className="font-bold">Next Stage: Pilot & Evidence Review</p>
                <p className="leading-relaxed">
                  This action moves the selected solution to the Pilot & Evidence review workspace. A 90-day sandbox trial
                  will be initialized for telemetry capture and milestone tracking.
                </p>
              </div>

              <div className="p-3 rounded bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Governance Policy:</strong> Shortlisting does not constitute final procurement approval.
                  All deployments remain subject to officer validation during the pilot stage.
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setShortlistModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#5E6B7E] hover:text-[#172033] bg-white border border-[#D9E1EA] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmShortlist}
                className="px-4 py-2 text-xs font-bold text-white bg-[#16834B] hover:bg-[#136f3f] rounded transition-colors shadow-sm"
              >
                Confirm Shortlist →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 2: SIDE-BY-SIDE COMPARISON MODAL
          ═══════════════════════════════════════════════════════════ */}
      {compareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCompareModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-4xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Side-by-Side Solution Comparison ({selectedForCompare.length} Startups)
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-[#5E6B7E]">
                Comparing multi-criteria scores, evidence coverage, and implementation profiles across selected innovation candidates.
              </p>

              <div className="overflow-x-auto border border-[#D9E1EA] rounded-lg">
                <table className="gov-table w-full text-xs">
                  <thead>
                    <tr>
                      <th style={{ width: 180 }}>Evaluation Dimension</th>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find(r => r.id === id);
                        return (
                          <th key={id} style={{ minWidth: 200 }}>
                            <span className="font-bold text-[#0B2A5B]">{rec?.startup?.name || id}</span>
                            <span className="block text-[10px] font-normal text-[#5E6B7E]">Rank #{rec?.rank ?? "-"}</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold text-[#172033]">Overall Match Score</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((r: any) => r.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return (
                          <td key={id}>
                            <span className="text-sm font-black text-[#0B2A5B]">{rec?.score || details.scoreBreakdown.total} / 100</span>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Requirement Match (30%)</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return <td key={id} className="font-semibold">{details.scoreBreakdown.reqMatch} / 30 pts</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Evidence Strength (25%)</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return <td key={id} className="font-semibold">{details.scoreBreakdown.evidence} / 25 pts</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Pilot Performance (20%)</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return <td key={id} className="font-semibold">{details.scoreBreakdown.pilotPerf} / 20 pts</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Implementation Risk (15%)</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return <td key={id} className="font-semibold">{details.scoreBreakdown.risk} / 15 pts</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Historical Performance (10%)</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return <td key={id} className="font-semibold">{details.scoreBreakdown.historical} / 10 pts</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Evidence Coverage</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find((item: any) => item.id === id);
                        const details = getStartupExplainability(id, rec?.startup?.name || "Startup", rec?.score || 85);
                        return (
                          <td key={id}>
                            <span className="font-bold text-[#16834B]">{details.evidenceCoverage.verified} Verified</span> / {details.evidenceCoverage.total} Total
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="font-bold text-[#172033]">Shortlist Action</td>
                      {selectedForCompare.map((id) => {
                        const rec = currentRecs.find(r => r.id === id);
                        return (
                          <td key={id}>
                            <button
                              onClick={() => {
                                setCompareModalOpen(false);
                                handleOpenShortlist(rec);
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-[#16834B] hover:bg-[#136f3f] rounded"
                            >
                              Shortlist
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end shrink-0">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 3: EVALUATION METHODOLOGY MODAL
          ═══════════════════════════════════════════════════════════ */}
      {methodModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setMethodModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-xl w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0B2A5B] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale size={18} />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  PRAMAN Explainable Matching Methodology
                </h3>
              </div>
              <button
                onClick={() => setMethodModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-[#172033]">1. Hard Eligibility Filtration</h4>
                <p className="text-[#5E6B7E] leading-relaxed">
                  Deterministic pre-checks: DPIIT entity active status, CERT-In cybersecurity policy conformity,
                  state incorporation, and zero conflict-of-interest declarations.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#172033]">2. Hybrid Retrieval (BM25 + Dense Vectors)</h4>
                <p className="text-[#5E6B7E] leading-relaxed">
                  Dual-track matching: BM25 keyword matching across requirement constraints + 768-dimensional dense vector
                  cosine similarity over technical capabilities and past deployment case studies.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[#172033]">3. Reciprocal Rank Fusion (RRF) & TOPSIS</h4>
                <p className="text-[#5E6B7E] leading-relaxed">
                  Multi-criteria decision analysis scoring each solution relative to an ideal positive and negative solution across
                  the 5 established weights (Requirement Match 30%, Evidence 25%, Pilot 20%, Risk 15%, History 10%).
                </p>
              </div>

              <div className="p-3 rounded bg-[#EEF5FC] border border-[#BFDBFE] text-[11px] text-[#0B2A5B]">
                <strong>Governance Note:</strong> All ranking computations are logged in the immutable audit ledger for transparency.
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end">
              <button
                onClick={() => setMethodModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#061727] rounded"
              >
                Close Methodology
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          MODAL 4: REQUEST ADDITIONAL EVIDENCE MODAL
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
              <div className="flex items-center gap-2">
                <Send size={16} />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Request Evidence from {selectedRec?.startup?.name || "Startup"}
                </h3>
              </div>
              <button
                onClick={() => setEvidenceRequestModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {evidenceRequestSent ? (
                <div className="p-4 rounded bg-[#DCFCE7] border border-[#BBF7D0] text-center space-y-2">
                  <CheckCircle2 size={24} className="text-[#16834B] mx-auto" />
                  <p className="font-bold text-[#16834B]">Official Evidence Request Dispatched</p>
                  <p className="text-[11px] text-[#16834B]">
                    A notice has been issued to {selectedRec?.startup?.name}. The startup portal will update upon document submission.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[#5E6B7E]">
                    Issue a formal evidence clarification request to the startup entity regarding identified gaps or incomplete test logs.
                  </p>
                  <div className="space-y-1">
                    <label className="font-bold text-[#172033]">Required Evidence / Clarification Details:</label>
                    <textarea
                      rows={3}
                      value={evidenceRequestNote}
                      onChange={(e) => setEvidenceRequestNote(e.target.value)}
                      placeholder="e.g. Please provide live API gateway logs and low-light test telemetry (<10 lux) from the municipal bus deployment..."
                      className="w-full p-2.5 rounded border border-[#D9E1EA] text-xs focus:outline-none focus:ring-1 focus:ring-[#0B2A5B]"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setEvidenceRequestModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-[#5E6B7E] hover:text-[#172033] bg-white border border-[#D9E1EA] rounded"
              >
                {evidenceRequestSent ? "Close" : "Cancel"}
              </button>
              {!evidenceRequestSent && (
                <button
                  onClick={() => setEvidenceRequestSent(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0B2A5B] hover:bg-[#061727] rounded transition-colors shadow-sm"
                >
                  Send Request →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STARTUP APPLICATIONS DIRECTORY VIEW (For Authenticated Startups)
   ═══════════════════════════════════════════════════════════════ */
function StartupApplicationsView({ user }: { user: any }) {
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const applications = [
    {
      id: 1,
      refId: "APP-MH-2026-1042",
      opportunity: "Road Damage Detection using public transport telemetry",
      department: "PWD Maharashtra",
      domain: "Computer Vision & Edge AI",
      location: "Pune Municipal Transport",
      appliedOn: "10 Aug 2026",
      status: "Selected for Pilot",
      statusTone: "green",
      nextAction: "Submit 30-Day Evidence",
      link: "/pilots",
      isDecision: false,
    },
    {
      id: 2,
      refId: "APP-MH-2026-1048",
      opportunity: "Smart Waste Management Solution",
      department: "Brihanmumbai Municipal Corporation",
      domain: "IoT Sensors & Waste Logistics",
      location: "Mumbai Suburban",
      appliedOn: "05 Aug 2026",
      status: "Under Review",
      statusTone: "blue",
      nextAction: "Upload Compliance Documents",
      link: "/evidence",
      isDecision: false,
    },
    {
      id: 3,
      refId: "APP-MH-2026-0891",
      opportunity: "Traffic Analytics Platform",
      department: "Pune Municipal Corporation",
      domain: "Traffic Telemetry & Video Analytics",
      location: "Pune Smart City",
      appliedOn: "28 Jul 2026",
      status: "Not Selected",
      statusTone: "red",
      nextAction: "View Official Decision",
      link: null,
      isDecision: true,
    },
  ];

  const filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);

  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Startup Portal · Applications"
        title="My Applications Directory"
        subtitle="Track submitted proposals, government verification gates, and official evaluation notices."
        actions={
          <Link
            href="/problems"
            className="bg-[#0B2A5B] hover:bg-[#061727] text-white text-xs font-bold py-2 px-3.5 rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileText size={14} />
            <span>Browse Open Challenges</span>
          </Link>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D9E1EA] pb-3">
        {["All", "Selected for Pilot", "Under Review", "Not Selected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              filter === tab
                ? "bg-[#0B2A5B] text-white"
                : "bg-white text-[#5E6B7E] hover:bg-slate-100 border border-[#D9E1EA]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E1EA] bg-[#F8FAFC]">
          <h2 className="text-sm font-bold text-[#172033]">Submitted Innovation Proposals ({filtered.length})</h2>
          <p className="text-[11px] text-[#5E6B7E]">Official verification and decision status for your entity</p>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>#</th>
                <th>Application Reference</th>
                <th>Opportunity / Challenge</th>
                <th>Department</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Next Action</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td className="font-bold text-[#5E6B7E]">{app.id}</td>
                  <td>
                    <span className="font-mono text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      {app.refId}
                    </span>
                  </td>
                  <td>
                    <p className="font-bold text-[#172033] text-xs">{app.opportunity}</p>
                    <p className="text-[10px] text-[#5E6B7E] mt-0.5">{app.domain} · {app.location}</p>
                  </td>
                  <td className="text-xs text-[#5E6B7E] whitespace-nowrap">{app.department}</td>
                  <td className="text-xs text-[#5E6B7E] whitespace-nowrap font-mono">{app.appliedOn}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        app.statusTone === "green"
                          ? "bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]"
                          : app.statusTone === "blue"
                          ? "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                          : "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="text-xs font-semibold text-[#172033] whitespace-nowrap">
                    {app.nextAction}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {app.isDecision ? (
                      <button
                        onClick={() => setDecisionModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-2.5 py-1 rounded border border-[#FECACA] transition-colors"
                      >
                        <span>View Decision</span>
                      </button>
                    ) : (
                      <Link
                        href={app.link || "/pilots"}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-2.5 py-1 rounded border border-[#BFDBFE] transition-colors"
                      >
                        <span>View Details</span>
                        <ChevronRight size={12} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Modal */}
      {decisionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDecisionModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#D9E1EA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626]">
                  <Landmark size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">
                    Official Decision Notice
                  </p>
                  <h3 className="text-sm font-black text-[#172033]">Application Not Selected</h3>
                </div>
              </div>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="p-1 text-[#5E6B7E] hover:text-[#172033] rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5E6B7E]">Opportunity:</span>
                  <span className="font-bold text-[#172033]">Traffic Analytics Platform</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E6B7E]">Government Department:</span>
                  <span className="font-bold text-[#172033]">Pune Municipal Corporation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E6B7E]">Date of Decision:</span>
                  <span className="font-bold text-[#172033]">20 Sept 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5E6B7E]">Official Decision:</span>
                  <span className="font-bold text-[#DC2626] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                    Not selected for this pilot
                  </span>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#172033] mb-1.5">Official Reason for Decision:</p>
                <div className="p-3.5 rounded bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs leading-relaxed font-medium">
                  “The submitted solution did not sufficiently demonstrate the required municipal-scale deployment capability for this pilot.”
                </div>
              </div>

              <div className="p-3 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1D4ED8] flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>
                  Official government communication issued by Pune Municipal Corporation in accordance with PRAMAN Innovation Procurement Rules.
                </span>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end">
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="bg-[#0B2A5B] text-white text-xs font-bold px-4 py-2 rounded hover:bg-[#061727] transition-colors"
              >
                Close Decision Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
