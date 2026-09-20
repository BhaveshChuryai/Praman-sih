"use client";

import React, { useState, useMemo, useEffect } from "react";
import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, Action, AlertBanner, StatusBadge, kpiTrace } from "@/components/ui";
import {
  ListChecks, CheckCircle2, Sparkles, ShieldAlert, Pencil, Save, X,
  Plus, Trash2, AlertTriangle, Lightbulb, Target, Shield, Settings2,
  Layers, Cpu, MapPin, IndianRupee, Calendar, FileText, ArrowRight,
  HelpCircle, Check, Info, Lock, History, Clock, Building2,
  ChevronRight, ExternalLink, RefreshCw, Send, CheckSquare, Eye,
  SlidersHorizontal, Database, FileCheck, Share2
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

type KpiStatus = "On Track" | "Needs Review" | "Missing";

type KpiRow = {
  id: string;
  name: string;
  target: string;
  method: string;
  status: KpiStatus;
  confidence?: string;
};

type ConstraintCardType = "security" | "operational" | "integration";

type AiSuggestionCategory = "kpi" | "security" | "operational" | "integration" | "milestone";

type AiSuggestion = {
  id: string;
  text: string;
  category: AiSuggestionCategory;
  categoryLabel: string;
  added: boolean;
};

/* ═══════════════════════════════════════════════════════════════
   INITIAL DATA & FALLBACKS
   ═══════════════════════════════════════════════════════════════ */

const INITIAL_KPIS: KpiRow[] = [
  {
    id: "kpi-1",
    name: "Detection Accuracy",
    target: "≥85%",
    method: "Validated test dataset with ground truth video",
    status: "On Track",
    confidence: "High",
  },
  {
    id: "kpi-2",
    name: "False Positive Rate",
    target: "<10%",
    method: "Field evaluation across diverse weather/lighting",
    status: "Needs Review",
    confidence: "Medium",
  },
  {
    id: "kpi-3",
    name: "Processing Time",
    target: "<5 seconds",
    method: "Edge hardware system logs & benchmark telemetry",
    status: "On Track",
    confidence: "High",
  },
  {
    id: "kpi-4",
    name: "Fleet Coverage",
    target: "≥90%",
    method: "Deployment telemetry & GIS track analysis",
    status: "Needs Review",
    confidence: "Medium",
  },
];

const INITIAL_AI_SUGGESTIONS: AiSuggestion[] = [
  {
    id: "sug-1",
    text: "Consider adding end-to-end encryption requirements for edge-to-cloud telemetry transmission.",
    category: "security",
    categoryLabel: "Security & Compliance",
    added: false,
  },
  {
    id: "sug-2",
    text: "Consider defining 30 / 60 / 90-day sandbox pilot evaluation milestone gates.",
    category: "milestone",
    categoryLabel: "Pilot Milestones",
    added: false,
  },
  {
    id: "sug-3",
    text: "Consider measuring detection accuracy against manually verified ground truth samples.",
    category: "kpi",
    categoryLabel: "KPI Target",
    added: false,
  },
  {
    id: "sug-4",
    text: "Consider standardizing REST API endpoints with the Maharashtra State Data Center GIS schema.",
    category: "integration",
    categoryLabel: "Integration Requirements",
    added: false,
  },
];

const INITIAL_SECURITY_CONSTRAINTS = [
  "Mandatory CERT-In cybersecurity audit clearance prior to pilot deployment.",
  "Strict data residency within Indian geographic boundaries (DPDP Act 2023).",
  "Role-based access control (RBAC) and encrypted telemetry at rest (AES-256).",
];

const INITIAL_OPERATIONAL_CONSTRAINTS = [
  "Night-time and heavy monsoon rain false positive mitigation.",
  "Must operate on 12V DC public transport telemetry without draining vehicle battery.",
  "Zero disruption to active public bus transit schedules during data harvesting.",
];

const INITIAL_INTEGRATION_REQUIREMENTS = [
  "PWD Maharashtra GIS Asset Management Portal bi-directional API sync.",
  "Automated cryptographic telemetry anchoring in PRAMAN Evidence Locker.",
  "Automated work-order ticketing dispatch to zonal field maintenance engineers.",
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function RequirementsPage() {
  const {
    problem, requirement, structure, approveRequirement, approve,
    updateRequirement: contextUpdateRequirement, updateKpis: contextUpdateKpis,
    loading, error, setTrace, selectedCaseId
  } = usePraman();

  // ── Edit mode state for 7 primary fields ──
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState<EditableFields | null>(null);
  const [savedFields, setSavedFields] = useState<EditableFields | null>(null);
  const [editedFieldKeys, setEditedFieldKeys] = useState<Set<string>>(new Set());
  const [saveToast, setSaveToast] = useState(false);

  // ── KPI state ──
  const [kpiList, setKpiList] = useState<KpiRow[]>(INITIAL_KPIS);
  const [editingKpiId, setEditingKpiId] = useState<string | null>(null);
  const [kpiDraft, setKpiDraft] = useState<KpiRow>({ id: "", name: "", target: "", method: "", status: "On Track" });
  const [addingKpi, setAddingKpi] = useState(false);

  // ── Constraints state ──
  const [securityList, setSecurityList] = useState<string[]>(INITIAL_SECURITY_CONSTRAINTS);
  const [operationalList, setOperationalList] = useState<string[]>(INITIAL_OPERATIONAL_CONSTRAINTS);
  const [integrationList, setIntegrationList] = useState<string[]>(INITIAL_INTEGRATION_REQUIREMENTS);
  const [editingCard, setEditingCard] = useState<ConstraintCardType | null>(null);
  const [tempConstraintText, setTempConstraintText] = useState("");

  // ── AI Suggestions state ──
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>(INITIAL_AI_SUGGESTIONS);

  // ── Modals & Overlays ──
  const [versionModal, setVersionModal] = useState(false);
  const [aiReasoningModal, setAiReasoningModal] = useState(false);
  const [requestChangesModal, setRequestChangesModal] = useState(false);
  const [changesText, setChangesText] = useState("");
  const [changesToast, setChangesToast] = useState(false);

  // Sync state when active problem/case changes
  useEffect(() => {
    if (requirement && requirement.kpis && requirement.kpis.length > 0) {
      setKpiList(requirement.kpis.map((k: any, idx: number) => ({
        id: k.id || `kpi-${idx + 1}`,
        name: k.name,
        target: k.target,
        method: k.method || "Controlled telemetry benchmark & field verification",
        status: (k.status === "Needs Review" || k.met === false) ? "Needs Review" : "On Track",
        confidence: "High",
      })));
    }
    if (requirement?.security_constraints) {
      setSecurityList(requirement.security_constraints);
    }
    if (requirement?.operational_constraints) {
      setOperationalList(requirement.operational_constraints);
    }
    if (requirement?.integration_requirements) {
      setIntegrationList(requirement.integration_requirements);
    }
    setSavedFields(null);
    setIsEditing(false);
  }, [problem?.id, requirement?.id, selectedCaseId]);

  // Derive Display Fields
  const displayFields: EditableFields = useMemo(() => {
    if (savedFields) return savedFields;
    return {
      domain: problem?.domain || requirement?.domain || "Urban Infrastructure & Mobility",
      technology: problem?.technology || requirement?.technology || "Computer Vision & Edge AI",
      problem_type: problem?.title || requirement?.problem_type || "Predictive Infrastructure Maintenance",
      geography: problem?.location ? `${problem.location} District` : (requirement?.geography || "Pune District"),
      budget: problem?.budget || requirement?.budget || "₹50L – ₹1Cr (Estimated Pilot Head)",
      timeline: problem?.timeline_days ? `${problem.timeline_days} Days Sandbox Validation` : (requirement?.timeline || "90 Days Sandbox Validation"),
      deployment: problem?.deployment || requirement?.deployment || "Edge telemetry units retrofitted on public vehicles with automated GPS geo-tagging.",
    };
  }, [problem, requirement, savedFields]);

  // Current active fields
  const currentFields = isEditing && editFields ? editFields : displayFields;

  // Case details
  const caseContext = useMemo(() => {
    return {
      id: problem?.display_id || problem?.id || selectedCaseId || "PRB-MH-2026-1042",
      title: problem?.title || "Road damage detection using public transport telemetry",
      department: problem?.department || "PWD Maharashtra",
      location: problem?.location || "Pune",
      domain: problem?.domain || "Computer Vision & Edge AI",
      timeline: `${problem?.timeline_days || 90} Days`,
      stage: "Requirement Structuring",
      status: requirement?.status === "Approved" ? "Approved" : "Awaiting Officer Approval",
    };
  }, [problem, requirement, selectedCaseId]);

  // ── Edit Handlers ──
  function startEdit() {
    setEditFields({ ...displayFields });
    setIsEditing(true);
  }

  function cancelEdit() {
    setEditFields(null);
    setIsEditing(false);
  }

  function saveEdit() {
    if (!editFields) return;
    const changed = new Set(editedFieldKeys);
    Object.keys(editFields).forEach((key) => {
      const k = key as keyof EditableFields;
      if (editFields[k] !== displayFields[k]) {
        changed.add(k);
      }
    });
    setEditedFieldKeys(changed);
    setSavedFields({ ...editFields });
    if (contextUpdateRequirement) {
      contextUpdateRequirement(editFields);
    }
    setIsEditing(false);
    setEditFields(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  }

  function updateField(key: keyof EditableFields, value: string) {
    if (!editFields) return;
    setEditFields({ ...editFields, [key]: value });
  }

  // ── KPI Handlers ──
  function startAddKpi() {
    setKpiDraft({ id: `kpi-new-${Date.now()}`, name: "", target: "", method: "", status: "On Track" });
    setAddingKpi(true);
    setEditingKpiId(null);
  }

  function saveNewKpi() {
    if (!kpiDraft.name.trim()) return;
    const updated = [...kpiList, { ...kpiDraft }];
    setKpiList(updated);
    if (contextUpdateKpis) contextUpdateKpis(updated);
    setAddingKpi(false);
    setKpiDraft({ id: "", name: "", target: "", method: "", status: "On Track" });
  }

  function startEditKpi(k: KpiRow) {
    setKpiDraft({ ...k });
    setEditingKpiId(k.id);
    setAddingKpi(false);
  }

  function saveEditKpi() {
    const updated = kpiList.map((k) => (k.id === editingKpiId ? { ...kpiDraft } : k));
    setKpiList(updated);
    if (contextUpdateKpis) contextUpdateKpis(updated);
    setEditingKpiId(null);
    setKpiDraft({ id: "", name: "", target: "", method: "", status: "On Track" });
  }

  function deleteKpi(id: string) {
    const updated = kpiList.filter((k) => k.id !== id);
    setKpiList(updated);
    if (contextUpdateKpis) contextUpdateKpis(updated);
  }

  // ── AI Suggestion Addition Handlers ──
  function handleAddSuggestion(suggestion: AiSuggestion) {
    setSuggestions((prev) => prev.map((s) => (s.id === suggestion.id ? { ...s, added: true } : s)));

    if (suggestion.category === "kpi") {
      const updated = [
        ...kpiList,
        {
          id: `kpi-ai-${Date.now()}`,
          name: suggestion.text,
          target: "≥85% accuracy benchmark",
          method: "Controlled telemetry benchmark",
          status: "On Track" as const,
          confidence: "AI-Suggested",
        },
      ];
      setKpiList(updated);
      if (contextUpdateKpis) contextUpdateKpis(updated);
    } else if (suggestion.category === "security") {
      setSecurityList((prev) => [...prev, suggestion.text]);
    } else if (suggestion.category === "operational") {
      setOperationalList((prev) => [...prev, suggestion.text]);
    } else if (suggestion.category === "integration") {
      setIntegrationList((prev) => [...prev, suggestion.text]);
    }
  }

  // ── Constraint Edit Handlers ──
  function handleSaveConstraint() {
    if (!tempConstraintText.trim()) {
      setEditingCard(null);
      return;
    }
    if (editingCard === "security") {
      setSecurityList((prev) => [...prev, tempConstraintText.trim()]);
    } else if (editingCard === "operational") {
      setOperationalList((prev) => [...prev, tempConstraintText.trim()]);
    } else if (editingCard === "integration") {
      setIntegrationList((prev) => [...prev, tempConstraintText.trim()]);
    }
    setTempConstraintText("");
    setEditingCard(null);
  }

  function handleRequestChangesSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRequestChangesModal(false);
    setChangesText("");
    setChangesToast(true);
    setTimeout(() => setChangesToast(false), 4000);
  }

  const isApproved = requirement?.status === "Approved";

  // ── SECTION 11: DETERMINISTIC READINESS CALCULATION ──
  const readinessCalculation = useMemo(() => {
    const problemDefScore = caseContext.title ? 20 : 0;
    const techScore = (currentFields.technology && currentFields.domain) ? 20 : 10;
    const geoScore = currentFields.geography ? 15 : 0;
    const budgetScore = currentFields.budget ? 15 : 0;
    const deployScore = currentFields.deployment ? 10 : 0;

    const invalidKpis = kpiList.filter(k => !k.name || !k.target || !k.method || k.status === "Needs Review" || k.status === "Missing");
    let kpiScore = 10;
    let kpiDetail = "Complete";
    if (kpiList.length === 0) {
      kpiScore = 0;
      kpiDetail = "No KPIs defined";
    } else if (invalidKpis.length > 0) {
      kpiScore = Math.max(3, 10 - invalidKpis.length * 3);
      kpiDetail = `${invalidKpis.length} item(s) in review`;
    }

    let secScore = 10;
    let secDetail = "Complete";
    if (securityList.length === 0) {
      secScore = 0;
      secDetail = "Missing";
    } else if (!isApproved) {
      secScore = 8;
      secDetail = "Audit pending approval";
    }

    const calculatedScore = Math.min(100, isApproved ? 100 : (problemDefScore + techScore + geoScore + budgetScore + deployScore + kpiScore + secScore));

    return {
      score: calculatedScore,
      checklist: [
        { name: "Problem Definition", status: problemDefScore === 20 ? "pass" : "fail", detail: "Defined" },
        { name: "Technology & Domain", status: techScore === 20 ? "pass" : "fail", detail: "Structured" },
        { name: "Geography & Location", status: geoScore === 15 ? "pass" : "fail", detail: "Mapped" },
        { name: "Budget Range", status: budgetScore === 15 ? "pass" : "fail", detail: "Allocated" },
        { name: "Deployment Context", status: deployScore === 10 ? "pass" : "fail", detail: "Specified" },
        { name: "KPIs & Success Criteria", status: invalidKpis.length === 0 ? "pass" : "attention", detail: kpiDetail },
        { name: "Security & Compliance", status: isApproved ? "pass" : "attention", detail: secDetail },
      ],
      pendingCount: (invalidKpis.length > 0 ? 1 : 0) + (isApproved ? 0 : 1),
    };
  }, [caseContext.title, currentFields, kpiList, securityList, isApproved]);

  const readinessPct = readinessCalculation.score;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>

      {/* ═══════════════════════════════════════════════════════════════
         3. PAGE HEADER
         ═══════════════════════════════════════════════════════════════ */}
      <GovPageHeader
        eyebrow="Problem to Pilot"
        title="Requirements"
        subtitle="AI-structured procurement requirements for review and officer approval"
        recordId={caseContext.id}
        actions={
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {/* Version Badge */}
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, padding: "5px 10px", borderRadius: 5,
              background: "#F1F5F9", color: "var(--ink-mid)", border: "1px solid var(--line)"
            }}>
              Version v1.2
            </span>

            {/* View History Button */}
            <button
              onClick={() => setVersionModal(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: "0.74rem", fontWeight: 600, padding: "6px 12px",
                borderRadius: 5, border: "1px solid var(--line)",
                background: "#FFFFFF", color: "var(--ink)", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)"
              }}
            >
              <History size={13} style={{ color: "var(--gov-blue)" }} />
              View History
            </button>

            {/* Structure with PRAMAN AI (if unprompted) */}
            {!requirement && (
              <Action
                onClick={structure}
                label="Structure with PRAMAN AI"
                icon={<Sparkles size={14} />}
                disabled={!problem || loading === "Structuring problem"}
                size="sm"
              />
            )}

            {/* Primary Approve Action Button */}
            <button
              onClick={approve}
              disabled={!requirement || isApproved || loading === "Approving requirement"}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: "0.78rem", fontWeight: 800, padding: "7px 16px",
                borderRadius: 5, border: "none",
                background: isApproved ? "#16834B" : "#1D4ED8",
                color: "#FFFFFF",
                cursor: !requirement || isApproved ? "default" : "pointer",
                boxShadow: isApproved ? "none" : "0 2px 6px rgba(29, 78, 216, 0.25)",
                opacity: !requirement ? 0.6 : 1,
              }}
            >
              {isApproved ? (
                <>
                  <CheckCircle2 size={14} /> Requirements Approved
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Approve Requirements →
                </>
              )}
            </button>
          </div>
        }
      />

      {error && <AlertBanner type="error" message={error} />}

      {/* Loading banner */}
      {loading && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 16px",
          background: "#EFF6FF", border: "1px solid #BFDBFE", borderLeft: "4px solid var(--gov-blue)",
          boxShadow: "0 2px 6px rgba(18, 54, 184, 0.08)",
        }}>
          <Sparkles size={16} style={{ color: "var(--gov-blue)" }} className="animate-pulse" />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gov-blue)" }}>{loading}…</span>
        </div>
      )}

      {/* Save Success Toast */}
      {saveToast && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 18px",
          background: "#F0FDF4", border: "1px solid #BBF7D0", borderLeft: "4px solid #16834B",
          boxShadow: "0 2px 8px rgba(22, 131, 75, 0.12)",
        }}>
          <CheckCircle2 size={16} style={{ color: "#16834B" }} />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#16834B" }}>
            Requirements changes saved successfully. Marked as "OFFICER EDITED".
          </span>
          <span style={{ fontSize: "0.7rem", color: "#15803D", marginLeft: "auto", fontWeight: 600 }}>
            Single source of truth updated
          </span>
        </div>
      )}

      {/* Changes Request Toast */}
      {changesToast && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, borderRadius: 6, padding: "12px 18px",
          background: "#FFFBEB", border: "1px solid #FDE68A", borderLeft: "4px solid #D97706",
          boxShadow: "0 2px 8px rgba(217, 119, 6, 0.12)",
        }}>
          <Info size={16} style={{ color: "#D97706" }} />
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B45309" }}>
            Change request submitted to departmental engineering team. Recorded in case history.
          </span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         4. CASE CONTEXT CARD (Horizontal Compact Strip)
         ═══════════════════════════════════════════════════════════════ */}
      <div style={{
        background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
        padding: "14px 18px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14
      }}>
        {/* Left Side: Case Identifier, Title & Context Pills */}
        <div style={{ flex: "1 1 480px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: "0.68rem", fontWeight: 800, color: "#1D4ED8",
              background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: 4,
              textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "monospace"
            }}>
              PROCUREMENT CASE
            </span>
            <span style={{
              fontFamily: "monospace", fontSize: "0.74rem", fontWeight: 800, color: "var(--gov-navy)"
            }}>
              {caseContext.id}
            </span>
          </div>

          <h2 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gov-navy)", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            {caseContext.title}
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: "0.75rem", color: "var(--ink-mid)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Building2 size={13} style={{ color: "var(--gov-blue)" }} /> {caseContext.department}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <MapPin size={13} style={{ color: "var(--gov-blue)" }} /> {caseContext.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Target size={13} style={{ color: "var(--gov-blue)" }} /> {caseContext.domain}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={13} style={{ color: "var(--gov-blue)" }} /> {caseContext.timeline}
            </span>
          </div>
        </div>

        {/* Right Side: Current Stage & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right", paddingRight: 16, borderRight: "1px solid var(--line)" }}>
            <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.64rem" }}>Current Stage</p>
            <p style={{ fontSize: "0.86rem", fontWeight: 800, color: "var(--gov-blue)", margin: 0 }}>
              {caseContext.stage}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.64rem" }}>Status</p>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: "0.72rem", fontWeight: 800, padding: "3px 9px", borderRadius: 4,
              background: isApproved ? "#DCFCE7" : "#FFFBEB",
              border: `1px solid ${isApproved ? "#BBF7D0" : "#FDE68A"}`,
              color: isApproved ? "#15803D" : "#B45309",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: isApproved ? "#16834B" : "#D97706" }} />
              {caseContext.status}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MAIN WORKSPACE: 2 COLUMNS (72% Main / 28% Review Support)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 min-w-0">
        
        {/* ── LEFT / MAIN CONTENT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* ═══════════════════════════════════════════════════════════
             5 & 6. STRUCTURED REQUIREMENTS (PRIMARY SECTION)
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 800 }}>
                  STRUCTURED REQUIREMENTS
                </span>
                <div>
                  {!isEditing ? (
                    <button
                      onClick={startEdit}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: "0.72rem", fontWeight: 700, padding: "5px 12px",
                        borderRadius: 4, border: "1px solid #BFDBFE",
                        background: "#EFF6FF", color: "#1D4ED8",
                        cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      <Pencil size={12} /> Edit Requirements
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={saveEdit}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: "0.72rem", fontWeight: 700, padding: "5px 12px",
                          borderRadius: 4, border: "none",
                          background: "#16834B", color: "#FFFFFF",
                          cursor: "pointer",
                        }}
                      >
                        <Save size={12} /> Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          fontSize: "0.72rem", fontWeight: 600, padding: "5px 10px",
                          borderRadius: 4, border: "1px solid var(--line)",
                          background: "#FFFFFF", color: "var(--ink-mid)",
                          cursor: "pointer",
                        }}
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            }
            icon={<ListChecks size={15} style={{ color: "var(--gov-blue)" }} />}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              {/* 3-Column 7-Field Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Field 1: Requirement ID (Read-only) */}
                <div style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem" }}>Requirement ID</span>
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 3,
                      background: "#EEF2F6", color: "var(--ink-soft)", textTransform: "uppercase"
                    }}>
                      READ ONLY
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Lock size={12} style={{ color: "var(--ink-soft)" }} />
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0, fontFamily: "monospace" }}>
                      {requirement?.id || "REQ-2026-1042"}
                    </p>
                  </div>
                </div>

                {/* Field 2: Domain */}
                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <Layers size={11} style={{ color: "var(--gov-blue)" }} /> Domain
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("domain") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("domain") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("domain") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("domain") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentFields.domain}
                      onChange={(e) => updateField("domain", e.target.value)}
                      style={{ width: "100%", fontSize: "0.82rem", fontWeight: 700, padding: "4px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
                      {currentFields.domain}
                    </p>
                  )}
                </div>

                {/* Field 3: Technology */}
                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <Cpu size={11} style={{ color: "var(--gov-blue)" }} /> Technology
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("technology") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("technology") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("technology") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("technology") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentFields.technology}
                      onChange={(e) => updateField("technology", e.target.value)}
                      style={{ width: "100%", fontSize: "0.82rem", fontWeight: 700, padding: "4px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
                      {currentFields.technology}
                    </p>
                  )}
                </div>

                {/* Field 4: Problem Type */}
                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <Target size={11} style={{ color: "var(--gov-blue)" }} /> Problem Type
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("problem_type") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("problem_type") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("problem_type") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("problem_type") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentFields.problem_type}
                      onChange={(e) => updateField("problem_type", e.target.value)}
                      style={{ width: "100%", fontSize: "0.82rem", fontWeight: 700, padding: "4px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
                      {currentFields.problem_type}
                    </p>
                  )}
                </div>

                {/* Field 5: Geography */}
                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} style={{ color: "var(--gov-blue)" }} /> Geography
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("geography") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("geography") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("geography") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("geography") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentFields.geography}
                      onChange={(e) => updateField("geography", e.target.value)}
                      style={{ width: "100%", fontSize: "0.82rem", fontWeight: 700, padding: "4px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
                      {currentFields.geography}
                    </p>
                  )}
                </div>

                {/* Field 6: Budget Range */}
                <div style={{ background: "#FFFFFF", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.62rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <IndianRupee size={11} style={{ color: "var(--gov-blue)" }} /> Budget Range
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("budget") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("budget") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("budget") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("budget") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentFields.budget}
                      onChange={(e) => updateField("budget", e.target.value)}
                      style={{ width: "100%", fontSize: "0.82rem", fontWeight: 700, padding: "4px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>
                      {currentFields.budget}
                    </p>
                  )}
                </div>

              </div>

              {/* Field 7: Timeline + Full Width Deployment Context */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                
                {/* Timeline Strip */}
                <div style={{ background: "#FFFFFF", padding: "10px 14px", borderRadius: 6, border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="gov-section-label" style={{ margin: 0, fontSize: "0.66rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} style={{ color: "var(--gov-blue)" }} /> Timeline Window
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentFields.timeline}
                        onChange={(e) => updateField("timeline", e.target.value)}
                        style={{ fontSize: "0.82rem", fontWeight: 700, padding: "3px 8px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                      />
                    ) : (
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--ink)" }}>{currentFields.timeline}</span>
                    )}
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("timeline") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("timeline") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("timeline") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("timeline") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                </div>

                {/* Deployment Context (Full Width) */}
                <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: 6, border: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span className="gov-section-label" style={{ margin: 0, fontSize: "0.66rem", display: "flex", alignItems: "center", gap: 4 }}>
                      <FileText size={12} style={{ color: "var(--gov-blue)" }} /> Deployment Context & Constraints
                    </span>
                    <span style={{
                      fontSize: "0.58rem", fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                      background: editedFieldKeys.has("deployment") ? "#FEF3C7" : "#EFF6FF",
                      color: editedFieldKeys.has("deployment") ? "#B45309" : "#1D4ED8",
                      border: `1px solid ${editedFieldKeys.has("deployment") ? "#FDE68A" : "#BFDBFE"}`,
                      textTransform: "uppercase"
                    }}>
                      {editedFieldKeys.has("deployment") ? "OFFICER EDITED" : "AI GENERATED"}
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={currentFields.deployment}
                      onChange={(e) => updateField("deployment", e.target.value)}
                      rows={3}
                      style={{ width: "100%", fontSize: "0.82rem", padding: "6px 10px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", resize: "vertical" }}
                    />
                  ) : (
                    <p style={{ fontSize: "0.82rem", color: "var(--ink-mid)", margin: 0, lineHeight: 1.55 }}>
                      {currentFields.deployment}
                    </p>
                  )}
                </div>

              </div>
            </div>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
             9. SUCCESS CRITERIA & KPIs (MOST IMPORTANT NEW SECTION)
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 800 }}>
                  SUCCESS CRITERIA & KPIs
                  <span style={{
                    fontSize: "0.64rem", fontWeight: 700, padding: "2px 7px", borderRadius: 10,
                    background: "var(--mist)", color: "var(--ink-soft)"
                  }}>
                    {kpiList.length} defined
                  </span>
                </span>
                <button
                  onClick={startAddKpi}
                  disabled={addingKpi}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: "0.7rem", fontWeight: 700, padding: "5px 12px",
                    borderRadius: 4, border: "1px solid #BFDBFE",
                    background: "#EFF6FF", color: "#1D4ED8",
                    cursor: addingKpi ? "default" : "pointer",
                    opacity: addingKpi ? 0.5 : 1,
                  }}
                >
                  <Plus size={12} /> Add KPI
                </button>
              </div>
            }
            icon={<Target size={15} style={{ color: "#16834B" }} />}
          >
            <div style={{ overflowX: "auto" }}>
              <table className="gov-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr>
                    <th style={{ width: 32, textAlign: "center" }}>#</th>
                    <th style={{ width: "26%" }}>KPI</th>
                    <th style={{ width: "20%" }}>Target</th>
                    <th>Measurement Method</th>
                    <th style={{ width: 110 }}>Status</th>
                    <th style={{ width: 70, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {kpiList.map((kpi, idx) => (
                    <tr key={kpi.id}>
                      {editingKpiId === kpi.id ? (
                        <>
                          <td style={{ textAlign: "center", fontWeight: 700 }}>{idx + 1}</td>
                          <td>
                            <input
                              type="text"
                              value={kpiDraft.name}
                              onChange={(e) => setKpiDraft({ ...kpiDraft, name: e.target.value })}
                              style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={kpiDraft.target}
                              onChange={(e) => setKpiDraft({ ...kpiDraft, target: e.target.value })}
                              style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={kpiDraft.method}
                              onChange={(e) => setKpiDraft({ ...kpiDraft, method: e.target.value })}
                              style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none" }}
                            />
                          </td>
                          <td>
                            <select
                              value={kpiDraft.status}
                              onChange={(e) => setKpiDraft({ ...kpiDraft, status: e.target.value as KpiStatus })}
                              style={{ fontSize: "0.72rem", padding: "3px 6px", border: "1px solid var(--line)", borderRadius: 4 }}
                            >
                              <option value="On Track">On Track</option>
                              <option value="Needs Review">Needs Review</option>
                              <option value="Missing">Missing</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                              <button onClick={saveEditKpi} style={{ padding: "3px 6px", borderRadius: 3, background: "#16834B", color: "white", border: "none", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer" }}>Save</button>
                              <button onClick={() => setEditingKpiId(null)} style={{ padding: "3px 6px", borderRadius: 3, background: "white", border: "1px solid var(--line)", fontSize: "0.68rem", cursor: "pointer" }}>✕</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ textAlign: "center", fontWeight: 800, color: "var(--ink-soft)" }}>{idx + 1}</td>
                          <td>
                            <p style={{ fontWeight: 700, color: "var(--ink)", margin: 0 }}>{kpi.name}</p>
                          </td>
                          <td style={{ fontWeight: 800, color: "var(--gov-navy)", fontFamily: "monospace" }}>
                            {kpi.target}
                          </td>
                          <td style={{ color: "var(--ink-mid)", fontSize: "0.74rem" }}>
                            {kpi.method}
                          </td>
                          <td>
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: "0.66rem", fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                              background: kpi.status === "On Track" ? "#F0FDF4" : kpi.status === "Needs Review" ? "#FFFBEB" : "#FEF2F2",
                              border: `1px solid ${kpi.status === "On Track" ? "#BBF7D0" : kpi.status === "Needs Review" ? "#FDE68A" : "#FECACA"}`,
                              color: kpi.status === "On Track" ? "#15803D" : kpi.status === "Needs Review" ? "#B45309" : "#DC2626",
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: kpi.status === "On Track" ? "#16834B" : kpi.status === "Needs Review" ? "#D97706" : "#DC2626" }} />
                              {kpi.status}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                              <button
                                onClick={() => startEditKpi(kpi)}
                                style={{ padding: "3px 6px", borderRadius: 3, border: "1px solid var(--line)", background: "white", color: "var(--ink-mid)", cursor: "pointer" }}
                                title="Edit KPI"
                              >
                                <Pencil size={11} />
                              </button>
                              <button
                                onClick={() => deleteKpi(kpi.id)}
                                style={{ padding: "3px 6px", borderRadius: 3, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer" }}
                                title="Delete KPI"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}

                  {/* Add New KPI Row */}
                  {addingKpi && (
                    <tr style={{ background: "#EFF6FF" }}>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>+</td>
                      <td>
                        <input
                          type="text" placeholder="KPI Title..."
                          value={kpiDraft.name} onChange={(e) => setKpiDraft({ ...kpiDraft, name: e.target.value })}
                          style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text" placeholder="Target (e.g. ≥90%)..."
                          value={kpiDraft.target} onChange={(e) => setKpiDraft({ ...kpiDraft, target: e.target.value })}
                          style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                        />
                      </td>
                      <td>
                        <input
                          type="text" placeholder="Measurement method..."
                          value={kpiDraft.method} onChange={(e) => setKpiDraft({ ...kpiDraft, method: e.target.value })}
                          style={{ width: "100%", fontSize: "0.76rem", padding: "4px 6px", border: "1.5px solid #3B82F6", borderRadius: 4, outline: "none", background: "white" }}
                        />
                      </td>
                      <td>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#1D4ED8" }}>New KPI</span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                          <button onClick={saveNewKpi} style={{ padding: "4px 8px", borderRadius: 3, background: "#16834B", color: "white", border: "none", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer" }}>Add</button>
                          <button onClick={() => setAddingKpi(false)} style={{ padding: "4px 8px", borderRadius: 3, background: "white", border: "1px solid var(--line)", fontSize: "0.68rem", cursor: "pointer" }}>✕</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
             10. KEY REQUIREMENTS & CONSTRAINTS (3 COMPACT CARDS)
             ═══════════════════════════════════════════════════════════ */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p className="gov-section-label" style={{ margin: 0 }}>KEY REQUIREMENTS & CONSTRAINTS</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Card A: Security & Compliance */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Shield size={14} style={{ color: "#D97706" }} />
                      <h4 style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>Security & Compliance</h4>
                    </div>
                    <button
                      onClick={() => setEditingCard("security")}
                      style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gov-blue)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      + Add
                    </button>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: "0.74rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    {securityList.map((item, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card B: Operational Constraints */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ShieldAlert size={14} style={{ color: "#DC2626" }} />
                      <h4 style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>Operational Constraints</h4>
                    </div>
                    <button
                      onClick={() => setEditingCard("operational")}
                      style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gov-blue)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      + Add
                    </button>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: "0.74rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    {operationalList.map((item, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card C: Integration Requirements */}
              <div style={{ background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Settings2 size={14} style={{ color: "var(--gov-blue)" }} />
                      <h4 style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>Integration Requirements</h4>
                    </div>
                    <button
                      onClick={() => setEditingCard("integration")}
                      style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--gov-blue)", background: "none", border: "none", cursor: "pointer" }}
                    >
                      + Add
                    </button>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: "0.74rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>
                    {integrationList.map((item, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
             11. NON-FUNCTIONAL REQUIREMENTS (COMPACT STRIP)
             ═══════════════════════════════════════════════════════════ */}
          <div style={{
            background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 6,
            padding: "12px 16px", boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)"
          }}>
            <p className="gov-section-label" style={{ marginBottom: 8, fontSize: "0.64rem" }}>NON-FUNCTIONAL SPECIFICATIONS</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Performance</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>&lt;5 sec processing</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Availability</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>≥99% during pilot</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Security</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>CERT-In compliance</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Scalability</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>500+ vehicles</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Data Residency</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>India-based storage</span>
              </div>
              <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.6rem", color: "var(--ink-soft)", fontWeight: 700, display: "block" }}>Integration</span>
                <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gov-navy)" }}>REST API support</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
             14. AI SUGGESTIONS — ADVISORY HUB
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 800 }}>
                  PRAMAN AI SUGGESTIONS
                  <span style={{
                    fontSize: "0.58rem", fontWeight: 800, padding: "1px 6px", borderRadius: 3,
                    background: "#FEF3C7", color: "#B45309", textTransform: "uppercase"
                  }}>
                    Advisory Only
                  </span>
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--ink-soft)", fontWeight: 500 }}>
                  Requires explicit officer action
                </span>
              </div>
            }
            icon={<Sparkles size={14} style={{ color: "#D97706" }} />}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "8px 12px", borderRadius: 5,
                    background: s.added ? "#F0FDF4" : "#F8FAFC",
                    border: `1px solid ${s.added ? "#BBF7D0" : "var(--line)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <span style={{
                      fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 3,
                      background: "#EFF6FF", color: "#1D4ED8", textTransform: "uppercase", whiteSpace: "nowrap"
                    }}>
                      {s.categoryLabel}
                    </span>
                    <span style={{ fontSize: "0.76rem", color: "var(--ink)", fontWeight: 500 }}>
                      {s.text}
                    </span>
                  </div>

                  {s.added ? (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 3,
                      fontSize: "0.68rem", fontWeight: 700, color: "#16834B",
                      background: "#DCFCE7", padding: "3px 8px", borderRadius: 4, whiteSpace: "nowrap"
                    }}>
                      <Check size={11} /> Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddSuggestion(s)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 4,
                        border: "1px solid #BFDBFE", background: "#EFF6FF", color: "#1D4ED8",
                        cursor: "pointer", whiteSpace: "nowrap"
                      }}
                    >
                      <Plus size={11} />
                      {s.category === "security" && "Add to Security"}
                      {s.category === "operational" && "Add to Constraints"}
                      {s.category === "integration" && "Add to Integration"}
                      {s.category === "kpi" && "Add KPI"}
                      {s.category === "milestone" && "Add to Pilot Requirements"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
             15. APPROVAL READINESS — FINAL BOTTOM SECTION
             ═══════════════════════════════════════════════════════════ */}
          <div style={{
            background: "#FFFFFF", border: "1px solid var(--line)", borderRadius: 8,
            padding: "16px 20px", boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05)",
            borderLeft: `4px solid ${isApproved ? "#16834B" : "#1D4ED8"}`,
            display: "flex", flexDirection: "column", gap: 12
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <p className="gov-section-label" style={{ marginBottom: 2, fontSize: "0.65rem" }}>APPROVAL READINESS</p>
                <h3 style={{ fontSize: "0.98rem", fontWeight: 800, color: "var(--gov-navy)", margin: "0 0 2px" }}>
                  {isApproved ? "Requirement Formally Approved & Sealed" : "Ready for Officer Review & Approval"}
                </h3>
                <p style={{ fontSize: "0.74rem", color: "var(--ink-mid)", margin: 0 }}>
                  {isApproved
                    ? "Structured requirement is locked and active for downstream AI startup matching and 90-day sandbox pilot gates."
                    : `Requirement is ${readinessPct}% complete. 2 items require attention before formal approval.`
                  }
                </p>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                {!isApproved && (
                  <>
                    <button
                      onClick={startEdit}
                      style={{
                        padding: "7px 14px", borderRadius: 5, fontSize: "0.74rem", fontWeight: 700,
                        background: "#FFFFFF", border: "1px solid var(--line)", color: "var(--ink)",
                        cursor: "pointer"
                      }}
                    >
                      <Pencil size={12} style={{ display: "inline", marginRight: 4 }} /> Edit Requirements
                    </button>

                    <button
                      onClick={() => setRequestChangesModal(true)}
                      style={{
                        padding: "7px 14px", borderRadius: 5, fontSize: "0.74rem", fontWeight: 700,
                        background: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309",
                        cursor: "pointer"
                      }}
                    >
                      Request Changes
                    </button>
                  </>
                )}

                <button
                  onClick={approve}
                  disabled={isApproved || loading === "Approving requirement"}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 18px", borderRadius: 5, fontSize: "0.78rem", fontWeight: 800,
                    background: isApproved ? "#16834B" : "#1D4ED8",
                    color: "#FFFFFF", border: "none",
                    cursor: isApproved ? "default" : "pointer",
                    boxShadow: isApproved ? "none" : "0 2px 6px rgba(29, 78, 216, 0.25)"
                  }}
                >
                  {isApproved ? (
                    <>
                      <CheckCircle2 size={14} /> Approved & Ready for Matching
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Approve Requirements →
                    </>
                  )}
                </button>
              </div>
            </div>

            <div style={{
              padding: "8px 12px", borderRadius: 5, background: "#F8FAFC", border: "1px solid var(--line)",
              fontSize: "0.7rem", color: "var(--ink-soft)", lineHeight: 1.45
            }}>
              <strong>Governance Statement:</strong> "Approval confirms that the structured requirement is suitable for downstream startup matching and pilot evaluation. AI-generated content remains subject to officer review."
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN: REVIEW SUPPORT & READINESS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ═══════════════════════════════════════════════════════════
             7. REQUIREMENT READINESS (RIGHT COLUMN)
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title="REQUIREMENT READINESS"
            icon={<CheckSquare size={14} style={{ color: "var(--gov-blue)" }} />}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              
              {/* Progress Indicator */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--line)" }}>
                <div>
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--gov-navy)", fontFamily: "monospace" }}>
                    {readinessPct}%
                  </span>
                  <p style={{ fontSize: "0.65rem", color: "var(--ink-soft)", margin: 0, fontWeight: 600 }}>Overall Readiness Score</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF", border: "3px solid #1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1D4ED8" }}>{readinessPct}%</span>
                </div>
              </div>

              {/* Readiness Checklist */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.74rem" }}>
                {readinessCalculation.checklist.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      color: item.status === "pass" ? "#166534" : "#B45309"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {item.status === "pass" ? (
                        <Check size={13} style={{ color: "#16834B" }} />
                      ) : (
                        <AlertTriangle size={13} style={{ color: "#D97706" }} />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <span style={{ fontSize: "0.68rem", opacity: 0.85, fontWeight: 600 }}>
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Notice */}
              {!isApproved && (
                <div style={{
                  padding: "8px 10px", borderRadius: 5, background: "#FFFBEB", border: "1px solid #FDE68A",
                  fontSize: "0.68rem", color: "#92400E", fontWeight: 600
                }}>
                  {readinessCalculation.pendingCount > 0
                    ? `${readinessCalculation.pendingCount} item(s) require officer verification before approval.`
                    : "All 7 dimensions structured. Ready for officer approval sign-off."}
                </div>
              )}
            </div>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
             8. PRAMAN AI SUMMARY (COMPACT)
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title="PRAMAN AI SUMMARY"
            icon={<Sparkles size={14} style={{ color: "var(--gov-blue)" }} />}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: "0.76rem", color: "var(--ink-mid)", lineHeight: 1.55, margin: 0 }}>
                {`"PRAMAN identified this requirement as a ${caseContext.domain} solution for ${caseContext.title} in ${caseContext.location} for ${caseContext.department}."`}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", background: "#EFF6FF", borderRadius: 5, border: "1px solid #BFDBFE" }}>
                <span style={{ fontSize: "0.72rem", color: "#1D4ED8", fontWeight: 700 }}>AI Confidence</span>
                <span style={{ fontSize: "0.82rem", color: "#1D4ED8", fontWeight: 900, fontFamily: "monospace" }}>92%</span>
              </div>

              <div>
                <p className="gov-section-label" style={{ marginBottom: 4, fontSize: "0.62rem" }}>Sources Used:</p>
                <ul style={{ margin: 0, paddingLeft: 14, fontSize: "0.72rem", color: "var(--ink-mid)", lineHeight: 1.5 }}>
                  <li>{`Department Problem Statement (${caseContext.id})`}</li>
                  <li>Field Telemetry Constraints & Specifications</li>
                  <li>Historical State Procurement Standard Benchmarks</li>
                </ul>
              </div>

              <button
                onClick={() => setAiReasoningModal(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: "0.72rem", fontWeight: 700, color: "var(--gov-blue)",
                  background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 2
                }}
              >
                View AI Reasoning →
              </button>
            </div>
          </Panel>

          {/* ═══════════════════════════════════════════════════════════
             13. RECENT ACTIVITY / VERSION HISTORY
             ═══════════════════════════════════════════════════════════ */}
          <Panel
            title="RECENT ACTIVITY"
            icon={<History size={14} style={{ color: "var(--ink-soft)" }} />}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ borderLeft: "2px solid #1D4ED8", paddingLeft: 10 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#1D4ED8" }}>v1.2</span>
                <p style={{ fontSize: "0.74rem", color: "var(--ink)", margin: "1px 0", fontWeight: 600 }}>
                  Officer reviewed & edited fields
                </p>
                <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>20 Sep 2026</span>
              </div>

              <div style={{ borderLeft: "2px solid #CBD5E1", paddingLeft: 10 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--ink-soft)" }}>v1.1</span>
                <p style={{ fontSize: "0.74rem", color: "var(--ink)", margin: "1px 0" }}>
                  AI generated structured requirements
                </p>
                <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>20 Sep 2026</span>
              </div>

              <div style={{ borderLeft: "2px solid #CBD5E1", paddingLeft: 10 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--ink-soft)" }}>v1.0</span>
                <p style={{ fontSize: "0.74rem", color: "var(--ink)", margin: "1px 0" }}>
                  Problem statement submitted
                </p>
                <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>19 Sep 2026</span>
              </div>

              <button
                onClick={() => setVersionModal(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: "0.72rem", fontWeight: 700, color: "var(--gov-blue)",
                  background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4
                }}
              >
                View Full Audit History →
              </button>
            </div>
          </Panel>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 1: VERSION HISTORY
         ═══════════════════════════════════════════════════════════════ */}
      {versionModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={() => setVersionModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: "10px 10px 0 0" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gov-blue)", margin: "0 0 2px" }}>
                  Audit Trail
                </p>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                  Requirements Version History
                </h3>
              </div>
              <button onClick={() => setVersionModal(false)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: "12px 14px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1D4ED8" }}>Version v1.2 (Current Active)</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>20 Sep 2026, 05:42 IST</span>
                </div>
                <p style={{ fontSize: "0.74rem", color: "var(--ink)", margin: "0 0 4px" }}>
                  Officer updated Budget Range, Timeline & KPI Thresholds.
                </p>
                <span style={{ fontSize: "0.64rem", color: "#1E40AF", fontWeight: 600 }}>By: Nodal Officer (officer@praman.local)</span>
              </div>

              <div style={{ padding: "12px 14px", background: "#F8FAFC", border: "1px solid var(--line)", borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gov-navy)" }}>Version v1.1</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>20 Sep 2026, 04:15 IST</span>
                </div>
                <p style={{ fontSize: "0.74rem", color: "var(--ink-mid)", margin: "0 0 4px" }}>
                  PRAMAN AI extracted 7 structured requirement dimensions from natural language problem narrative.
                </p>
                <span style={{ fontSize: "0.64rem", color: "var(--ink-soft)" }}>By: PRAMAN AI Structuring Agent (v2.4)</span>
              </div>

              <div style={{ padding: "12px 14px", background: "#F8FAFC", border: "1px solid var(--line)", borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gov-navy)" }}>Version v1.0</span>
                  <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)" }}>19 Sep 2026, 18:30 IST</span>
                </div>
                <p style={{ fontSize: "0.74rem", color: "var(--ink-mid)", margin: "0 0 4px" }}>
                  Problem Statement registered in PWD Maharashtra Nodal Registry.
                </p>
                <span style={{ fontSize: "0.64rem", color: "var(--ink-soft)" }}>By: Executive Engineer, PWD Pune</span>
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", background: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setVersionModal(false)}
                style={{ padding: "6px 14px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 700, background: "var(--gov-navy)", color: "#FFFFFF", border: "none", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 2: AI REASONING
         ═══════════════════════════════════════════════════════════════ */}
      {aiReasoningModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={() => setAiReasoningModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 540, maxHeight: "85vh", overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: "10px 10px 0 0" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--gov-blue)", margin: "0 0 2px" }}>
                  Explainable AI
                </p>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                  PRAMAN AI Structuring Reasoning
                </h3>
              </div>
              <button onClick={() => setAiReasoningModal(false)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12, fontSize: "0.76rem", color: "var(--ink)" }}>
              <div style={{ padding: "10px 12px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 6 }}>
                <p style={{ fontWeight: 700, color: "#1D4ED8", margin: "0 0 4px" }}>Synthesis Methodology</p>
                <p style={{ margin: 0, color: "#1E40AF", lineHeight: 1.5 }}>
                  Requirements were synthesized using dense semantic embedding + BM25 lexical parsing across 240+ historical public procurement case studies in Maharashtra.
                </p>
              </div>

              <div>
                <p className="gov-section-label" style={{ marginBottom: 4 }}>Confidence Decomposition</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)", display: "block" }}>Domain Classification</span>
                    <strong style={{ color: "#16834B" }}>96% (High)</strong>
                  </div>
                  <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)", display: "block" }}>Technology Stack Fit</span>
                    <strong style={{ color: "#16834B" }}>92% (High)</strong>
                  </div>
                  <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)", display: "block" }}>Budget Realism</span>
                    <strong style={{ color: "#D97706" }}>84% (Moderate)</strong>
                  </div>
                  <div style={{ background: "#F8FAFC", padding: "8px 10px", borderRadius: 4, border: "1px solid var(--line)" }}>
                    <span style={{ fontSize: "0.65rem", color: "var(--ink-soft)", display: "block" }}>Deployment Complexity</span>
                    <strong style={{ color: "#16834B" }}>88% (High)</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", background: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setAiReasoningModal(false)}
                style={{ padding: "6px 14px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 700, background: "var(--gov-navy)", color: "#FFFFFF", border: "none", cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 3: REQUEST CHANGES
         ═══════════════════════════════════════════════════════════════ */}
      {requestChangesModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={() => setRequestChangesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 500,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: "10px 10px 0 0" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "#D97706", margin: "0 0 2px" }}>
                  Officer Review Gate
                </p>
                <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0 }}>
                  Request Changes to Requirements
                </h3>
              </div>
              <button onClick={() => setRequestChangesModal(false)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestChangesSubmit} style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--ink)" }}>
                Notes / Requested Modifications:
              </label>
              <textarea
                rows={4}
                required
                value={changesText}
                onChange={(e) => setChangesText(e.target.value)}
                placeholder="Describe what needs to be adjusted in the structured requirements or KPI benchmarks..."
                style={{ width: "100%", fontSize: "0.78rem", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 5, outline: "none", resize: "vertical" }}
              />

              <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setRequestChangesModal(false)}
                  style={{ padding: "6px 12px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 600, background: "white", border: "1px solid var(--line)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "6px 16px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 800, background: "#D97706", color: "white", border: "none", cursor: "pointer" }}
                >
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
         MODAL 4: ADD CONSTRAINT ITEM
         ═══════════════════════════════════════════════════════════════ */}
      {editingCard && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10, 37, 64, 0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16
          }}
          onClick={() => setEditingCard(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white", borderRadius: 10, border: "1px solid var(--line)",
              width: "100%", maxWidth: 460,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: "10px 10px 0 0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gov-navy)", margin: 0, textTransform: "capitalize" }}>
                Add Item to {editingCard}
              </h3>
              <button onClick={() => setEditingCard(null)} style={{ padding: 4, border: "none", background: "none", cursor: "pointer", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <textarea
                rows={3}
                value={tempConstraintText}
                onChange={(e) => setTempConstraintText(e.target.value)}
                placeholder="Enter requirement or constraint specification..."
                style={{ width: "100%", fontSize: "0.78rem", padding: "8px 10px", border: "1.5px solid #3B82F6", borderRadius: 5, outline: "none" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  style={{ padding: "6px 12px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 600, background: "white", border: "1px solid var(--line)", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveConstraint}
                  style={{ padding: "6px 16px", borderRadius: 5, fontSize: "0.75rem", fontWeight: 800, background: "#1D4ED8", color: "white", border: "none", cursor: "pointer" }}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
