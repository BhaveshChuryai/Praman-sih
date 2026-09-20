"use client";

import React, { useState } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, AlertBanner } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  TrendingUp, CheckCircle2, MapPin, Clock, Building2,
  ShieldCheck, ArrowRight, Layers, HelpCircle, Check,
  AlertTriangle, RefreshCw, Send, CheckCircle, FileText
} from "lucide-react";

export default function ScalePage() {
  const {
    activeScenario, selectedCaseId, pilot, scale,
    requestConsent, recordAuditEvent, loading, error
  } = usePraman();

  // Scale data fallback from activeScenario if context scale is loading
  const scaleData = activeScenario?.scale;
  const pilotData = pilot || activeScenario?.pilot;

  // Local consent state for interactive demo toggles
  const [targetDeps, setTargetDeps] = useState<any[]>(scaleData?.targetDepartments || [
    {
      id: "tgt-1",
      department: "Mumbai Municipal Corporation",
      domain: "Urban Road & Transport",
      potentialUse: "BEST Municipal Bus Network Deployment (60 Routes)",
      compatibility: 94,
      status: "PENDING DEPARTMENT CONSENT",
      actionRequired: "Evaluate adaptation",
    },
    {
      id: "tgt-2",
      department: "Nashik Municipal Corporation",
      domain: "Smart City Infrastructure",
      potentialUse: "City Solid Waste & Sanitation Vehicle Telemetry",
      compatibility: 87,
      status: "NOT STARTED",
      actionRequired: "Request review",
    },
    {
      id: "tgt-3",
      department: "Nagpur PWD Division",
      domain: "State Highways & Ring Road",
      potentialUse: "Highway Patrol & State Road Surface Surveillance",
      compatibility: 91,
      status: "UNDER REVIEW",
      actionRequired: "Review pilot evidence",
    },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleConsentAction = (deptId: string, deptName: string) => {
    setTargetDeps((prev: any[]) =>
      prev.map((d) => {
        const dId = d.id || d.department;
        if (dId === deptId || d.department === deptName) {
          const nextStatus =
            d.status === "NOT STARTED"
              ? "PENDING DEPARTMENT CONSENT"
              : d.status === "PENDING DEPARTMENT CONSENT"
              ? "UNDER REVIEW"
              : "CONSENT RECORDED";
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );

    recordAuditEvent?.({
      action: "SCALE_CONSENT_REQUESTED",
      stage: "Scale & Reuse",
      details: `Dispatched pilot evidence pack & replication consent request to ${deptName} for ${selectedCaseId}`,
    });

    setToastMsg(`Replication evaluation request dispatched to ${deptName}.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONSENT RECORDED":
        return <Badge tone="signal">Consent Recorded</Badge>;
      case "UNDER REVIEW":
        return <Badge tone="blue">Under Review</Badge>;
      case "PENDING DEPARTMENT CONSENT":
        return <Badge tone="amber">Pending Review</Badge>;
      case "NOT STARTED":
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Not Started</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1450px] mx-auto min-w-0 pb-16">
      {/* ═══════════════════════════════════════════════════════════
          PAGE HEADER
          ═══════════════════════════════════════════════════════════ */}
      <GovPageHeader
        eyebrow="Institutional Memory & Replication Intelligence"
        title="SCALE & INSTITUTIONAL REUSE"
        subtitle="Translate verified pilot evidence, technical learnings, and procurement precedents into scalable inter-departmental replication."
        recordId={selectedCaseId}
      />

      {toastMsg && (
        <div className="flex items-center gap-2.5 rounded-lg p-3 bg-[#EFF6FF] border border-[#BFDBFE] border-l-4 border-l-[#1D4ED8] text-xs text-[#1E40AF] font-bold shadow-sm">
          <CheckCircle2 size={16} className="text-[#1D4ED8] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {error && <AlertBanner type="error" message={error} />}

      {/* ═══════════════════════════════════════════════════════════
          A. SOURCE PILOT SUMMARY CARD
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#D9E1EA] bg-white shadow-sm overflow-hidden">
        <div className="bg-[#0B2A5B] px-5 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#93C5FD]" />
            <h2 className="text-xs font-bold uppercase tracking-wider">
              A. SOURCE PILOT PROVENANCE
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded text-[#93C5FD]">
            {activeScenario?.display_id || selectedCaseId}
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">
              Pilot Title & Challenge
            </span>
            <p className="font-bold text-[#172033] text-sm">
              {(pilotData as any)?.title || (pilotData as any)?.name || activeScenario?.title || "Smart Road Condition Monitoring"}
            </p>
            <p className="text-[11px] text-[#5E6B7E] flex items-center gap-1">
              <Building2 size={12} /> {(pilotData as any)?.department || activeScenario?.department}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">
              Shortlisted Startup & Duration
            </span>
            <p className="font-bold text-[#0B2A5B] text-sm">
              {(pilotData as any)?.startup || activeScenario?.recommendations?.[0]?.startup?.name || "SkylineAI Solutions"}
            </p>
            <p className="text-[11px] text-[#5E6B7E] flex items-center gap-1">
              <Clock size={12} /> {(pilotData as any)?.duration_days || 90} Days Pilot ({(pilotData as any)?.status || "Evaluation"})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">
              Key KPI Results & Verification
            </span>
            <p className="font-bold text-[#16834B]">
              {scaleData?.keyKpiResults || "88.4% Detection Accuracy (Target ≥85%)"}
            </p>
            <p className="text-[11px] text-[#5E6B7E]">
              Continuous edge inference validated against baseline ground truth.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E6B7E]">
              Pilot Outcome & Evidence Locker
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]">
                {scaleData?.pilotOutcome || "Pilot Ready for Scale"}
              </span>
            </div>
            <p className="text-[11px] text-[#5E6B7E]">
              {scaleData?.evidenceStatus || "17/18 Cryptographic Proofs Verified"}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          B. WHY SCALE? (POLICY & REUSE CALLOUT)
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 flex items-start gap-3 shadow-sm">
        <div className="p-2 rounded bg-white border border-[#BFDBFE] text-[#1D4ED8] shrink-0 mt-0.5">
          <TrendingUp size={18} />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#1D4ED8] uppercase tracking-wider text-[10px]">
            B. WHY SCALE? — THE PRAMAN INSTITUTIONAL REPLICATION PRINCIPLE
          </span>
          <p className="text-[#1E40AF] leading-relaxed">
            {scaleData?.reason ||
              "A successful pilot provides reusable evidence, certified hardware benchmarks, and deployment learnings for similar municipal and state departments — eliminating redundant pilot cycles while preserving sovereign, independent evaluation for each target department."}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          C. REPLICATION OPPORTUNITIES & TARGET DEPARTMENTS
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#D9E1EA] bg-white shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              C. REPLICATION OPPORTUNITIES
            </h3>
            <p className="text-[11px] text-[#5E6B7E]">
              Identified target departments with matching civic problem topology and high technical compatibility.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2.5 py-1 rounded border border-[#BFDBFE]">
            3 Opportunities Identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {targetDeps.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="rounded-lg border border-[#D9E1EA] bg-[#F8FAFC] p-4 space-y-3 hover:border-[#0B2A5B] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-[#5E6B7E] tracking-wider">
                    {item.domain}
                  </p>
                  <h4 className="font-bold text-[#172033] text-sm">
                    {item.department}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-[#16834B]">
                    {item.compatibility}%
                  </span>
                  <p className="text-[9px] text-[#5E6B7E] uppercase font-bold">Compatibility</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-white border border-[#E2E8F0] text-xs text-[#334155]">
                <span className="font-bold text-[#172033] block mb-0.5">Potential Use Case:</span>
                {item.potentialUse}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <div>{getStatusBadge(item.status)}</div>
                <button
                  onClick={() => handleConsentAction(item.id, item.department)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2A5B] hover:text-[#1D4ED8] bg-white border border-[#D9E1EA] px-2.5 py-1 rounded shadow-2xs hover:bg-slate-50"
                >
                  <span>{item.status === "CONSENT RECORDED" ? "Review Record" : "Request Consent"}</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          D. ADAPTATION REQUIREMENTS (COMPARISON TABLE)
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#D9E1EA] bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E1EA] bg-[#F8FAFC]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
            D. ADAPTATION REQUIREMENTS & TECHNICAL GAP ANALYSIS
          </h3>
          <p className="text-[11px] text-[#5E6B7E]">
            Specific contextual and architectural modifications needed to deploy in target environments.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EEF5FC] text-[#0B2A5B] border-b border-[#D9E1EA] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-4">Source Pilot Spec</th>
                <th className="py-2.5 px-4">Target Department</th>
                <th className="py-2.5 px-4">Required Adaptation</th>
                <th className="py-2.5 px-4">Effort Level</th>
                <th className="py-2.5 px-4">Readiness Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              {(scaleData?.adaptations || [
                {
                  sourceSpec: "Pune GIS & PMPML bus route mapping",
                  targetDept: "Mumbai Municipal Corporation (BEST)",
                  adaptation: "GIS route shapefile re-indexing & depot power calibrations",
                  effort: "Medium",
                  status: "Required",
                },
                {
                  sourceSpec: "PWD Maharashtra state road maintenance workflow",
                  targetDept: "Nashik Municipal Corporation",
                  adaptation: "Sanitation & road engineering joint ticket dispatch rules",
                  effort: "Medium",
                  status: "Required",
                },
                {
                  sourceSpec: "Edge AI camera pods (45 municipal buses)",
                  targetDept: "Nagpur PWD Division (60 vehicles)",
                  adaptation: "Fleet vehicle camera mount calibration & 4G APN SIM setup",
                  effort: "Low",
                  status: "Ready",
                },
              ]).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-[#172033]">{row.sourceSpec}</td>
                  <td className="py-3 px-4 font-semibold text-[#0B2A5B]">{row.targetDept}</td>
                  <td className="py-3 px-4">{row.adaptation}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.effort === "Low" ? "bg-[#DCFCE7] text-[#16834B]" : "bg-[#FEF3C7] text-[#B45309]"
                    }`}>
                      {row.effort} Effort
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {row.status === "Ready" ? (
                      <span className="text-[#16834B] flex items-center gap-1">
                        <CheckCircle2 size={13} /> Ready
                      </span>
                    ) : (
                      <span className="text-[#D97706] flex items-center gap-1">
                        <Clock size={13} /> {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          E. REPLICATION READINESS DIMENSIONS
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 rounded-lg border border-[#D9E1EA] bg-white shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9E1EA] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                E. REPLICATION READINESS DIMENSIONS
              </h3>
              <p className="text-[11px] text-[#5E6B7E]">
                Deterministic evaluation across compatibility, data sovereignty, and evidence portability.
              </p>
            </div>
            <span className="text-xs font-black text-[#16834B]">
              Score: {scaleData?.replicationReadinessScore || 92}/100
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {(scaleData?.readinessDimensions || [
              { name: "Technical Compatibility", score: 20, max: 20, desc: "Standardized Edge AI camera interface & REST API endpoints" },
              { name: "Operational Compatibility", score: 18, max: 20, desc: "Standard municipal transport shift maintenance schedule" },
              { name: "Data Compatibility", score: 19, max: 20, desc: "Open OGC GIS and geoJSON spatial compliance" },
              { name: "Evidence Reusability", score: 20, max: 20, desc: "Verified 30-day accuracy benchmarks legally usable as tender reference" },
              { name: "Integration Effort", score: 15, max: 20, desc: "Requires 2 weeks for municipal GIS shapefile import" },
            ]).map((dim: any, i: number) => (
              <div key={i} className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-bold text-[#172033]">{dim.name}</p>
                  <p className="text-[11px] text-[#5E6B7E]">{dim.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-[#0B2A5B]">{dim.score} / {dim.max}</span>
                  <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#16834B] h-full rounded-full"
                      style={{ width: `${(dim.score / dim.max) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Time Savings Estimate */}
        <div className="lg:col-span-4 rounded-lg border border-[#D9E1EA] bg-white shadow-sm p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-[#D9E1EA] pb-2">
              <TrendingUp size={16} className="text-[#16834B]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                ESTIMATED EFFICIENCY SAVINGS
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Projected Public Savings
              </span>
              <p className="text-2xl font-black text-[#16834B]">
                {scaleData?.estimated_scale_savings || "₹45.0 Lakh"}
              </p>
              <p className="text-[11px] text-[#166534]">
                Avoids 3 duplicate pilot tenders and speeds rollout by ~4 months.
              </p>
            </div>
            <p className="text-xs text-[#5E6B7E] leading-relaxed">
              Target departments can reuse verified accuracy evidence to fast-track procurement under Rule 149 of General Financial Rules (GFR).
            </p>
          </div>

          <div className="p-3 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1D4ED8]">
            <span className="font-bold block">GeM Direct Replication:</span>
            Tender specifications can be cloned with departmental consent directly into the GeM portal.
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          F. DEPARTMENT CONSENT & ACTION TABLE
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#D9E1EA] bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E1EA] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">
              F. TARGET DEPARTMENT CONSENT & REPLICATION RECORD
            </h3>
            <p className="text-[11px] text-[#5E6B7E]">
              Autonomous departmental sign-offs recorded in the sovereign audit ledger.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#5E6B7E]">
            Human Authority: Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EEF5FC] text-[#0B2A5B] border-b border-[#D9E1EA] uppercase text-[10px] font-bold tracking-wider">
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Review Status</th>
                <th className="py-2.5 px-4">Required Action</th>
                <th className="py-2.5 px-4 text-right">Action Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
              {targetDeps.map((dept: any, idx: number) => (
                <tr key={dept.id || idx} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 font-bold text-[#172033] flex items-center gap-2">
                    <Building2 size={14} className="text-[#0B2A5B]" />
                    {dept.department}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(dept.status)}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#5E6B7E]">
                    {dept.actionRequired}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleConsentAction(dept.id, dept.department)}
                      className="px-3 py-1.5 rounded text-xs font-bold bg-[#0B2A5B] text-white hover:bg-[#092248] transition-colors shadow-2xs"
                    >
                      {dept.status === "CONSENT RECORDED" ? "View Consent" : "Advance Consent →"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          G. GOVERNANCE & SOVEREIGNTY POLICY NOTE
          ═══════════════════════════════════════════════════════════ */}
      <div className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7] p-4 text-xs text-[#92400E] flex items-start gap-3 shadow-sm">
        <AlertTriangle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block uppercase tracking-wider text-[10px] text-[#B45309] mb-0.5">
            G. MANDATORY GOVERNANCE & SOVEREIGNTY NOTE
          </span>
          <p className="leading-relaxed">
            Scaling requires each target department to independently consent, evaluate, and approve. PRAMAN provides evidence-backed recommendations and replication packs; competent departmental authorities retain complete sovereignty over final procurement decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
