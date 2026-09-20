"use client";

import { useState } from "react";
import { usePraman } from "@/lib/PramanContext";
import { Panel, Empty, VerificationBadge, GovPageHeader } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  FileCheck2, ShieldCheck, CheckCircle2, AlertTriangle, Hash,
  Upload, FolderCheck, FileText, Check, Clock, Eye, AlertCircle, X, Shield, Landmark, FlaskConical
} from "lucide-react";

const EVIDENCE_DATA = [
  {
    recordId: "EVID-MH-2026-001",
    name: "Detection_Report_May.pdf",
    category: "Technical",
    type: "PDF",
    source: "PWD Maharashtra / Pilot Evaluator",
    uploader: "Pilot Evaluator",
    date: "2026-05-28",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "Independently checked by designated evaluator",
    confidence: "94%",
    kpi: "Detection Recall",
    hash: "8F3A...001",
  },
  {
    recordId: "EVID-MH-2026-002",
    name: "Field_Photos_Sample.zip",
    category: "Performance",
    type: "ZIP",
    source: "SkylineAI Field Team",
    uploader: "Field Team",
    date: "2026-05-29",
    verificationLevel: "PARTIALLY VERIFIED" as const,
    verificationNote: "Sample of 200 photos reviewed; full dataset not audited",
    confidence: "78%",
    kpi: "False Positive Rate",
    hash: "2C1B...002",
  },
  {
    recordId: "EVID-MH-2026-003",
    name: "KPI_Summary_May.xlsx",
    category: "Commercial",
    type: "XLSX",
    source: "PWD Evaluator",
    uploader: "Evaluator",
    date: "2026-05-30",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "KPI figures independently recomputed from raw logs",
    confidence: "96%",
    kpi: "Cost Efficiency",
    hash: "A4F7...003",
  },
  {
    recordId: "EVID-MH-2026-004",
    name: "Security_Assessment.pdf",
    category: "Security",
    type: "PDF",
    source: "CISO / IT Security",
    uploader: "CISO",
    date: "2026-05-30",
    verificationLevel: "PARTIALLY VERIFIED" as const,
    verificationNote: "80% complete — penetration testing outstanding",
    confidence: "80%",
    kpi: "Security",
    hash: "D9E2...004",
  },
  {
    recordId: "EVID-MH-2026-005",
    name: "User_Feedback.pdf",
    category: "User Feedback",
    type: "PDF",
    source: "Field Supervisor",
    uploader: "Field Supervisor",
    date: "2026-05-31",
    verificationLevel: "VERIFIED" as const,
    verificationNote: "Reviewed by independent evaluator",
    confidence: "88%",
    kpi: "User Satisfaction",
    hash: "F1C5...005",
  },
];

const CAT_STYLES: Record<string, React.CSSProperties> = {
  Technical:      { background: "var(--info-light)", color: "var(--info)", borderColor: "#bfdbfe" },
  Performance:    { background: "#faf5ff", color: "#7c3aed", borderColor: "#ddd6fe" },
  Commercial:     { background: "var(--success-light)", color: "var(--success)", borderColor: "#bbf7d0" },
  Security:       { background: "var(--warning-light)", color: "var(--warning)", borderColor: "#fde68a" },
  "User Feedback":{ background: "#fdf2f8", color: "#be185d", borderColor: "#fbcfe8" },
};

export default function EvidencePage() {
  const { user, pilot } = usePraman();

  if (user?.role === "startup") {
    return <StartupEvidenceView user={user} />;
  }
  const hasEvidence = (pilot?.kpis?.length ?? 0) > 0;

  const verified = EVIDENCE_DATA.filter(e => e.verificationLevel === "VERIFIED").length;
  const partial  = EVIDENCE_DATA.filter(e => e.verificationLevel === "PARTIALLY VERIFIED").length;

  return (
    <div className="space-y-5 min-w-0">
      <GovPageHeader
        eyebrow="Validation · Evidence Repository"
        title="Evidence Locker"
        subtitle="Official evidence records supporting procurement decisions · PIL-MH-2026-022"
        recordId="EVID-MH-2026-REPO"
      />

      {hasEvidence ? (
        <div className="space-y-5">
          {/* Verification Notice */}
          <div
            className="flex items-start gap-3 rounded border px-4 py-3"
            style={{ background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", borderLeft: "3px solid var(--gov-blue)" }}
          >
            <ShieldCheck size={15} className="mt-0.5 shrink-0" style={{ color: "var(--gov-blue)" }} />
            <div className="flex-1">
              <p className="text-[11px] font-bold" style={{ color: "var(--gov-blue)" }}>
                Evidence Verification Active — Official Records Repository
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                All evidence records are cryptographically hashed and immutably audit-logged. Verification status reflects independent evaluation. SIMULATED DATA for SIH 2026 demonstration.
              </p>
            </div>
            <Badge tone="amber">SIMULATED</Badge>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: EVIDENCE_DATA.length, label: "Records Uploaded", style: { background: "var(--gov-blue-light)", borderColor: "var(--gov-blue-border)", color: "var(--gov-blue)" } },
              { val: verified, label: "Fully Verified", style: { background: "var(--success-light)", borderColor: "#bbf7d0", color: "var(--success)" } },
              { val: partial,  label: "Partially Verified", style: { background: "var(--warning-light)", borderColor: "#fde68a", color: "var(--warning)" } },
            ].map(s => (
              <div key={s.label} className="rounded border px-4 py-3 text-center" style={s.style}>
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-[10px] mt-0.5 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Security warning */}
          <div
            className="flex items-start gap-2 rounded border px-4 py-3"
            style={{ background: "var(--warning-light)", borderColor: "#fde68a", borderLeft: "3px solid var(--warning)" }}
          >
            <AlertTriangle size={13} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} />
            <p className="text-[11px] font-medium" style={{ color: "var(--warning)" }}>
              <strong>Security Assessment (EVID-MH-2026-004)</strong> is 80% complete — penetration testing and data residency confirmation outstanding. Final procurement approval requires 100% completion.
            </p>
          </div>

          {/* Evidence Records */}
          <div className="space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--ink-soft)" }}>
              Evidence Records
            </p>
            {EVIDENCE_DATA.map(item => (
              <div
                key={item.recordId}
                className="rounded border bg-white overflow-hidden"
                style={{ borderColor: "var(--line)" }}
              >
                {/* Record Header */}
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ borderColor: "var(--line)", background: "var(--mist)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="record-id">{item.recordId}</span>
                    <span
                      className="status-pill"
                      style={{ ...CAT_STYLES[item.category], border: `1px solid ${CAT_STYLES[item.category]?.borderColor ?? "var(--line)"}` }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <VerificationBadge level={item.verificationLevel} />
                </div>

                {/* Record Body */}
                <div className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: "var(--ink)" }}>{item.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--ink-soft)" }}>
                        Source: {item.source} · {item.date} · Related KPI: {item.kpi}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ink-soft)" }}>Confidence</p>
                      <p className="text-[15px] font-black" style={{ color: "var(--gov-blue)" }}>{item.confidence}</p>
                    </div>
                  </div>
                  <p className="text-[10px] italic" style={{ color: "var(--ink-soft)" }}>{item.verificationNote}</p>
                  <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--ink-soft)" }}>
                      <Hash size={10} /> {item.hash}
                    </div>
                    <button
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-semibold transition"
                      style={{ background: "var(--gov-blue-light)", color: "var(--gov-blue)", border: "1px solid var(--gov-blue-border)" }}
                    >
                      View Evidence Record
                    </button>
                    <button
                      className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-semibold transition"
                      style={{ background: "var(--mist)", color: "var(--ink-mid)", border: "1px solid var(--line)" }}
                    >
                      Audit History
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification Legend */}
          <div className="rounded border bg-white px-4 py-3" style={{ borderColor: "var(--line)" }}>
            <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ink-soft)" }}>
              Verification Status Legend
            </p>
            <div className="flex flex-wrap gap-3">
              {(["VERIFIED", "PARTIALLY VERIFIED", "SELF-DECLARED", "REJECTED", "PENDING"] as const).map(l => (
                <VerificationBadge key={l} level={l} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Panel title="Evidence Locker" icon={<FileCheck2 size={13} />}>
          <Empty
            text="Evidence records are populated when the pilot is fast-forwarded to Final Evaluation. Navigate to Pilot Management and click 'Fast-Forward'."
            action="Go to Pilot Management → Fast-Forward"
          />
        </Panel>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STARTUP EVIDENCE REPOSITORY VIEW (Sections 13 & 14)
   ═══════════════════════════════════════════════════════════════ */
function StartupEvidenceView({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<"pre-pilot" | "pilot">("pilot");
  const [statusFilter, setStatusFilter] = useState("All");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadItem, setSelectedUploadItem] = useState<any>(null);
  const [uploadedToast, setUploadedToast] = useState(false);

  // Pre-Pilot Evidence
  const prePilotEvidence = [
    {
      id: "PRE-01",
      title: "Company Registration Certificate (DPIIT)",
      opportunity: "Smart Waste Management Solution",
      department: "Brihanmumbai Municipal Corporation",
      category: "Registration & Legal",
      status: "Verified",
      statusTone: "green",
      uploadedDate: "05 Aug 2026",
      action: "View Document",
    },
    {
      id: "PRE-02",
      title: "ISO 27001 / SOC 2 Security Compliance",
      opportunity: "Smart Waste Management Solution",
      department: "Brihanmumbai Municipal Corporation",
      category: "Compliance & Security",
      status: "Evidence Required",
      statusTone: "amber",
      uploadedDate: "—",
      action: "Upload Document",
    },
    {
      id: "PRE-03",
      title: "Technical System Architecture & Data Schema",
      opportunity: "Road Damage Detection",
      department: "PWD Maharashtra",
      category: "Technical Architecture",
      status: "Verified",
      statusTone: "green",
      uploadedDate: "12 Aug 2026",
      action: "View Document",
    },
  ];

  // Pilot Evidence
  const [pilotEvidenceList, setPilotEvidenceList] = useState([
    {
      id: "PIL-01",
      title: "30-Day Pilot Evaluation Report",
      opportunity: "Road Damage Detection",
      department: "PWD Maharashtra",
      category: "Evaluation Report",
      status: "Evidence Required",
      statusTone: "amber",
      uploadedDate: "—",
      dueDate: "24 Sept 2026",
      action: "Upload Report",
    },
    {
      id: "PIL-02",
      title: "Initial 500km Public Transport Telemetry Dataset",
      opportunity: "Road Damage Detection",
      department: "PWD Maharashtra",
      category: "Dataset & Telemetry",
      status: "Verified",
      statusTone: "green",
      uploadedDate: "10 Sept 2026",
      dueDate: "Completed",
      action: "View Dataset",
    },
    {
      id: "PIL-03",
      title: "Edge AI Accuracy & False Positive Verification Logs",
      opportunity: "Road Damage Detection",
      department: "PWD Maharashtra",
      category: "KPI Results",
      status: "Under Review",
      statusTone: "blue",
      uploadedDate: "18 Sept 2026",
      dueDate: "Under Assessment",
      action: "View Logs",
    },
  ]);

  function handleOpenUpload(item: any) {
    setSelectedUploadItem(item);
    setUploadModalOpen(true);
  }

  function handleSimulateUpload() {
    if (selectedUploadItem) {
      setPilotEvidenceList(prev => prev.map(p => p.id === selectedUploadItem.id ? { ...p, status: "Under Review", statusTone: "blue", action: "View Submitted" } : p));
    }
    setUploadModalOpen(false);
    setUploadedToast(true);
    setTimeout(() => setUploadedToast(false), 4000);
  }

  const currentList = activeTab === "pre-pilot" ? prePilotEvidence : pilotEvidenceList;
  const filteredList = statusFilter === "All" ? currentList : currentList.filter(e => e.status === statusFilter);

  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Startup Portal · Evidence Repository"
        title="Evidence & Verification Hub"
        subtitle="Submit proof of compliance, benchmark datasets, and milestone evaluation reports for government review."
        recordId="EVID-STARTUP-MH"
      />

      {/* Success Toast */}
      {uploadedToast && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-xs font-bold text-[#16834B] shadow-sm">
          <CheckCircle2 size={16} />
          <span>Evidence uploaded successfully. Submitted for nodal officer verification.</span>
        </div>
      )}

      {/* Two Types of Evidence Distinction Banner (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => { setActiveTab("pilot"); setStatusFilter("All"); }}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === "pilot"
              ? "bg-white border-[#1236B8] ring-2 ring-[#1236B8]/20 shadow-sm"
              : "bg-[#F8FAFC] border-[#D9E1EA] hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
              <FlaskConical size={15} className="text-[#1236B8]" />
              Type B: Pilot Performance Evidence
            </span>
            <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#16834B] px-2 py-0.5 rounded">
              Active Sandbox
            </span>
          </div>
          <p className="text-[11px] text-[#5E6B7E] mt-1">
            Telemetry datasets, 30-day evaluation reports, and accuracy logs to prove pilot outcome.
          </p>
        </button>

        <button
          onClick={() => { setActiveTab("pre-pilot"); setStatusFilter("All"); }}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === "pre-pilot"
              ? "bg-white border-[#1236B8] ring-2 ring-[#1236B8]/20 shadow-sm"
              : "bg-[#F8FAFC] border-[#D9E1EA] hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
              <FolderCheck size={15} className="text-[#0B2A5B]" />
              Type A: Pre-Pilot Compliance & Verification
            </span>
            <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 rounded">
              Proposal Verification
            </span>
          </div>
          <p className="text-[11px] text-[#5E6B7E] mt-1">
            Entity registration, certifications, compliance documents, and system architecture specs.
          </p>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#D9E1EA] pb-3">
        <div className="flex items-center gap-2">
          {["All", "Evidence Required", "Under Review", "Verified"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                statusFilter === st
                  ? "bg-[#0B2A5B] text-white"
                  : "bg-white text-[#5E6B7E] hover:bg-slate-100 border border-[#D9E1EA]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white border border-[#D9E1EA] rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#D9E1EA] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#172033]">
              {activeTab === "pilot" ? "Pilot Deliverables & Evidence" : "Pre-Pilot Compliance Records"} ({filteredList.length})
            </h2>
            <p className="text-[11px] text-[#5E6B7E]">
              {activeTab === "pilot"
                ? "Evaluates whether the 90-day sandbox pilot met agreed technical KPI targets"
                : "Used by government committees to verify startup credentials and compliance"}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Evidence Title</th>
                <th>Opportunity</th>
                <th>Department</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, idx) => (
                <tr key={item.id}>
                  <td className="font-bold text-[#5E6B7E]">{idx + 1}</td>
                  <td>
                    <p className="font-bold text-xs text-[#172033]">{item.title}</p>
                    <span className="font-mono text-[10px] text-[#5E6B7E]">{item.id}</span>
                  </td>
                  <td className="text-xs text-[#5E6B7E]">{item.opportunity}</td>
                  <td className="text-xs text-[#5E6B7E] whitespace-nowrap">{item.department}</td>
                  <td>
                    <span className="text-[10px] font-semibold text-[#172033] bg-[#F1F5F9] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.statusTone === "green"
                          ? "bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0]"
                          : item.statusTone === "blue"
                          ? "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                          : "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {item.status === "Evidence Required" ? (
                      <button
                        onClick={() => handleOpenUpload(item)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#D97706] hover:bg-[#B45309] px-3 py-1.5 rounded shadow-sm transition-colors"
                      >
                        <Upload size={12} />
                        <span>Upload</span>
                      </button>
                    ) : (
                      <button
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B2A5B] bg-[#EEF5FC] hover:bg-[#DBEAFE] px-3 py-1.5 rounded border border-[#BFDBFE] transition-colors"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Evidence Modal */}
      {uploadModalOpen && selectedUploadItem && (
        <div
          className="fixed inset-0 z-50 bg-[#0A2540]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-[#D9E1EA] max-w-lg w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#F8FAFC] px-6 py-4 border-b border-[#D9E1EA] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1236B8]">
                  <Upload size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#1236B8]">
                    Evidence Submission
                  </p>
                  <h3 className="text-sm font-black text-[#172033]">Upload Required Evidence</h3>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-[#5E6B7E] hover:text-[#172033] rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded bg-[#F8FAFC] border border-[#D9E1EA] space-y-1.5">
                <p className="text-[11px] text-[#5E6B7E]">Item:</p>
                <p className="font-bold text-sm text-[#172033]">{selectedUploadItem.title}</p>
                <p className="text-[11px] text-[#5E6B7E]">{selectedUploadItem.opportunity} · {selectedUploadItem.department}</p>
              </div>

              <div className="border-2 border-dashed border-[#BFDBFE] rounded-lg p-6 text-center bg-[#EFF6FF]/40">
                <Upload size={24} className="mx-auto text-[#1236B8] mb-2" />
                <p className="font-bold text-xs text-[#172033]">Click to select PDF or telemetry ZIP file</p>
                <p className="text-[10px] text-[#5E6B7E] mt-1">Accepted formats: PDF, XLSX, CSV, ZIP (Max 50MB)</p>
                <span className="inline-block mt-3 text-[10px] font-bold bg-white text-[#1236B8] px-3 py-1 rounded border border-[#BFDBFE] shadow-sm">
                  Choose File
                </span>
              </div>

              <div className="p-3 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-start gap-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#D97706]" />
                <span>
                  Uploaded files will be cryptographically hashed (SHA-256) and verified by the designated departmental evaluation officer.
                </span>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#D9E1EA] flex justify-end gap-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="bg-white border border-[#D9E1EA] text-[#5E6B7E] hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateUpload}
                className="bg-[#16834B] hover:bg-[#15803D] text-white text-xs font-bold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Confirm & Submit Evidence</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

