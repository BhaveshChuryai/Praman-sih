"use client";

import { useState } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, Action, AlertBanner, kpiTrace, OfficialRecordHeader, RecordMeta } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Target, Sparkles, CheckCircle2, Users, ShieldCheck, ArrowRight,
  FileText, Building2, CalendarDays, Check, Landmark, X, Info, Upload, ChevronRight
} from "lucide-react";
import Link from "next/link";

const CRITERIA = [
  { label: "Requirement Match",    weight: "30%", desc: "Alignment to structured government requirement" },
  { label: "Evidence Strength",    weight: "25%", desc: "Independently verified pilot evidence quality" },
  { label: "Pilot Performance",    weight: "20%", desc: "Demonstrated performance against KPI targets" },
  { label: "Implementation Risk",  weight: "15%", desc: "Integration complexity & dependency assessment" },
  { label: "Historical Performance",weight: "10%", desc: "Track record from institutional memory" },
];

export default function MatchingPage() {
  const { user, requirement, recommendations, pilot, matchStartups, shortlist, loading, error, setTrace } = usePraman();

  if (user?.role === "startup") {
    return <StartupApplicationsView user={user} />;
  }

  const canMatch = requirement?.status === "Approved";
  const canShortlist = recommendations.length > 0 && !pilot;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <GovPageHeader
        eyebrow="Procurement Intelligence"
        title="AI-Assisted Startup Evaluation"
        subtitle="Eligibility checks + evidence-weighted ranking for Government Requirement REQ-MH-2026-1042"
        actions={
          <>
            <Action onClick={matchStartups} label="Run Eligibility & Matching" icon={<Target size={13} />}
              disabled={!canMatch || !!recommendations.length} size="sm" />
            <Action onClick={shortlist} label="Shortlist Top-Ranked Startup" icon={<Users size={13} />}
              disabled={!canShortlist} muted={!canShortlist} size="sm" />
          </>
        }
      />

      {error && <AlertBanner type="error" message={error} />}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 4, padding: "10px 14px", background: "var(--gov-blue-light)", border: "1px solid var(--gov-blue-border)", borderLeft: "3px solid var(--gov-blue)" }}>
          <Sparkles size={13} style={{ color: "var(--gov-blue)" }} className="animate-pulse" />
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--gov-blue)" }}>{loading}…</span>
        </div>
      )}

      {/* Evaluation Criteria */}
      <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
        <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)", background: "var(--gov-blue)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white">
            Evaluation Criteria · Government Requirement REQ-MH-2026-1042
          </p>
          <p className="text-[10px] text-white/60 mt-0.5">Smart Road Condition Monitoring · PWD Maharashtra</p>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--line)" }}>
          {CRITERIA.map(c => (
            <div key={c.label} className="flex items-center gap-4 px-4 py-2.5">
              <div className="w-28 shrink-0">
                <span className="text-[11px] font-bold" style={{ color: "var(--ink)" }}>{c.label}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{c.desc}</p>
              </div>
              <div
                className="shrink-0 rounded px-2.5 py-1 text-[11px] font-bold"
                style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
              >
                {c.weight}
              </div>
            </div>
          ))}
        </div>
        {/* Pipeline */}
        <div className="px-4 py-2.5 border-t" style={{ borderColor: "var(--line)", background: "var(--mist)" }}>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--ink-soft)" }}>
            PRAMAN Matching Pipeline
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Hard Eligibility Filters", "BM25 Keyword Match", "Dense Embedding Similarity", "RRF Fusion", "TOPSIS Ranking"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-1.5">
                <span className="rounded px-2 py-0.5 text-[10px] font-semibold"
                  style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}>
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight size={10} style={{ color: "var(--ink-soft)" }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["124", "Startups Discovered"],
              ["36",  "Passed Hard Eligibility"],
              ["12",  "Capability Matched"],
              [String(recommendations.length), "Final Recommendations"],
            ].map(([val, label]) => (
              <div key={label} className="rounded border bg-white px-4 py-3 text-center" style={{ borderColor: "var(--line)" }}>
                <p className="text-2xl font-black" style={{ color: "var(--gov-blue)" }}>{val}</p>
                <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Evaluation Table */}
          <div className="rounded border bg-white overflow-hidden" style={{ borderColor: "var(--line)" }}>
            <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
              <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                Recommended Startups — Evaluation Results
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Startup</th>
                    <th>Eligibility</th>
                    <th>Req. Match</th>
                    <th>Evidence</th>
                    <th>Pilot Score</th>
                    <th>Overall Score</th>
                    <th>Band</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec: any) => (
                    <tr key={rec.id}>
                      <td>
                        <span className="font-black text-[13px]" style={{ color: "var(--gov-blue)" }}>#{rec.rank}</span>
                      </td>
                      <td>
                        <p className="font-semibold text-[12px]" style={{ color: "var(--ink)" }}>{rec.startup?.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{rec.startup?.capabilities?.slice(0, 2).join(" · ")}</p>
                      </td>
                      <td>
                        <span className="status-pill" style={
                          rec.eligibility?.status === "PASS"
                            ? { background: "var(--success-light)", color: "var(--success)", border: "1px solid #bbf7d0" }
                            : { background: "var(--critical-light)", color: "var(--critical)", border: "1px solid #fecaca" }
                        }>
                          <CheckCircle2 size={9} />{rec.eligibility?.status ?? "PASS"}
                        </span>
                      </td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Requirement Match"] ?? "—"}</td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Evidence Strength"] ?? "—"}</td>
                      <td className="font-semibold text-[12px]">{rec.dimensions?.["Pilot Performance"] ?? "—"}</td>
                      <td>
                        <button
                          className="text-[15px] font-black hover:underline"
                          style={{ color: "var(--gov-blue)" }}
                          onClick={() => setTrace(kpiTrace(`${rec.startup?.name} · Score ${rec.score}/100`, "PRAMAN matching engine", String(rec.score)))}
                        >
                          {rec.score}
                        </button>
                        <span className="text-[10px] ml-0.5" style={{ color: "var(--ink-soft)" }}>/100</span>
                      </td>
                      <td>
                        <Badge tone={rec.rank === 1 ? "gov" : "neutral"}>{rec.band}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top recommendation detail */}
          {recommendations[0] && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,280px)] gap-4 min-w-0">
              {/* Eligibility checks */}
              {recommendations[0].eligibility?.checks && (
                <div className="rounded border bg-white" style={{ borderColor: "var(--line)" }}>
                  <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--line)" }}>
                    <h2 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-mid)" }}>
                      Eligibility Verification — {recommendations[0].startup?.name}
                    </h2>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--line)" }}>
                    {recommendations[0].eligibility.checks.map((check: any) => (
                      <div key={check.code} className="flex items-start gap-3 px-4 py-2.5">
                        {check.status === "PASS"
                          ? <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />
                          : <ShieldCheck size={13} className="mt-0.5 shrink-0" style={{ color: "var(--critical)" }} />
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>{check.name}</p>
                          <p className="text-[10px]" style={{ color: "var(--ink-soft)" }}>{check.reason}</p>
                        </div>
                        <Badge tone={check.status === "PASS" ? "success" : "critical"}>{check.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why ranked #1 */}
              <div className="rounded border" style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue-light)" }}>
                <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--gov-blue-border)", background: "var(--gov-blue)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white">
                    Why Ranked #1? · {recommendations[0].startup?.name}
                  </p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {[
                    "Strong requirement alignment with government KPIs",
                    "Government pilot evidence — independently validated",
                    "High-confidence KPI metrics exceeding targets",
                    "Lower implementation risk vs. alternatives",
                    "Positive historical institutional memory outcome",
                    "DPIIT-verified startup with demonstrated capability",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]" style={{ color: "var(--gov-blue)" }}>
                      <CheckCircle2 size={11} className="mt-0.5 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
                {!pilot && (
                  <div className="px-4 pb-4">
                    <Action onClick={shortlist} label="Shortlist for Pilot" icon={<Users size={12} />} size="sm" />
                  </div>
                )}
                {pilot && (
                  <div className="px-4 pb-4 flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--success)" }}>
                    <CheckCircle2 size={13} /> Shortlisted · Pilot Workspace Created
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Panel title="Startup Evaluation" icon={<Target size={13} />}>
          <Empty
            text={canMatch
              ? "Click 'Run Eligibility & Matching' to rank eligible startups against the approved requirement."
              : "Requirements must be approved before the matching engine can run."}
            action={canMatch ? "Run Eligibility & Matching" : "Approve Requirements first"}
          />
        </Panel>
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

