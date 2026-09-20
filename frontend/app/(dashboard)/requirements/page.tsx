"use client";

import { useState } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, Action, AlertBanner, StatusBadge, kpiTrace } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  ListChecks, CheckCircle2, Sparkles, ShieldAlert, Pencil, Save, X,
  Plus, Trash2, AlertTriangle, Lightbulb, Target, Shield, Settings2,
  Layers, Cpu, MapPin, IndianRupee, Calendar, FileText, ArrowRight,
  HelpCircle, Check, Info, Lock
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
type EditableFields = {
  domain: string;
  technology: string;
  problem_type: string;
  geography: string;
  budget: string;
  timeline: string;
  deployment: string;
};

type KpiRow = {
  id: string;
  name: string;
  target: string;
  method: string;
  confidence?: string;
};

type AiSuggestionCategory = "kpi" | "constraint" | "deployment" | "milestone";

type AiSuggestion = {
  id: string;
  text: string;
  category: AiSuggestionCategory;
  categoryLabel: string;
  icon: React.ReactNode;
  added: boolean;
};

/* ═══════════════════════════════════════════════════════════════
   AI SUGGESTIONS DATA
   ═══════════════════════════════════════════════════════════════ */
const INITIAL_AI_SUGGESTIONS: Omit<AiSuggestion, "icon">[] = [
  {
    id: "ai-1",
    text: "Data privacy compliance with IT Act 2000 & Digital Personal Data Protection (DPDP) Act 2023",
    category: "constraint",
    categoryLabel: "Security / Compliance",
    added: false,
  },
  {
    id: "ai-2",
    text: "30 / 60 / 90 day milestone evaluation gates with empirical evidence verification",
    category: "milestone",
    categoryLabel: "Pilot Milestone",
    added: false,
  },
  {
    id: "ai-3",
    text: "REST API integration with departmental GIS portal & State Data Center (SDC) infrastructure",
    category: "deployment",
    categoryLabel: "Integration / Deployment",
    added: false,
  },
  {
    id: "ai-4",
    text: "Minimum 85% detection accuracy benchmark on standardized government test dataset",
    category: "kpi",
    categoryLabel: "Performance KPI",
    added: false,
  },
  {
    id: "ai-5",
    text: "Accessibility compliance with Guidelines for Indian Government Websites (GIGW 3.0)",
    category: "constraint",
    categoryLabel: "Security / Compliance",
    added: false,
  },
];

const CATEGORY_ICONS: Record<AiSuggestionCategory, React.ReactNode> = {
  kpi: <Target size={13} />,
  constraint: <Shield size={13} />,
  deployment: <Settings2 size={13} />,
  milestone: <Lightbulb size={13} />,
};

const CATEGORY_STYLES: Record<AiSuggestionCategory, { bg: string; border: string; text: string; accent: string }> = {
  kpi: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", accent: "#22C55E" },
  constraint: { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", accent: "#EF4444" },
  deployment: { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8", accent: "#3B82F6" },
  milestone: { bg: "#FAF5FF", border: "#E9D5FF", text: "#7E22CE", accent: "#A855F7" },
};

/* ═══════════════════════════════════════════════════════════════
   INLINE EDIT INPUT COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function EditInput({
  value,
  onChange,
  multiline,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const baseStyle: React.CSSProperties = {
    width: "100%",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "var(--ink)",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1.5px solid #3B82F6",
    background: "#FFFFFF",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.5,
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.12)",
    transition: "all 0.15s ease",
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...baseStyle, minHeight: 80, resize: "vertical" }}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={baseStyle}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN REQUIREMENTS PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function RequirementsPage() {
  const { problem, requirement, structure, approve, loading, error, setTrace } = usePraman();

  // ── Edit mode state ──
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditableFields | null>(null);
  const [savedFields, setSavedFields] = useState<EditableFields | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // ── KPI state ──
  const [kpiRows, setKpiRows] = useState<KpiRow[] | null>(null);
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [kpiDraft, setKpiDraft] = useState<KpiRow>({ id: "", name: "", target: "", method: "" });
  const [addingKpi, setAddingKpi] = useState(false);

  // ── AI suggestions state ──
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>(
    INITIAL_AI_SUGGESTIONS.map((s) => ({ ...s, icon: CATEGORY_ICONS[s.category] }))
  );

  // Derive display fields: savedFields override > requirement original
  const displayFields: EditableFields | null =
    savedFields || (requirement ? {
      domain: requirement.domain,
      technology: requirement.technology,
      problem_type: requirement.problem_type,
      geography: requirement.geography,
      budget: requirement.budget,
      timeline: requirement.timeline,
      deployment: requirement.deployment,
    } : null);

  // Derive KPI display: kpiRows override > requirement.kpis
  const displayKpis: KpiRow[] =
    kpiRows || (requirement?.kpis?.map((k: any, i: number) => ({
      id: `kpi-${i}`,
      name: k.name,
      target: k.target,
      method: k.method || "Automated telemetry",
      confidence: k.confidence,
    })) ?? []);

  // ── Edit handlers ──
  function startEdit() {
    if (!displayFields) return;
    setEditFields({ ...displayFields });
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditFields(null);
    setIsEditing(false);
  }

  function saveEdit() {
    if (!editFields) return;
    setSavedFields({ ...editFields });
    setIsEditing(false);
    setEditFields(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  }

  function updateField(key: keyof EditableFields, value: string) {
    if (!editFields) return;
    setEditFields({ ...editFields, [key]: value });
  }

  // ── KPI handlers ──
  function startAddKpi() {
    setKpiDraft({ id: `kpi-new-${Date.now()}`, name: "", target: "", method: "" });
    setAddingKpi(true);
    setEditingKpiId(null);
  }

  function saveNewKpi() {
    if (!kpiDraft.name.trim()) return;
    const updated = [...displayKpis, { ...kpiDraft }];
    setKpiRows(updated);
    setAddingKpi(false);
    setKpiDraft({ id: "", name: "", target: "", method: "" });
  }

  function startEditKpi(kpi: KpiRow) {
    setKpiDraft({ ...kpi });
    setEditingKpiId(kpi.id);
    setAddingKpi(false);
  }

  function saveEditKpi() {
    const updated = displayKpis.map((k) => (k.id === editingKpiId ? { ...kpiDraft } : k));
    setKpiRows(updated);
    setEditingKpiId(null);
    setKpiDraft({ id: "", name: "", target: "", method: "" });
  }

  function deleteKpi(id: string) {
    const updated = displayKpis.filter((k) => k.id !== id);
    setKpiRows(updated);
  }

  function cancelKpiEdit() {
    setEditingKpiId(null);
    setAddingKpi(false);
    setKpiDraft({ id: "", name: "", target: "", method: "" });
  }

  // ── AI suggestion handlers ──
  function addSuggestion(suggestion: AiSuggestion) {
    setSuggestions((prev) => prev.map((s) => (s.id === suggestion.id ? { ...s, added: true } : s)));

    if (suggestion.category === "kpi") {
      const newKpi: KpiRow = {
        id: `kpi-ai-${Date.now()}`,
        name: suggestion.text,
        target: "Defined by evaluation framework",
        method: "Controlled telemetry benchmark",
        confidence: "AI-Suggested",
      };
      setKpiRows([...displayKpis, newKpi]);
    }
  }

  // Current values for display
  const fields = isEditing ? editFields : displayFields;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Page Header */}
      <GovPageHeader
        eyebrow="Problem to Pilot"
        title="Requirements"
        subtitle="AI-structured procurement requirements for review and officer approval"
        actions={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Action
              onClick={structure}
              label="Structure with PRAMAN AI"
              icon={<Sparkles size={14} />}
              disabled={!problem || !!requirement || loading === "Structuring problem"}
              size="sm"
            />
            <Action
              onClick={approve}
              label="Approve Requirements"
              icon={<CheckCircle2 size={14} />}
              disabled={!requirement || requirement.status === "Approved" || loading === "Approving requirement"}
              muted={requirement?.status === "Approved"}
              size="sm"
            />
          </div>
        }
      />

      {error && <AlertBanner type="error" message={error} />}

      {/* Loading banner */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 16px",
          background: "linear-gradient(90deg, #EEF5FC 0%, #E0EEFB 100%)",
          border: "1px solid #BFDBFE", borderLeft: "4px solid var(--gov-blue)",
          boxShadow: "0 2px 6px rgba(18, 54, 184, 0.08)",
        }}>
          <Sparkles size={16} style={{ color: "var(--gov-blue)" }} className="animate-pulse" />
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--gov-blue)" }}>{loading}…</span>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 16px",
          background: "#F0FDF4", border: "1px solid #BBF7D0", borderLeft: "4px solid #16834B",
          boxShadow: "0 2px 8px rgba(22, 131, 75, 0.12)",
        }}>
          <CheckCircle2 size={16} style={{ color: "#16834B" }} />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#16834B" }}>Requirements changes saved successfully.</span>
          <span style={{ fontSize: "0.7rem", color: "#15803D", marginLeft: "auto", opacity: 0.8 }}>Ready for officer approval</span>
        </div>
      )}

      {requirement ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,330px)] gap-5 min-w-0">
          {/* Main Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            
            {/* ── Structured Requirements Panel ── */}
            <Panel
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 700 }}>
                    Structured Requirements
                    <span style={{
                      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
                      padding: "2px 8px", borderRadius: 4,
                      background: "linear-gradient(135deg, #EEF5FC, #DBEAFE)",
                      border: "1px solid #BFDBFE",
                      color: "var(--gov-blue)", textTransform: "uppercase",
                    }}>
                      AI Synthesized
                    </span>
                  </span>
                </div>
              }
              icon={<ListChecks size={15} style={{ color: "var(--gov-blue)" }} />}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Header Sub-bar: ID + Status + Edit Trigger */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 10, padding: "10px 14px",
                  background: "var(--surface)", borderRadius: 6, border: "1px solid var(--line)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div>
                      <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.62rem" }}>Requirement ID</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Lock size={11} style={{ color: "var(--ink-soft)" }} />
                        <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 800, color: "var(--gov-navy)" }}>
                          {requirement.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StatusBadge status={requirement.status} />

                    {!isEditing ? (
                      <button
                        onClick={startEdit}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          fontSize: "0.72rem", fontWeight: 700, padding: "6px 14px",
                          borderRadius: 5, border: "1px solid #BFDBFE",
                          background: "#EFF6FF", color: "#1D4ED8",
                          cursor: "pointer", transition: "all 0.15s ease",
                          boxShadow: "0 1px 2px rgba(29, 78, 216, 0.08)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#DBEAFE";
                          e.currentTarget.style.borderColor = "#93C5FD";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#EFF6FF";
                          e.currentTarget.style.borderColor = "#BFDBFE";
                        }}
                      >
                        <Pencil size={12} /> Edit Requirements
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={saveEdit}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: "0.72rem", fontWeight: 700, padding: "6px 14px",
                            borderRadius: 5, border: "1px solid #86EFAC",
                            background: "#16834B", color: "#FFFFFF",
                            cursor: "pointer", boxShadow: "0 1px 3px rgba(22, 131, 75, 0.2)",
                          }}
                        >
                          <Save size={12} /> Save Changes
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            fontSize: "0.72rem", fontWeight: 700, padding: "6px 14px",
                            borderRadius: 5, border: "1px solid var(--line)",
                            background: "var(--white)", color: "var(--ink-mid)",
                            cursor: "pointer",
                          }}
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 7 Editable Requirement Fields Grid */}
                {fields && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                      {isEditing ? (
                        <>
                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <Layers size={11} style={{ color: "var(--gov-blue)" }} /> Domain
                            </label>
                            <EditInput value={fields.domain} onChange={(v) => updateField("domain", v)} />
                          </div>

                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <Cpu size={11} style={{ color: "var(--gov-blue)" }} /> Technology
                            </label>
                            <EditInput value={fields.technology} onChange={(v) => updateField("technology", v)} />
                          </div>

                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <Target size={11} style={{ color: "var(--gov-blue)" }} /> Problem Type
                            </label>
                            <EditInput value={fields.problem_type} onChange={(v) => updateField("problem_type", v)} />
                          </div>

                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <MapPin size={11} style={{ color: "var(--gov-blue)" }} /> Geography
                            </label>
                            <EditInput value={fields.geography} onChange={(v) => updateField("geography", v)} />
                          </div>

                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <IndianRupee size={11} style={{ color: "var(--gov-blue)" }} /> Budget Range
                            </label>
                            <EditInput value={fields.budget} onChange={(v) => updateField("budget", v)} />
                          </div>

                          <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                            <label className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                              <Calendar size={11} style={{ color: "var(--gov-blue)" }} /> Timeline
                            </label>
                            <EditInput value={fields.timeline} onChange={(v) => updateField("timeline", v)} />
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <Layers size={11} style={{ color: "var(--gov-blue)" }} /> Domain
                            </p>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)" }}>{fields.domain}</span>
                              <button onClick={() => setTrace(kpiTrace("Domain", "Problem narrative + PRAMAN AI", fields.domain))} className="trace-link" style={{ fontSize: "0.68rem" }}>Trace</button>
                            </div>
                          </div>

                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <Cpu size={11} style={{ color: "var(--gov-blue)" }} /> Technology
                            </p>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)" }}>{fields.technology}</span>
                              <button onClick={() => setTrace(kpiTrace("Technology", "AI structuring engine", fields.technology))} className="trace-link" style={{ fontSize: "0.68rem" }}>Trace</button>
                            </div>
                          </div>

                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <Target size={11} style={{ color: "var(--gov-blue)" }} /> Problem Type
                            </p>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>{fields.problem_type}</span>
                          </div>

                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <MapPin size={11} style={{ color: "var(--gov-blue)" }} /> Geography
                            </p>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>{fields.geography}</span>
                          </div>

                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <IndianRupee size={11} style={{ color: "var(--gov-blue)" }} /> Budget Range
                            </p>
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)" }}>{fields.budget}</span>
                              <button onClick={() => setTrace(kpiTrace("Budget", "Problem statement", fields.budget))} className="trace-link" style={{ fontSize: "0.68rem" }}>Trace</button>
                            </div>
                          </div>

                          <div style={{ background: "#FFFFFF", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)" }}>
                            <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                              <Calendar size={11} style={{ color: "var(--gov-blue)" }} /> Timeline
                            </p>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink)" }}>{fields.timeline}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Deployment Context */}
                    <div style={{
                      borderRadius: 6, padding: "12px 16px",
                      background: isEditing ? "#F8FAFC" : "var(--surface)",
                      border: "1px solid var(--line)",
                    }}>
                      <p className="gov-section-label" style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                        <FileText size={11} style={{ color: "var(--gov-blue)" }} /> Deployment Context
                      </p>
                      {isEditing ? (
                        <EditInput
                          value={fields.deployment}
                          onChange={(v) => updateField("deployment", v)}
                          multiline
                          placeholder="Describe deployment environment, integration parameters, field constraints..."
                        />
                      ) : (
                        <p style={{ fontSize: "0.82rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.6 }}>
                          {fields.deployment}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Data Requirements (Read-only specification) */}
                {requirement.data_requirements && requirement.data_requirements.length > 0 && (
                  <div style={{ paddingTop: 4 }}>
                    <p className="gov-section-label" style={{ marginBottom: 8, fontSize: "0.68rem" }}>Data Requirements & Pre-requisites</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {requirement.data_requirements.map((d: string) => (
                        <span
                          key={d}
                          style={{
                            borderRadius: 4, background: "#EFF6FF", border: "1px solid #BFDBFE",
                            padding: "4px 10px", fontSize: "0.72rem", fontWeight: 600, color: "#1D4ED8",
                            boxShadow: "0 1px 2px rgba(29, 78, 216, 0.04)"
                          }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* ── Key Performance Indicators (KPIs) ── */}
            <Panel
              title={
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 700 }}>
                    Key Performance Indicators (KPIs)
                    <span style={{
                      fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                      background: "var(--mist)", color: "var(--ink-soft)"
                    }}>
                      {displayKpis.length} defined
                    </span>
                  </span>
                  <button
                    onClick={startAddKpi}
                    disabled={addingKpi}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      fontSize: "0.7rem", fontWeight: 700, padding: "5px 12px",
                      borderRadius: 4, border: "1px solid var(--gov-blue-border)",
                      background: "var(--gov-blue-light)", color: "var(--gov-blue)",
                      cursor: addingKpi ? "default" : "pointer",
                      opacity: addingKpi ? 0.5 : 1,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Plus size={12} /> Add Custom KPI
                  </button>
                </div>
              }
              icon={<Target size={15} style={{ color: "#16834B" }} />}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {/* Table Header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 80px",
                  gap: 12, padding: "10px 12px", background: "var(--gov-blue-light)",
                  borderRadius: "6px 6px 0 0", borderBottom: "1.5px solid var(--line)",
                  fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.08em", color: "var(--gov-navy)",
                }}>
                  <span>KPI / Success Criteria</span>
                  <span>Target / Benchmark</span>
                  <span>Measurement Method</span>
                  <span style={{ textAlign: "right" }}>Actions</span>
                </div>

                {/* KPI Rows */}
                <div style={{ border: "1px solid var(--line)", borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
                  {displayKpis.map((kpi, idx) => (
                    <div key={kpi.id} style={{
                      borderBottom: idx === displayKpis.length - 1 && !addingKpi ? "none" : "1px solid var(--line)",
                      background: idx % 2 === 0 ? "white" : "#F8FAFC",
                    }}>
                      {editingKpiId === kpi.id ? (
                        <div style={{
                          display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 80px",
                          gap: 10, padding: "10px 12px", alignItems: "center",
                          background: "#EFF6FF",
                        }}>
                          <input
                            type="text" value={kpiDraft.name}
                            onChange={(e) => setKpiDraft({ ...kpiDraft, name: e.target.value })}
                            placeholder="KPI Name"
                            style={{ fontSize: "0.78rem", padding: "6px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                          />
                          <input
                            type="text" value={kpiDraft.target}
                            onChange={(e) => setKpiDraft({ ...kpiDraft, target: e.target.value })}
                            placeholder="Target"
                            style={{ fontSize: "0.78rem", padding: "6px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                          />
                          <input
                            type="text" value={kpiDraft.method}
                            onChange={(e) => setKpiDraft({ ...kpiDraft, method: e.target.value })}
                            placeholder="Method"
                            style={{ fontSize: "0.78rem", padding: "6px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                          />
                          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                            <button
                              onClick={saveEditKpi}
                              style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #86EFAC", background: "#16834B", color: "white", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700 }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelKpiEdit}
                              style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid var(--line)", background: "white", color: "var(--ink-mid)", cursor: "pointer", fontSize: "0.68rem" }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 80px",
                          gap: 12, padding: "12px 14px", alignItems: "center",
                          transition: "background 0.15s ease",
                        }}>
                          <div>
                            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
                              {kpi.name}
                            </p>
                            {kpi.confidence && (
                              <span style={{ fontSize: "0.62rem", color: "#16834B", fontWeight: 600, background: "#DCFCE7", padding: "1px 6px", borderRadius: 3, display: "inline-block", marginTop: 3 }}>
                                {kpi.confidence}
                              </span>
                            )}
                          </div>
                          <div>
                            <span style={{
                              fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)",
                              background: "#F1F5F9", padding: "3px 8px", borderRadius: 4,
                              border: "1px solid #E2E8F0", display: "inline-block"
                            }}>
                              {kpi.target}
                            </span>
                          </div>
                          <div>
                            <p style={{ fontSize: "0.78rem", color: "var(--ink-mid)", margin: 0 }}>{kpi.method}</p>
                          </div>
                          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                            <button
                              onClick={() => startEditKpi(kpi)}
                              title="Edit KPI"
                              style={{
                                padding: "4px 7px", borderRadius: 4, border: "1px solid var(--line)",
                                background: "white", color: "var(--ink-mid)", cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => deleteKpi(kpi.id)}
                              title="Delete KPI"
                              style={{
                                padding: "4px 7px", borderRadius: 4, border: "1px solid #FECACA",
                                background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add KPI Row Form */}
                  {addingKpi && (
                    <div style={{
                      display: "grid", gridTemplateColumns: "1.2fr 1fr 1.2fr 80px",
                      gap: 10, padding: "12px 14px", alignItems: "center",
                      background: "#EFF6FF", borderTop: "2px dashed #BFDBFE"
                    }}>
                      <input
                        type="text" value={kpiDraft.name} placeholder="KPI Title / Metric..."
                        onChange={(e) => setKpiDraft({ ...kpiDraft, name: e.target.value })}
                        style={{ fontSize: "0.78rem", padding: "6px 10px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                      />
                      <input
                        type="text" value={kpiDraft.target} placeholder="Target threshold (e.g. >95%)..."
                        onChange={(e) => setKpiDraft({ ...kpiDraft, target: e.target.value })}
                        style={{ fontSize: "0.78rem", padding: "6px 10px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                      />
                      <input
                        type="text" value={kpiDraft.method} placeholder="Validation mechanism..."
                        onChange={(e) => setKpiDraft({ ...kpiDraft, method: e.target.value })}
                        style={{ fontSize: "0.78rem", padding: "6px 10px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                      />
                      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                        <button
                          onClick={saveNewKpi}
                          style={{ padding: "5px 10px", borderRadius: 4, border: "none", background: "#16834B", color: "white", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700 }}
                        >
                          Add
                        </button>
                        <button
                          onClick={cancelKpiEdit}
                          style={{ padding: "5px 8px", borderRadius: 4, border: "1px solid var(--line)", background: "white", color: "var(--ink-mid)", cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>

            {/* ── AI Suggestions — Advisory Hub ── */}
            <Panel
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 700 }}>AI Recommendations</span>
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700,
                    padding: "2px 7px", borderRadius: 4,
                    background: "var(--mist)", border: "1px solid var(--line)",
                    color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    Advisory Only
                  </span>
                </div>
              }
              icon={<Sparkles size={15} style={{ color: "#D97706" }} />}
            >
              <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 6 }}>
                <Info size={14} style={{ color: "#D97706", flexShrink: 0 }} />
                <p style={{ fontSize: "0.75rem", color: "#92400E", margin: 0, lineHeight: 1.4 }}>
                  PRAMAN AI recommends the following specifications based on the problem profile. <strong>Suggestions never overwrite officer entries and require explicit addition.</strong>
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {suggestions.map((s) => {
                  const style = CATEGORY_STYLES[s.category];
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                        borderRadius: 6, border: `1px solid ${s.added ? "#BBF7D0" : "var(--line)"}`,
                        borderLeft: `3px solid ${s.added ? "#16834B" : style.accent}`,
                        background: s.added ? "#F0FDF4" : "#FFFFFF",
                        padding: "10px 14px",
                        boxShadow: s.added ? "none" : "0 1px 2px rgba(15, 23, 42, 0.04)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: "0.62rem", fontWeight: 700, padding: "3px 8px",
                          borderRadius: 4, background: style.bg, border: `1px solid ${style.border}`,
                          color: style.text, textTransform: "uppercase", letterSpacing: "0.06em",
                          whiteSpace: "nowrap", flexShrink: 0,
                        }}>
                          {CATEGORY_ICONS[s.category]}
                          {s.categoryLabel}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--ink)", lineHeight: 1.4, fontWeight: 500 }}>
                          {s.text}
                        </span>
                      </div>

                      {s.added ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: "0.7rem", fontWeight: 700, color: "#16834B",
                          background: "#DCFCE7", padding: "4px 10px", borderRadius: 4,
                          border: "1px solid #86EFAC", whiteSpace: "nowrap", flexShrink: 0,
                        }}>
                          <Check size={12} /> Added
                        </span>
                      ) : (
                        <button
                          onClick={() => addSuggestion(s)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            fontSize: "0.7rem", fontWeight: 700, padding: "5px 12px",
                            borderRadius: 4, border: "1px solid #BFDBFE",
                            background: "#EFF6FF", color: "#1D4ED8",
                            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#DBEAFE";
                            e.currentTarget.style.borderColor = "#93C5FD";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#EFF6FF";
                            e.currentTarget.style.borderColor = "#BFDBFE";
                          }}
                        >
                          <Plus size={12} /> Add to Specs
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Workflow Step Tracker */}
            {requirement.status !== "Approved" && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
                padding: "12px 18px", borderRadius: 6,
                background: "linear-gradient(135deg, #F8FAFC 0%, #EEF5FC 100%)",
                border: "1px solid #D9E1EA",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "var(--gov-navy)", fontWeight: 700 }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Governance Flow:</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { label: "1. AI Structured", state: "done" },
                    { label: "2. Officer Review", state: "active" },
                    { label: "3. Field Edits", state: savedFields ? "done" : "idle" },
                    { label: "4. Sign-Off & Approve", state: "idle" },
                  ].map((step, idx) => (
                    <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{
                        padding: "3px 8px", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700,
                        background: step.state === "done" ? "#DCFCE7" : step.state === "active" ? "#1236B8" : "#FFFFFF",
                        color: step.state === "done" ? "#16834B" : step.state === "active" ? "#FFFFFF" : "var(--ink-soft)",
                        border: step.state === "done" ? "1px solid #BBF7D0" : step.state === "active" ? "none" : "1px solid var(--line)",
                      }}>
                        {step.label}
                      </span>
                      {idx < 3 && <ArrowRight size={12} style={{ color: "var(--ink-soft)", opacity: 0.5 }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Security, Constraints, Confidence */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            
            {/* Security Requirements */}
            <Panel title="Security & Compliance" icon={<ShieldAlert size={15} style={{ color: "#D97706" }} />} accent="saffron">
              <p style={{ fontSize: "0.8rem", color: "var(--ink-mid)", lineHeight: 1.6, margin: "0 0 12px" }}>
                {requirement.security}
              </p>
              <div style={{
                borderRadius: 5, background: "#FFFBEB", border: "1px solid #FDE68A",
                padding: "10px 12px", fontSize: "0.72rem", color: "#92400E", fontWeight: 500,
                display: "flex", alignItems: "flex-start", gap: 6
              }}>
                <Shield size={14} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
                <span>Mandatory CERT-In cybersecurity audit & data residency within India required before pilot gate release.</span>
              </div>
            </Panel>

            {/* Constraints */}
            <Panel title="Operational Constraints" icon={<AlertTriangle size={15} style={{ color: "#DC2626" }} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {requirement.constraints?.map((c: string) => (
                  <div
                    key={c}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      borderRadius: 5, background: "#FEF2F2", border: "1px solid #FECACA",
                      padding: "9px 12px", fontSize: "0.76rem", color: "#991B1B", lineHeight: 1.4,
                    }}
                  >
                    <ShieldAlert size={14} style={{ marginTop: 1, flexShrink: 0, color: "#DC2626" }} />
                    <span>{c}</span>
                  </div>
                ))}
                
                {/* Added Constraints from AI */}
                {suggestions.filter((s) => s.added && s.category === "constraint").map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 8,
                      borderRadius: 5, background: "#FFFBEB", border: "1px solid #FDE68A",
                      padding: "9px 12px", fontSize: "0.76rem", color: "#92400E", lineHeight: 1.4,
                    }}
                  >
                    <Shield size={14} style={{ marginTop: 1, flexShrink: 0, color: "#D97706" }} />
                    <span>{s.text} <strong style={{ fontSize: "0.62rem", color: "#B45309" }}>(Officer Added)</strong></span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* AI Confidence Scores */}
            <Panel title="AI Structuring Confidence" icon={<Sparkles size={15} style={{ color: "var(--gov-blue)" }} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(requirement.confidence?.fields || {}).map(([field, conf]: [string, any]) => (
                  <div key={field} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", textTransform: "capitalize", color: "var(--ink-mid)", fontWeight: 500 }}>
                      {field.replace(/_/g, " ")}
                    </span>
                    <Badge tone={conf === "HIGH" ? "success" : "amber"}>{conf}</Badge>
                  </div>
                ))}
                
                <div style={{
                  marginTop: 6, paddingTop: 10, borderTop: "1px solid var(--line)",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--ink)" }}>Overall Reliability</span>
                  <Badge tone={requirement.confidence?.overall === "HIGH" ? "success" : "amber"}>
                    {requirement.confidence?.overall || "HIGH"}
                  </Badge>
                </div>
              </div>
            </Panel>

            {/* Approved Milestone Banner */}
            {requirement.status === "Approved" && (
              <div
                style={{
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
                  border: "1px solid #86EFAC",
                  borderLeft: "4px solid #16834B",
                  padding: "16px 18px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(22, 131, 75, 0.1)",
                }}
              >
                <CheckCircle2 size={24} style={{ color: "#16834B", margin: "0 auto 8px" }} />
                <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "#16834B", margin: 0 }}>Requirements Officially Approved</p>
                <p style={{ fontSize: "0.72rem", color: "#15803D", margin: "4px 0 0", opacity: 0.9 }}>
                  Startup matching engine and sandbox pilots are unlocked.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Panel title="Requirement Structuring" icon={<ListChecks size={14} />}>
          <Empty
            text={problem ? "Click 'Structure with PRAMAN AI' to extract structured requirements from the problem narrative." : "Load Hero Scenario from Dashboard first."}
            action={problem ? "Structure with PRAMAN AI" : "Go to Dashboard → Load Hero Scenario"}
          />
        </Panel>
      )}
    </div>
  );
}
