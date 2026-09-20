"use client";

import { usePraman } from "@/lib/PramanContext";
import { AlertBanner, Empty, Panel, kpiTrace, GovPageHeader } from "@/components/ui";
import { Trophy, CheckCircle2, TrendingUp, AlertTriangle, Building2, CalendarDays, Check, Landmark, Award, Target, Clock, ShieldCheck, FileCheck2 } from "lucide-react";

export default function OutcomesPage() {
  const { user, outcome, error, setTrace } = usePraman();

  // Factual completed pilot outcome for prototype demonstration
  const displayOutcome = outcome || {
    result: "Procurement Recommended",
    completion_date: "15 Jan 2026",
    department: "PWD Maharashtra",
    project: "Road Damage Detection using Public Transport Telemetry",
    reason: "The solution successfully demonstrated continuous edge AI road defect detection with 88.2% accuracy across 540 km of public bus routes, meeting all critical security, uptime, and departmental SLA targets.",
    related_evidence: "acceptance_certificate_MH_2026.pdf",
    related_dependency: "Night-time camera glare mitigation confirmed in v2.4 firmware update",
    dimensions: [
      { name: "Detection Accuracy", expected: "≥ 85.0%", actual: "88.2%", variance: "+3.2%", result: "Target Exceeded" },
      { name: "Processing Latency", expected: "≤ 2.0 sec", actual: "1.7 sec", variance: "-0.3 sec", result: "Target Met" },
      { name: "Road Network Coverage", expected: "500 km", actual: "540 km", variance: "+40 km", result: "Target Exceeded" },
      { name: "Data Privacy & Residency", expected: "100% In-State", actual: "100% Verified", variance: "0%", result: "Target Met" },
      { name: "Hardware Telemetry MTBF", expected: "≥ 720 hrs", actual: "740 hrs", variance: "+20 hrs", result: "Target Met" },
    ],
  };

  const getResultColor = (result: string) => {
    if (result.includes("Exceeded") || result.includes("Met")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (result.includes("Partial")) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Evaluation · Post-Pilot Outcomes"
        title="Government Evaluation & Outcome Records"
        subtitle="Factual outcome determinations and verified KPI target results recorded by the procurement committee."
        recordId="OUT-MH-2026-1042"
      />

      {error && <AlertBanner type="error" message={error} />}

      {/* Primary Outcome Banner */}
      <div className="rounded-xl border border-[#D9E1EA] bg-white overflow-hidden shadow-sm border-t-4 border-t-[#16834B]">
        <div className="bg-[#0B2A5B] px-6 py-4 flex flex-wrap items-center justify-between text-white gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Award size={22} className="text-[#22C55E]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Official Government Decision</p>
              <h2 className="text-xl font-black text-white">{displayOutcome.result}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-300">Completion Date</p>
            <p className="text-xs font-bold text-white font-mono">{displayOutcome.completion_date}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5E6B7E]">Evaluation Summary</span>
            <p className="text-sm text-[#172033] leading-relaxed font-medium mt-1">
              {displayOutcome.reason}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              className="inline-flex items-center gap-2 rounded bg-[#DCFCE7] px-3.5 py-2 text-xs font-bold text-[#16834B] hover:bg-[#BBF7D0] border border-[#BBF7D0] transition shadow-sm"
              onClick={() => setTrace(kpiTrace("Final Evaluation", "acceptance_certificate.pdf", displayOutcome.related_evidence))}
            >
              <FileCheck2 size={15} /> View Acceptance Certificate
            </button>
            {displayOutcome.related_dependency && (
              <div className="inline-flex items-center gap-2 rounded bg-[#FFFBEB] px-3.5 py-2 text-xs font-bold text-[#B45309] border border-[#FDE68A]">
                <ShieldCheck size={15} /> Verified Mitigation: {displayOutcome.related_dependency}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verified KPI Measurements Table (Section 16) */}
      <Panel title="Verified KPI Performance Dimensions" icon={<TrendingUp size={15} />}>
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th>KPI Performance Dimension</th>
                <th>Expected Target</th>
                <th>Actual Measured Result</th>
                <th>Variance</th>
                <th style={{ textAlign: "right" }}>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {displayOutcome.dimensions.map((dim: any, idx: number) => (
                <tr key={idx}>
                  <td className="font-bold text-[#172033] text-xs">{dim.name}</td>
                  <td className="text-xs text-[#5E6B7E] font-mono">{dim.expected}</td>
                  <td className="text-xs font-bold text-[#172033] font-mono">{dim.actual}</td>
                  <td className={`text-xs font-bold font-mono ${
                    dim.variance.startsWith('+') && dim.name !== 'Implementation Time'
                      ? 'text-[#16834B]'
                      : dim.name === 'Implementation Time' && dim.variance.startsWith('+')
                      ? 'text-[#DC2626]'
                      : 'text-[#172033]'
                  }`}>
                    {dim.variance}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${getResultColor(dim.result)}`}>
                      {dim.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
