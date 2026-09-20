"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { api } from "./api";
import type { AuditEvent, Problem, Recommendation } from "@/types/praman";
import type { TracePayload } from "@/components/EvidenceTrace";
import { DEMO_SCENARIOS, type DemoScenario, type ScenarioMilestone } from "./demoScenarios";

type Requirement = Record<string, any>;
type Pilot = Record<string, any>;
type Readiness = {
  score: number;
  band: string;
  dimensions: Record<string, number>;
  blocker: string;
  suggested_action: string;
  disclaimer: string;
  data_class: string;
  handoffItems?: { name: string; ready: boolean }[];
};

interface PramanContextType {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  mfa: string;
  setMfa: (v: string) => void;
  user: Record<string, any> | null;
  problem: Problem | null;
  requirement: Requirement | null;
  recommendations: Recommendation[];
  pilot: Pilot | null;
  readiness: Readiness | null;
  decisionReason: string;
  setDecisionReason: (v: string) => void;
  decision: Record<string, any> | null;
  handoff: Record<string, any> | null;
  scale: Record<string, any> | null;
  audit: AuditEvent[];
  health: Record<string, any> | null;
  trace: TracePayload | null;
  setTrace: (v: TracePayload | null) => void;
  loading: string;
  error: string;
  currentStage: number;
  // Dynamic State Slices
  selectedCaseId: string;
  selectedStartupId: string | null;
  financialMilestones: ScenarioMilestone[];
  implementation: Record<string, any> | null;
  monitoring: Record<string, any>[];
  outcome: Record<string, any> | null;
  lessons: Record<string, any>[];
  memory: Record<string, any>[];
  memorySearchQuery: string;
  setMemorySearchQuery: (v: string) => void;
  riskRadar: Record<string, any>[];
  decisionReplay: Record<string, any> | null;
  modelVersions: Record<string, any>[];
  // Multi-Scenario Demo System
  activeScenarioIndex: number;
  activeScenario: DemoScenario | null;
  demoScenarios: DemoScenario[];
  loadScenario: (index: number) => Promise<void>;
  selectCase: (caseId: string) => Promise<void>;
  resetDemo: () => Promise<void>;
  // Workflow Actions
  login: () => Promise<void>;
  launchDemo: () => Promise<void>;
  structure: () => Promise<void>;
  approve: () => Promise<void>;
  approveRequirement: () => Promise<void>;
  updateRequirement: (fields: Record<string, any>) => void;
  updateKpis: (kpis: any[]) => void;
  matchStartups: () => Promise<void>;
  shortlist: (startupId?: string) => Promise<void>;
  shortlistStartup: (startupId: string) => Promise<void>;
  advancePilotStage: () => Promise<void>;
  fastForward: () => Promise<void>;
  approveFinancialMilestone: (milestoneId: number) => Promise<void>;
  calculateReadiness: () => Promise<void>;
  submitDecision: (decisionText?: string) => Promise<void>;
  generateHandoff: () => Promise<void>;
  requestConsent: (deptNameOrId: string) => Promise<void>;
  logout: () => void;
  recordAuditEvent: (event: Partial<AuditEvent>) => void;
  // Implementation actions
  initImplementation: () => Promise<void>;
  resolveBlocker: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  addMonitoringRecord: (record: any) => Promise<void>;
  searchMemory: (q: string) => Promise<void>;
  loadAllModuleData: () => Promise<void>;
  authInitialized: boolean;
}

const PramanContext = createContext<PramanContextType | null>(null);

export function PramanProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("officer@praman.local");
  const [password, setPassword] = useState("demo123");
  const [mfa, setMfa] = useState("123456");

  const [user, setUserState] = useState<Record<string, any> | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("praman_user");
    if (savedUser) {
      try {
        setUserState(JSON.parse(savedUser));
      } catch (e) { }
    }
    setAuthInitialized(true);
  }, []);

  function setUser(newUser: Record<string, any> | null) {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("praman_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("praman_user");
    }
  }

  // ── Core Workflow State ─────────────────────────────────────────────────
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [selectedCaseId, setSelectedCaseId] = useState<string>("PRB-MH-2026-1042");
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>("startup-skyline");

  const [problem, setProblem] = useState<Problem | null>(() => {
    const sc = DEMO_SCENARIOS[0];
    return {
      id: sc.id,
      display_id: sc.display_id,
      title: sc.title,
      department: sc.department,
      location: sc.location,
      narrative: sc.narrative,
      budget: sc.budget,
      timeline_days: sc.timeline_days,
      core_kpi: sc.core_kpi,
      constraint: sc.constraint,
      domain: sc.domain,
      technology: sc.technology,
      supporting: [],
      deployment: sc.deployment,
      security: sc.security,
      status: sc.status,
      data_class: sc.data_class,
    };
  });

  const [requirement, setRequirement] = useState<Requirement | null>(() => DEMO_SCENARIOS[0].requirement);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => DEMO_SCENARIOS[0].recommendations);
  const [pilot, setPilot] = useState<Pilot | null>(() => DEMO_SCENARIOS[0].pilot);
  const [financialMilestones, setFinancialMilestones] = useState<ScenarioMilestone[]>(() => DEMO_SCENARIOS[0].financialMilestones);
  const [readiness, setReadiness] = useState<Readiness | null>(() => DEMO_SCENARIOS[0].readiness);
  const [scale, setScale] = useState<Record<string, any> | null>(() => DEMO_SCENARIOS[0].scale);

  const [decisionReason, setDecisionReason] = useState(
    "SkylineAI retained because simulated KPI evidence supports human procurement review, while security questionnaire completion remains a visible blocker."
  );
  const [decision, setDecision] = useState<Record<string, any> | null>(null);
  const [handoff, setHandoff] = useState<Record<string, any> | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [health, setHealth] = useState<Record<string, any> | null>(null);
  const [trace, setTrace] = useState<TracePayload | null>(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  // ── Supporting Module Slices ─────────────────────────────────────────────
  const [implementation, setImplementation] = useState<Record<string, any> | null>(null);
  const [monitoring, setMonitoring] = useState<Record<string, any>[]>([]);
  const [outcome, setOutcome] = useState<Record<string, any> | null>(null);
  const [lessons, setLessons] = useState<Record<string, any>[]>([]);
  const [memory, setMemory] = useState<Record<string, any>[]>([]);
  const [memorySearchQuery, setMemorySearchQuery] = useState("");
  const [riskRadar, setRiskRadar] = useState<Record<string, any>[]>([]);
  const [decisionReplay, setDecisionReplay] = useState<Record<string, any> | null>(null);
  const [modelVersions, setModelVersions] = useState<Record<string, any>[]>([]);

  const activeScenario = useMemo(() => {
    if (activeScenarioIndex >= 0 && activeScenarioIndex < DEMO_SCENARIOS.length) {
      return DEMO_SCENARIOS[activeScenarioIndex];
    }
    return DEMO_SCENARIOS[0];
  }, [activeScenarioIndex]);

  const currentStage = useMemo(() => {
    if (decision) return 8;
    if (handoff) return 7;
    if (readiness) return 6;
    if (pilot?.status === "Evaluation" || pilot?.status === "Government Review" || pilot?.status === "Completed") return 5;
    if (pilot) return 4;
    if (recommendations.length > 0) return 3;
    if (requirement?.status === "Approved") return 2;
    if (requirement) return 1;
    return 0;
  }, [decision, handoff, pilot, readiness, recommendations.length, requirement]);

  async function run<T>(label: string, action: () => Promise<T>) {
    setLoading(label);
    setError("");
    try {
      return await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      return null;
    } finally {
      setLoading("");
      refreshAudit();
    }
  }

  function recordAuditEvent(event: Partial<AuditEvent>) {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor: event.actor || user?.name || "Ananya Deshmukh (Officer)",
      role: event.role || "Procurement Officer",
      action: event.action || "SYSTEM_UPDATE",
      entity: event.entity || `Case ${selectedCaseId}`,
      reason: event.reason || "Operational review",
      system_version: "2.1",
      stage: event.stage || "WORKFLOW",
      data_class: "OFFICIAL",
      details: event.details || `Workflow updated for ${selectedCaseId}`,
      user: user?.name || "Ananya Deshmukh (Officer)",
      ...event,
    };
    setAudit(prev => [newEvent, ...prev]);
  }

  async function refreshAudit() {
    const result = await api<{ items: AuditEvent[] }>(`/api/v1/audit/${problem?.id || "1042"}`).catch(() => null);
    if (result && result.items) {
      setAudit(result.items);
    }
  }

  async function login() {
    await run("Verifying MFA", async () => {
      await api("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const result = await api<{ access_token?: string; user: Record<string, any> }>("/api/v1/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ email, code: mfa }),
      });
      if (result.access_token) {
        localStorage.setItem("praman_token", result.access_token);
      }
      setUser(result.user);
    });
  }

  function logout() {
    localStorage.removeItem("praman_token");
    setUser(null);
  }

  // ── Load Scenario (Single Source of Truth) ──────────────────────────────
  async function loadScenario(index: number) {
    const clampedIndex = Math.max(0, Math.min(index, DEMO_SCENARIOS.length - 1));
    const sc = DEMO_SCENARIOS[clampedIndex];
    setActiveScenarioIndex(clampedIndex);
    setSelectedCaseId(sc.display_id);
    setSelectedStartupId(sc.startup.id);

    await run(`Loading Scenario ${clampedIndex + 1} of ${DEMO_SCENARIOS.length}: ${sc.title}`, async () => {
      await api("/api/v1/demo/reset", { method: "POST" }).catch(() => null);
      const h = await api<Record<string, any>>("/api/v1/health").catch(() => null);
      if (h) setHealth(h);

      setProblem({
        id: sc.id,
        display_id: sc.display_id,
        title: sc.title,
        department: sc.department,
        location: sc.location,
        narrative: sc.narrative,
        budget: sc.budget,
        timeline_days: sc.timeline_days,
        core_kpi: sc.core_kpi,
        constraint: sc.constraint,
        domain: sc.domain,
        technology: sc.technology,
        supporting: [],
        deployment: sc.deployment,
        security: sc.security,
        status: sc.status,
        data_class: sc.data_class,
      });

      setRequirement(JSON.parse(JSON.stringify(sc.requirement)));
      setRecommendations(JSON.parse(JSON.stringify(sc.recommendations)));
      setPilot(JSON.parse(JSON.stringify(sc.pilot)));
      setFinancialMilestones(JSON.parse(JSON.stringify(sc.financialMilestones)));
      setReadiness(JSON.parse(JSON.stringify(sc.readiness)));
      setScale(JSON.parse(JSON.stringify(sc.scale)));
      setDecision(null);
      setHandoff(null);

      recordAuditEvent({
        action: "DEMO_SCENARIO_LOADED",
        stage: "Procurement Setup",
        details: `Loaded Scenario ${clampedIndex + 1}: ${sc.title} (${sc.display_id})`,
      });

      await loadAllModuleDataInternal(sc.id);
    });
  }

  async function selectCase(caseId: string) {
    const normalized = caseId.toUpperCase().trim();
    const idx = DEMO_SCENARIOS.findIndex(s =>
      s.id === normalized || s.display_id.toUpperCase() === normalized || s.display_id.endsWith(normalized)
    );
    if (idx !== -1) {
      await loadScenario(idx);
    }
  }

  async function launchDemo() {
    const nextIndex = activeScenarioIndex === -1 ? 0 : (activeScenarioIndex + 1) % DEMO_SCENARIOS.length;
    await loadScenario(nextIndex);
  }

  async function resetDemo() {
    await loadScenario(0);
  }

  async function loadAllModuleDataInternal(probIdOverride?: string) {
    const probId = probIdOverride || problem?.id || "1042";
    const [implResult, monResult, outcomeResult, lessonsResult, memResult, riskResult, replayResult, modelsResult] = await Promise.allSettled([
      api<Record<string, any>>(`/api/v1/implementation/${probId}`),
      api<{ items: Record<string, any>[] }>(`/api/v1/monitoring/${probId}`),
      api<Record<string, any>>(`/api/v1/outcomes/${probId}`),
      api<{ items: Record<string, any>[] }>(`/api/v1/lessons/${probId}`),
      api<{ items: Record<string, any>[] }>("/api/v1/institutional-memory"),
      api<{ items: Record<string, any>[] }>(`/api/v1/risk-radar/${probId}`),
      api<Record<string, any>>(`/api/v1/decision-replay/replay-${probId}`),
      api<{ items: Record<string, any>[] }>("/api/v1/model-versions"),
    ]);
    if (implResult.status === "fulfilled") setImplementation(implResult.value);
    if (monResult.status === "fulfilled") setMonitoring(monResult.value.items);
    if (outcomeResult.status === "fulfilled") setOutcome(outcomeResult.value);
    if (lessonsResult.status === "fulfilled") setLessons(lessonsResult.value.items);
    if (memResult.status === "fulfilled") setMemory(memResult.value.items);
    if (riskResult.status === "fulfilled") setRiskRadar(riskResult.value.items);
    if (replayResult.status === "fulfilled") setDecisionReplay(replayResult.value);
    if (modelsResult.status === "fulfilled") setModelVersions(modelsResult.value.items);
  }

  async function loadAllModuleData() {
    await run("Loading PRAMAN intelligence modules", () => loadAllModuleDataInternal());
  }

  // ── Requirements Workflow ────────────────────────────────────────────────
  function updateRequirement(fields: Record<string, any>) {
    setRequirement(prev => {
      const updated = { ...(prev || {}), ...fields };
      return updated;
    });
    recordAuditEvent({
      action: "REQUIREMENT_EDITED",
      stage: "Requirements",
      details: `Updated requirement specifications for ${selectedCaseId}`,
    });
  }

  function updateKpis(kpiRows: any[]) {
    setRequirement(prev => {
      if (!prev) return prev;
      return { ...prev, kpis: kpiRows };
    });
    setPilot(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        kpis: kpiRows.map((k: any) => ({
          name: k.name,
          target: k.target,
          current: k.actual || k.current || "Telemetry Pending",
          status: k.status === "On Track" ? "passed" : "attention",
          note: k.method,
        })),
      };
    });
    recordAuditEvent({
      action: "KPI_BENCHMARK_UPDATED",
      stage: "Requirements",
      details: `Modified KPI benchmark thresholds for ${selectedCaseId}`,
    });
  }

  async function approveRequirement() {
    const probId = problem?.id || "1042";
    await run("Approving requirement", async () => {
      await api<Requirement>(`/api/v1/problems/${probId}/requirements/approve`, { method: "POST" }).catch(() => null);
      setRequirement(prev => {
        if (!prev) return { id: `req-${probId}`, problem_id: probId, status: "Approved" };
        return { ...prev, status: "Approved" };
      });
      recordAuditEvent({
        action: "REQUIREMENT_APPROVED",
        stage: "Requirements",
        details: `Structured requirement approved for ${selectedCaseId}. Unlocked Startup Matching gateway.`,
      });
    });
  }

  const approve = approveRequirement;

  async function structure() {
    const probId = problem?.id || "1042";
    const result = await run("Structuring problem with AI", async () => {
      const res = await api<Requirement>(`/api/v1/problems/${probId}/structure`, { method: "POST" }).catch(() => null);
      if (res) return res;
      return activeScenario ? activeScenario.requirement : null;
    });
    if (result) setRequirement(result);
  }

  // ── Startup Matching & Shortlisting ──────────────────────────────────────
  async function matchStartups() {
    await run("Running matching engine", async () => {
      const res = await api<{ results: Recommendation[] }>("/api/v1/match", { method: "POST" }).catch(() => null);
      if (res && res.results && res.results.length) {
        setRecommendations(res.results);
      } else if (activeScenario) {
        setRecommendations(activeScenario.recommendations);
      }
      recordAuditEvent({
        action: "STARTUP_MATCHING_EXECUTED",
        stage: "Startup Matching",
        details: `Evaluated ${recommendations.length || 4} candidate startups for ${selectedCaseId}`,
      });
    });
  }

  async function shortlistStartup(startupId: string) {
    setSelectedStartupId(startupId);
    const candidate = recommendations.find(r => r.startup.id === startupId) ||
      (activeScenario?.recommendations || []).find(r => r.startup.id === startupId);
    const startupName = candidate ? candidate.startup.name : "Shortlisted Startup";

    await run(`Shortlisting ${startupName} for Pilot`, async () => {
      await api(`/api/v1/recommendations/${startupId}/shortlist`, { method: "POST" }).catch(() => null);
      setPilot(prev => {
        if (!prev) {
          return {
            ...(activeScenario?.pilot || {}),
            startup: startupName,
          };
        }
        return {
          ...prev,
          startup: startupName,
        };
      });
      recordAuditEvent({
        action: "STARTUP_SHORTLISTED",
        stage: "Startup Matching",
        details: `Shortlisted ${startupName} (${startupId}) for controlled sandbox pilot on ${selectedCaseId}`,
      });
    });
  }

  const shortlist = async (startupId?: string) => {
    const id = startupId || selectedStartupId || recommendations[0]?.startup.id || "startup-skyline";
    await shortlistStartup(id);
  };

  // ── Pilot & Telemetry Advancement ────────────────────────────────────────
  async function advancePilotStage() {
    const stages: ("Setup" | "Deployment" | "Data Collection" | "Evaluation" | "Government Review" | "Completed")[] = [
      "Setup", "Deployment", "Data Collection", "Evaluation", "Government Review", "Completed"
    ];
    const currentIndex = pilot ? stages.indexOf(pilot.status as any) : 0;
    const nextIndex = Math.min(stages.length - 1, currentIndex + 1);
    const nextStage = stages[nextIndex];
    const nextDay = Math.min(pilot?.duration_days || 90, Math.round((nextIndex / (stages.length - 1)) * (pilot?.duration_days || 90)));

    await run(`Advancing Pilot to ${nextStage}`, async () => {
      setPilot(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          status: nextStage,
          current_day: nextDay,
          current_stage_index: nextIndex,
        };
      });
      recordAuditEvent({
        action: "PILOT_STAGE_ADVANCED",
        stage: "Pilot & Evidence",
        details: `Pilot advanced to Stage: ${nextStage} (Day ${nextDay}) for ${selectedCaseId}`,
      });
    });
  }

  const fastForward = advancePilotStage;

  // ── Financial Milestones Approval ────────────────────────────────────────
  async function approveFinancialMilestone(milestoneId: number) {
    setFinancialMilestones(prev => {
      return prev.map(m => {
        if (m.id === milestoneId) {
          return { ...m, status: "Released" as const };
        }
        return m;
      });
    });

    const targetMilestone = financialMilestones.find(m => m.id === milestoneId);
    const amountStr = targetMilestone ? `₹${(targetMilestone.amount / 100000).toFixed(1)}L` : "Milestone release";

    recordAuditEvent({
      action: "FINANCIAL_MILESTONE_APPROVED",
      stage: "Financial Milestones",
      details: `Approved ${amountStr} release for Milestone #${milestoneId} on ${selectedCaseId}`,
    });

    // Recompute overall readiness if financial release was pending
    setReadiness(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        score: Math.min(100, prev.score + 3),
      };
    });
  }

  // ── Readiness & Decisions ────────────────────────────────────────────────
  async function calculateReadiness() {
    await run("Calculating procurement readiness score", async () => {
      if (activeScenario) {
        setReadiness(activeScenario.readiness);
      }
      recordAuditEvent({
        action: "READINESS_CALCULATED",
        stage: "Readiness & Decisions",
        details: `Procurement readiness computed: ${readiness?.score || 91}/100 for ${selectedCaseId}`,
      });
    });
  }

  async function submitDecision(decisionText?: string) {
    const text = decisionText || "Proceed to Procurement Review";
    await run(`Recording Decision: ${text}`, async () => {
      setDecision({
        decision: text,
        timestamp: new Date().toISOString(),
        authority: user?.name || "Ananya Deshmukh (Officer)",
        reason: decisionReason,
      });
      recordAuditEvent({
        action: "GOVERNMENT_DECISION_RECORDED",
        stage: "Readiness & Decisions",
        details: `Nodal officer recorded formal decision: "${text}" for ${selectedCaseId}`,
      });
    });
  }

  async function generateHandoff() {
    await run("Generating handoff pack", async () => {
      setHandoff({
        generated_at: new Date().toISOString(),
        case_id: selectedCaseId,
        readiness_score: readiness?.score || 91,
        status: "Compiled & Verified",
      });
      recordAuditEvent({
        action: "HANDOFF_PACK_GENERATED",
        stage: "Handoff & Procurement",
        details: `Compiled cryptographic procurement handoff dossier for ${selectedCaseId}`,
      });
    });
  }

  async function requestConsent(deptNameOrId: string) {
    await run(`Requesting consent from ${deptNameOrId}`, async () => {
      setScale(prev => {
        if (!prev || !prev.targetDepartments) return prev;
        const updated = prev.targetDepartments.map((t: any) => {
          if (t.department === deptNameOrId || t.department.includes(deptNameOrId)) {
            return { ...t, status: "Under Review" };
          }
          return t;
        });
        return { ...prev, targetDepartments: updated };
      });
      recordAuditEvent({
        action: "SCALE_CONSENT_REQUESTED",
        stage: "Scale & Reuse",
        details: `Sent replication evaluation request to ${deptNameOrId} for ${selectedCaseId}`,
      });
    });
  }

  // ── Implementation Actions ────────────────────────────────────────────────
  async function initImplementation() {
    const probId = problem?.id || "1042";
    const result = await run("Initializing implementation plan", () =>
      api<Record<string, any>>(`/api/v1/implementation/${probId}`, { method: "POST" })
    );
    if (result) setImplementation(result);
  }

  async function resolveBlocker(taskId: string) {
    const probId = problem?.id || "1042";
    const result = await run("Resolving blocker", () =>
      api<Record<string, any>>(`/api/v1/implementation/${probId}/tasks/${taskId}/resolve-blocker`, { method: "PATCH" })
    );
    if (result) {
      const updated = await api<Record<string, any>>(`/api/v1/implementation/${probId}`).catch(() => null);
      if (updated) setImplementation(updated);
    }
  }

  async function updateTaskStatus(taskId: string, status: string) {
    const probId = problem?.id || "1042";
    const result = await run("Updating task", () =>
      api<Record<string, any>>(`/api/v1/implementation/${probId}/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })
    );
    if (result) {
      const updated = await api<Record<string, any>>(`/api/v1/implementation/${probId}`).catch(() => null);
      if (updated) setImplementation(updated);
    }
  }

  async function addMonitoringRecord(record: any) {
    const probId = problem?.id || "1042";
    const result = await run("Adding monitoring record", () =>
      api<Record<string, any>>(`/api/v1/monitoring/${probId}`, {
        method: "POST",
        body: JSON.stringify(record),
      })
    );
    if (result) {
      const updated = await api<{ items: Record<string, any>[] }>(`/api/v1/monitoring/${probId}`).catch(() => null);
      if (updated) setMonitoring(updated.items);
    }
  }

  async function searchMemory(q: string) {
    setMemorySearchQuery(q);
    const result = await run("Searching institutional memory", () =>
      api<{ items: Record<string, any>[]; has_failed_match?: boolean }>(`/api/v1/institutional-memory/search?q=${encodeURIComponent(q)}`)
    );
    if (result) setMemory(result.items);
  }

  return (
    <PramanContext.Provider
      value={{
        email, setEmail, password, setPassword, mfa, setMfa,
        user, problem, requirement, recommendations, pilot, readiness,
        decisionReason, setDecisionReason, decision, handoff, scale,
        audit, health, trace, setTrace, loading, error, currentStage,
        authInitialized,
        // Dynamic Case State
        selectedCaseId,
        selectedStartupId,
        financialMilestones,
        // Multi-Scenario Demo System
        activeScenarioIndex,
        activeScenario,
        demoScenarios: DEMO_SCENARIOS,
        loadScenario,
        selectCase,
        resetDemo,
        // New state
        implementation, monitoring, outcome, lessons, memory,
        memorySearchQuery, setMemorySearchQuery,
        riskRadar, decisionReplay, modelVersions,
        // Workflow Actions
        login, logout, launchDemo, structure, approve, approveRequirement,
        updateRequirement, updateKpis, matchStartups, shortlist, shortlistStartup,
        advancePilotStage, fastForward, approveFinancialMilestone, calculateReadiness,
        submitDecision, generateHandoff, requestConsent, recordAuditEvent,
        // Implementation actions
        initImplementation, resolveBlocker, updateTaskStatus,
        addMonitoringRecord, searchMemory, loadAllModuleData,
      }}
    >
      {children}
    </PramanContext.Provider>
  );
}

export function usePraman() {
  const context = useContext(PramanContext);
  if (!context) throw new Error("usePraman must be used within a PramanProvider");
  return context;
}
