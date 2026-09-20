import type { Problem, Recommendation, DataClass } from "@/types/praman";

export type MilestoneStatus = "Completed" | "Released" | "Pending Approval" | "In Progress" | "Locked" | "Blocked";

export type ScenarioMilestone = {
  id: number;
  stage: "Requirement" | "Pilot" | "Evidence" | "Procurement" | "Deployment";
  milestone: string;
  amount: number;
  trigger: string;
  status: MilestoneStatus;
  lockedReason?: string;
  prerequisites?: { name: string; status: "met" | "pending" | "missing" }[];
  conditions?: { text: string; met: boolean }[];
  evidenceCount?: number;
};

export type ScaleOpportunity = {
  department: string;
  location: string;
  domain: string;
  potentialUse: string;
  compatibility: number;
  status: "Pending Review" | "Under Review" | "Consent Recorded" | "Not Started" | "Not Proceeding";
  actionRequired: string;
};

export type AdaptationRequirement = {
  sourcePilot: string;
  targetDepartment: string;
  requiredAdaptation: string;
  effort: "Low" | "Medium" | "High";
  status: "Ready" | "Required" | "In Progress";
};

export type DemoScenario = {
  id: string;
  display_id: string;
  title: string;
  department: string;
  problem: string;
  narrative: string;
  technology: string;
  location: string;
  budget: string;
  timeline_days: number;
  core_kpi: string;
  constraint: string;
  domain: string;
  deployment: string;
  security: string;
  status: string;
  data_class: DataClass;
  startup: {
    id: string;
    name: string;
    dpiit: string;
    capabilities: string[];
    data_class: DataClass;
  };
  recommendations: Recommendation[];
  requirement: {
    id: string;
    problem_id: string;
    status: "Draft" | "Structured" | "Under Review" | "Approved";
    version: string;
    budget: string;
    timeline: string;
    kpis: { id?: string; name: string; target: string; method?: string; actual?: string; met?: boolean; status?: string }[];
    functional_specs: string[];
    non_functional_specs: string[];
    security_constraints?: string[];
    operational_constraints?: string[];
    integration_requirements?: string[];
  };
  pilot: {
    id: string;
    name: string;
    problem_id: string;
    department: string;
    startup: string;
    location: string;
    budget: string;
    status: "Setup" | "Deployment" | "Data Collection" | "Evaluation" | "Government Review" | "Completed";
    duration_days: number;
    current_day: number;
    current_stage_index: number;
    timeline: string[];
    kpis: { name: string; target: string; current: string; status: "passed" | "attention" | "failed"; note?: string; proofFile?: string }[];
    evidence: { id: string; name: string; category: string; status: "Verified" | "Submitted" | "Pending" | "Required"; uploader: string; date: string; hash: string; verificationNote: string; confidence?: string }[];
    nextActionText: string;
    nextActionSubtext: string;
    nextActionButtonLabel: string;
    outcome?: {
      determination: string;
      summary: string;
      authority: string;
      date: string;
      decisionNumber: string;
    } | null;
  };
  financialMilestones: ScenarioMilestone[];
  readiness: {
    score: number;
    band: string;
    dimensions: Record<string, number>;
    blocker: string;
    suggested_action: string;
    disclaimer: string;
    data_class: string;
    handoffItems?: { name: string; ready: boolean }[];
  };
  scale: {
    reason: string;
    pilotOutcome: string;
    keyKpiResults: string;
    evidenceStatus: string;
    targetDepartments: ScaleOpportunity[];
    adaptations: AdaptationRequirement[];
    readinessDimensions: { name: string; score: number; max: number; desc: string }[];
    replicationReadinessScore: number;
    estimated_scale_savings: string;
  };
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  // ── SCENARIO 1: ROAD DAMAGE DETECTION ────────────────────────────────────
  {
    id: "1042",
    display_id: "PRB-MH-2026-1042",
    title: "Road Damage Detection",
    department: "PWD Maharashtra",
    problem: "Detect road damage using public transport telemetry and computer vision.",
    narrative: "Pune municipal bus fleet equipped with low-cost edge cameras to autonomously stream localized road distress data to the state public works dashboard.",
    technology: "Computer Vision / Edge AI",
    location: "Pune",
    budget: "₹50L – ₹1Cr",
    timeline_days: 90,
    core_kpi: "Detection accuracy ≥85% on pothole & surface fissure telemetry",
    constraint: "Must operate on edge devices with intermittent 4G/5G mobile connectivity",
    domain: "Road Infrastructure",
    deployment: "45 municipal buses across Pune metropolitan ring road",
    security: "Data sovereignty within Indian cloud region, end-to-end SHA-256 evidence hashing",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-skyline",
      name: "SkylineAI Solutions",
      dpiit: "DIPP91823",
      capabilities: ["Edge Computer Vision", "Fleet Telemetry", "Automated Road Defect Classification"],
      data_class: "SIMULATED",
    },
    recommendations: [
      {
        id: "rec-1042-1",
        rank: 1,
        startup: {
          id: "startup-skyline",
          name: "SkylineAI Solutions",
          dpiit: "DIPP91823",
          capabilities: ["Edge Computer Vision", "Fleet Telemetry", "Pothole AI Classification"],
          data_class: "SIMULATED",
        },
        score: 94,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT recognized startup entity", data_class: "OFFICIAL" },
            { code: "MIN_DEPLOY", name: "Prior Field Testing", status: "PASS", reason: "Prior pilot in PMC Zone 3 verified (45 vehicles)", data_class: "SIMULATED" },
            { code: "CERT_IN", name: "Cybersecurity Readiness", status: "PASS", reason: "Self-assessment complete; CERT-In audit scheduled", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Requirement Fit": 95, "Evidence Strength": 94, "Technical Capability": 95, "Deployment Feasibility": 92, "Cost Efficiency": 94 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1042-2",
        rank: 2,
        startup: {
          id: "startup-roadvision",
          name: "RoadVision Labs",
          dpiit: "DIPP84102",
          capabilities: ["LiDAR Mapping", "High-Definition Road Reconstruction", "Drone Ingestion"],
          data_class: "SIMULATED",
        },
        score: 88,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity in Maharashtra", data_class: "OFFICIAL" },
            { code: "HARDWARE_SPEC", name: "Sensor Modularity", status: "PASS", reason: "Supports external dashcam video feeds", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Requirement Fit": 89, "Evidence Strength": 87, "Technical Capability": 90, "Deployment Feasibility": 84, "Cost Efficiency": 86 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1042-3",
        rank: 3,
        startup: {
          id: "startup-infrasense",
          name: "InfraSense Technologies",
          dpiit: "DIPP76421",
          capabilities: ["Axle Vibration Accelerometers", "Road Roughness IRI Indexing", "Edge GIS Sync"],
          data_class: "SIMULATED",
        },
        score: 84,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 84, "Evidence Strength": 82, "Technical Capability": 86, "Deployment Feasibility": 88, "Cost Efficiency": 85 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1042-4",
        rank: 4,
        startup: {
          id: "startup-civicscan",
          name: "CivicScan AI",
          dpiit: "DIPP69104",
          capabilities: ["Citizen Crowdsourced Reporting", "Computer Vision Deduplication", "Mobile App SDK"],
          data_class: "SIMULATED",
        },
        score: 78,
        band: "Conditional Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 78, "Evidence Strength": 76, "Technical Capability": 80, "Deployment Feasibility": 82, "Cost Efficiency": 79 },
        pipeline: {},
        data_class: "SIMULATED",
      },
    ],
    requirement: {
      id: "req-1042",
      problem_id: "1042",
      status: "Approved",
      version: "1.2",
      budget: "₹1.00 Cr (Estimated Pilot Head)",
      timeline: "90 Days Sandbox Validation",
      kpis: [
        { id: "kpi-1042-1", name: "Detection Accuracy", target: "≥85%", method: "Validated test dataset with ground truth video", actual: "89.2%", met: true, status: "On Track" },
        { id: "kpi-1042-2", name: "False Positive Rate", target: "<10%", method: "Field evaluation across diverse weather/lighting", actual: "8.1%", met: true, status: "On Track" },
        { id: "kpi-1042-3", name: "Processing Time", target: "<5 seconds", method: "Edge hardware system logs & benchmark telemetry", actual: "3.8s", met: true, status: "On Track" },
        { id: "kpi-1042-4", name: "Fleet Coverage", target: "≥90%", method: "Deployment telemetry & GIS track analysis", actual: "76.4%", met: false, status: "Needs Review" },
      ],
      functional_specs: ["Edge AI inference on vehicle dashcams", "Automated GPS distress pinpointing", "GIS map ingestion & work-order dispatch"],
      non_functional_specs: ["2.0s max telemetry latency", "Indian cloud data residency (DPDP 2023)", "CERT-In cybersecurity clearance"],
      security_constraints: [
        "Mandatory CERT-In cybersecurity audit clearance prior to pilot deployment.",
        "Strict data residency within Indian geographic boundaries (DPDP Act 2023).",
        "Role-based access control (RBAC) and encrypted telemetry at rest (AES-256).",
      ],
      operational_constraints: [
        "Night-time and heavy monsoon rain false positive mitigation.",
        "Must operate on 12V DC public transport telemetry without draining vehicle battery.",
        "Zero disruption to active public bus transit schedules during data harvesting.",
      ],
      integration_requirements: [
        "PWD Maharashtra GIS Asset Management Portal bi-directional API sync.",
        "Automated cryptographic telemetry anchoring in PRAMAN Evidence Locker.",
        "Automated work-order ticketing dispatch to zonal field maintenance engineers.",
      ],
    },
    pilot: {
      id: "PIL-MH-2026-022",
      name: "Smart Road Condition Monitoring",
      problem_id: "1042",
      department: "PWD Maharashtra",
      startup: "SkylineAI Solutions",
      location: "Pune Municipal & PWD Zone 4",
      budget: "₹1.00 Cr",
      status: "Data Collection",
      duration_days: 90,
      current_day: 42,
      current_stage_index: 2,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Detection Accuracy", target: "≥85%", current: "89.2%", status: "passed", note: "Verified against 200 surveyed pothole segments", proofFile: "Detection_Report_May.pdf" },
        { name: "False Positives", target: "<10%", current: "8.1%", status: "passed", note: "Exceeds benchmark threshold (<10%)", proofFile: "Field_Photos_Sample.zip" },
        { name: "Fleet Coverage", target: "≥90%", current: "76.4%", status: "attention", note: "34 / 45 PMPML buses streaming live data", proofFile: "KPI_Summary_May.xlsx" },
        { name: "Telemetry Latency", target: "<2.0s", current: "1.4s", status: "passed", note: "Edge-to-cloud sync via 4G/5G gateway", proofFile: "Edge_Telemetry_Logs.csv" },
      ],
      evidence: [
        { id: "EVID-022-DEP", name: "Deployment_Report_Pune.pdf", category: "Technical", status: "Verified", uploader: "PWD Field Evaluator", date: "2026-05-15", hash: "8F3A92C1...001", verificationNote: "Hardware mounting certified across 45 buses." },
        { id: "EVID-022-TST", name: "Test_Results_Calibration.pdf", category: "Performance", status: "Verified", uploader: "SkylineAI Solutions", date: "2026-06-02", hash: "4B7E11D9...002", verificationNote: "Camera alignment & edge inference validated." },
        { id: "EVID-022-KPI", name: "KPI_Evaluation_MidTerm.xlsx", category: "Performance", status: "Submitted", uploader: "Data Analyst", date: "2026-06-14", hash: "1A9C88E2...003", verificationNote: "Mid-term road distress detection logs compiled." },
        { id: "EVID-022-SEC", name: "Security_Audit_Questionnaire.pdf", category: "Security", status: "Pending", uploader: "State Cyber Cell", date: "Due 30 June 2026", hash: "Pending Upload", verificationNote: "CERT-In 3rd party assessment in progress (80%)." },
      ],
      nextActionText: "Review Mid-Pilot Evaluation Dossier & complete Security Questionnaire.",
      nextActionSubtext: "45 municipal buses are transmitting road condition telemetry. Mid-term review is pending sign-off.",
      nextActionButtonLabel: "Review Mid-Pilot Dossier →",
      outcome: null,
    },
    financialMilestones: [
      { id: 1, stage: "Requirement", milestone: "Requirement Approval & Pilot MoU", amount: 0, trigger: "Government approval of structured requirement & baseline agreement", status: "Completed" },
      { id: 2, stage: "Pilot", milestone: "Pilot Initiation & Hardware Telemetry Setup", amount: 1000000, trigger: "MoU signed & baseline telemetry active on 45 buses", status: "Released", evidenceCount: 3 },
      {
        id: 3, stage: "Pilot", milestone: "Mid-Pilot Evaluation (30 Days)", amount: 1500000, trigger: "30-day evaluation report + verified detection accuracy ≥85%", status: "Pending Approval", evidenceCount: 4,
        conditions: [
          { text: "Pilot telemetry streaming continuously from 45 municipal buses", met: true },
          { text: "Cryptographic Evidence Locker verified raw logs (1.4M points)", met: true },
          { text: "30-day preliminary evaluation report compiled", met: true },
          { text: "Target detection accuracy validated (≥85% against ground truth)", met: true },
          { text: "Procurement Officer formal milestone sign-off", met: false },
        ],
      },
      { id: 4, stage: "Evidence", milestone: "Final Pilot KPI Validation & Audit", amount: 1500000, trigger: "60-day final pilot telemetry + third-party CERT-In compliance audit", status: "Locked", lockedReason: "Mid-Pilot Evaluation (Milestone #3) has not yet been approved." },
      { id: 5, stage: "Procurement", milestone: "Procurement Award & Contract Execution", amount: 4000000, trigger: "Readiness score ≥80/100 & authorized departmental procurement decision", status: "Locked", lockedReason: "Procurement Readiness & Handoff stage has not yet been completed." },
      { id: 6, stage: "Deployment", milestone: "Production Deployment & Fleet Handover", amount: 2000000, trigger: "100% bus fleet deployment with automated PWD maintenance dispatch", status: "Locked", lockedReason: "Procurement award pending." },
    ],
    readiness: {
      score: 91,
      band: "High Readiness",
      dimensions: {
        "Technical Validation": 20,
        "Pilot Performance": 19,
        "Evidence Completeness": 18,
        "Compliance": 15,
        "Budget Alignment": 10,
        "Security & Data": 9,
      },
      blocker: "Security questionnaire 80% complete; awaiting final CERT-In certificate",
      suggested_action: "Review security questionnaire and proceed to Procurement Gate.",
      disclaimer: "PRAMAN provides decision support. Final procurement decisions remain with authorized government officials.",
      data_class: "SIMULATED",
      handoffItems: [
        { name: "Structured Requirement", ready: true },
        { name: "Startup Evaluation & Matching", ready: true },
        { name: "Pilot Telemetry Evidence", ready: true },
        { name: "Regulatory & Legal Compliance", ready: true },
        { name: "Financial Milestone Plan", ready: true },
        { name: "Departmental Cost Benefit Analysis", ready: true },
        { name: "Security & CERT-In Certification", ready: false },
      ],
    },
    scale: {
      reason: "Successful computer vision pilot on Pune bus fleet provides reusable evidence and trained edge models for other municipal corporations.",
      pilotOutcome: "Pilot Completed · 88.4% Detection Accuracy",
      keyKpiResults: "89.2% Detection Accuracy, 8.1% False Positives, 1.4s Latency",
      evidenceStatus: "17 cryptographic evidence records verified in Locker",
      targetDepartments: [
        { department: "Mumbai Municipal Corporation", location: "Mumbai", domain: "Roads & Traffic", potentialUse: "BEST municipal bus fleet pothole detection", compatibility: 94, status: "Pending Review", actionRequired: "Evaluate adaptation & GIS schema" },
        { department: "Nashik Municipal Corporation", location: "Nashik", domain: "City Infrastructure", potentialUse: "City arterial road condition survey", compatibility: 88, status: "Not Started", actionRequired: "Request departmental review" },
        { department: "Nagpur PWD", location: "Nagpur", domain: "State Highways", potentialUse: "State highway patrol vehicle road distress scan", compatibility: 91, status: "Pending Review", actionRequired: "Review pilot evidence pack" },
      ],
      adaptations: [
        { sourcePilot: "Pune PMPML Bus Fleet (45 buses)", targetDepartment: "BEST Mumbai Fleet (60 buses)", requiredAdaptation: "Camera mount vibration dampening for double-decker buses", effort: "Low", status: "Ready" },
        { sourcePilot: "PWD Maharashtra GIS Asset Portal", targetDepartment: "Mumbai MCGM GIS Portal", requiredAdaptation: "REST API schema mapping to MCGM spatial layer", effort: "Medium", status: "Required" },
        { sourcePilot: "Pune PWD Maintenance Workflow", targetDepartment: "Nashik Municipal PWD", requiredAdaptation: "Automated work-order ticketing dispatch integration", effort: "Medium", status: "Required" },
      ],
      readinessDimensions: [
        { name: "Technical Compatibility", score: 19, max: 20, desc: "Edge inference models easily portable to standard USB/IP dashcams" },
        { name: "Operational Compatibility", score: 18, max: 20, desc: "Municipal bus depot charging & maintenance schedules match" },
        { name: "Data Compatibility", score: 17, max: 20, desc: "Standardized GeoJSON hazard telemetry supported" },
        { name: "Evidence Reusability", score: 20, max: 20, desc: "Pre-validated test datasets and accuracy reports fully applicable" },
        { name: "Integration Effort", score: 18, max: 20, desc: "Lightweight API integration requiring no database migrations" },
      ],
      replicationReadinessScore: 92,
      estimated_scale_savings: "₹3.2 Cr saved across 3 municipal corporations via shared model weights",
    },
  },

  // ── SCENARIO 2: URBAN WATER LEAKAGE DETECTION ────────────────────────────
  {
    id: "1043",
    display_id: "PRB-MH-2026-1043",
    title: "Urban Water Leakage Detection",
    department: "Municipal Corporation",
    problem: "Identify and prioritize water leakage across urban distribution networks.",
    narrative: "Acoustic and pressure transient telemetry across municipal pipeline feeder junctions to pinpoint hidden non-revenue water leakage before surface rupture.",
    technology: "IoT + AI Analytics",
    location: "Mumbai",
    budget: "₹75L – ₹1.5Cr",
    timeline_days: 120,
    core_kpi: "Acoustic leak detection ≥90% with precision range <50m",
    constraint: "Zero disruption to continuous water supply during acoustic pod sensor retrofitting",
    domain: "Water & Utilities",
    deployment: "Ward K/East primary distribution trunk network",
    security: "SCADA network isolation, air-gapped encryption for municipal telemetry",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-aquapulse",
      name: "AquaPulse Dynamics",
      dpiit: "DIPP78411",
      capabilities: ["Acoustic Hydrophone Pods", "Pressure Transient Analysis", "GIS Leak Overlay"],
      data_class: "SIMULATED",
    },
    recommendations: [
      {
        id: "rec-1043-1",
        rank: 1,
        startup: {
          id: "startup-aquapulse",
          name: "AquaPulse Dynamics",
          dpiit: "DIPP78411",
          capabilities: ["Acoustic Hydrophone Pods", "Pressure Transient Analysis", "GIS Leak Overlay"],
          data_class: "SIMULATED",
        },
        score: 93,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT recognized startup", data_class: "OFFICIAL" },
            { code: "SCADA_COMPAT", name: "SCADA Compatibility", status: "PASS", reason: "Modbus/OPC-UA protocols verified", data_class: "SIMULATED" },
            { code: "WATER_INGRESS", name: "IP68 Submersible Seal", status: "PASS", reason: "NABL lab certified submersible enclosure", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 94, "Evidence Strength": 93, "Technical Capability": 95, "Deployment Feasibility": 91, "Cost Efficiency": 92 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1043-2",
        rank: 2,
        startup: {
          id: "startup-hydrosense",
          name: "HydroSense Labs",
          dpiit: "DIPP81290",
          capabilities: ["Ultrasonic Pipe Flow Meters", "Non-Revenue Water Telemetry", "Transient Flow AI"],
          data_class: "SIMULATED",
        },
        score: 89,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT recognized startup", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 90, "Evidence Strength": 88, "Technical Capability": 91, "Deployment Feasibility": 86, "Cost Efficiency": 89 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1043-3",
        rank: 3,
        startup: {
          id: "startup-pipevision",
          name: "PipeVision AI",
          dpiit: "DIPP73912",
          capabilities: ["In-Pipe Crawler Inspection", "Corrosion Imaging", "CCTV Video Ingestion"],
          data_class: "SIMULATED",
        },
        score: 84,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 84, "Evidence Strength": 82, "Technical Capability": 87, "Deployment Feasibility": 81, "Cost Efficiency": 84 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1043-4",
        rank: 4,
        startup: {
          id: "startup-flowguard",
          name: "FlowGuard Systems",
          dpiit: "DIPP68402",
          capabilities: ["Pressure Reduction Valve Telemetry", "Hydraulic Balance Simulation", "SCADA Alarms"],
          data_class: "SIMULATED",
        },
        score: 79,
        band: "Conditional Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 80, "Evidence Strength": 77, "Technical Capability": 82, "Deployment Feasibility": 79, "Cost Efficiency": 78 },
        pipeline: {},
        data_class: "SIMULATED",
      },
    ],
    requirement: {
      id: "req-1043",
      problem_id: "1043",
      status: "Approved",
      version: "1.0",
      budget: "₹1.50 Cr",
      timeline: "120 Days",
      kpis: [
        { id: "kpi-1043-1", name: "Acoustic Detection Accuracy", target: "≥90%", method: "Controlled test section leak inducement test", actual: "92.4%", met: true, status: "On Track" },
        { id: "kpi-1043-2", name: "Leak Localization Range", target: "<50m", method: "Acoustic hydrophone cross-correlation", actual: "38m", met: true, status: "On Track" },
        { id: "kpi-1043-3", name: "Sensor Pod Density", target: "100 pods", method: "Deployment telemetry verification logs", actual: "64 pods", met: false, status: "Needs Review" },
        { id: "kpi-1043-4", name: "SCADA Sync Latency", target: "<10s", method: "Municipal hydraulic control room telemetry sync", actual: "4.2s", met: true, status: "On Track" },
      ],
      functional_specs: ["Acoustic hydrophone telemetry", "Hydraulic GIS mapping", "Automated burst alarms & pressure drops"],
      non_functional_specs: ["Battery life ≥3 years", "SCADA isolation protocol", "IP68 submersible enclosure"],
      security_constraints: [
        "SCADA network isolation to prevent unauthorized hydraulic access.",
        "End-to-end encrypted MQTT telemetry across cellular sensor pods.",
        "Municipal water network topology classified as Confidential C-3.",
      ],
      operational_constraints: [
        "Zero disruption to municipal drinking water pressure during pod retrofitting.",
        "Submersible sensor pods must survive monsoon water logging in utility chambers.",
      ],
      integration_requirements: [
        "MCGM Hydraulic SCADA Control Center bi-directional OPC-UA sync.",
        "PRAMAN Evidence Locker automated acoustic signature archiving.",
      ],
    },
    pilot: {
      id: "PIL-MH-2026-023",
      name: "Urban Water Leakage & Distribution Network Telemetry",
      problem_id: "1043",
      department: "Municipal Corporation",
      startup: "AquaPulse Dynamics",
      location: "Mumbai Suburban - Ward K/East",
      budget: "₹1.50 Cr",
      status: "Deployment",
      duration_days: 120,
      current_day: 24,
      current_stage_index: 1,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Acoustic Detection", target: "≥90%", current: "92.4%", status: "passed", note: "Bench tests & Zone 1 validation", proofFile: "Acoustic_Pod_Calibration.pdf" },
        { name: "Leak Range", target: "<50m", current: "38m", status: "passed", note: "Cross-correlation within 38m precision", proofFile: "Zone1_Leak_Map.pdf" },
        { name: "Sensor Pods Active", target: "100 pods", current: "64 pods", status: "attention", note: "Sector 4 deployment in progress", proofFile: "Telemetry_Audit_June.xlsx" },
      ],
      evidence: [
        { id: "EVID-023-DEP", name: "Zone1_Sensor_Installation.pdf", category: "Technical", status: "Verified", uploader: "Assistant Engineer (Water)", date: "2026-06-05", hash: "2A4F8811...001", verificationNote: "64 acoustic pods installed and mapped." },
        { id: "EVID-023-TST", name: "Acoustic_Pod_Calibration.pdf", category: "Performance", status: "Verified", uploader: "AquaPulse Dynamics", date: "2026-06-18", hash: "3E9A11F4...002", verificationNote: "Bench tests confirm acoustic frequency response 50Hz–2000Hz." },
        { id: "EVID-023-SEC", name: "SCADA_Network_Isolation.pdf", category: "Security", status: "Pending", uploader: "Municipal IT Security", date: "Due 30 Sept 2026", hash: "Pending Upload", verificationNote: "Network air-gap protocol verification pending IT audit." },
        { id: "EVID-023-GOV", name: "Ward_Acceptance_Signoff.pdf", category: "Governance", status: "Required", uploader: "Executive Engineer (Water)", date: "Post-Day 120", hash: "Pending Generation", verificationNote: "Required for final procurement readiness gate." },
      ],
      nextActionText: "Complete Sector 4 sensor deployment & upload Cyber Isolation Certificate.",
      nextActionSubtext: "36 acoustic pods remain to be deployed in Sector 4 before data collection stage begins.",
      nextActionButtonLabel: "Review Deployment Evidence →",
      outcome: null,
    },
    financialMilestones: [
      { id: 1, stage: "Requirement", milestone: "Hydraulic Feasibility & Requirement Sign-off", amount: 0, trigger: "Municipal Corporation approval of pilot scope & feeder maps", status: "Completed" },
      { id: 2, stage: "Pilot", milestone: "Acoustic Sensor Pod Deployment (Ward K)", amount: 2000000, trigger: "60 acoustic sensor pods installed on distribution network", status: "Released", evidenceCount: 3 },
      {
        id: 3, stage: "Pilot", milestone: "Sector 4 Acoustic Telemetry Ingest (60 Days)", amount: 2500000, trigger: "100 sensor pods streaming + leak localization accuracy validated <50m", status: "Pending Approval", evidenceCount: 4,
        conditions: [
          { text: "64 / 100 acoustic sensor pods actively streaming telemetry", met: true },
          { text: "Bench calibrated frequency acoustic signature library compiled", met: true },
          { text: "Municipal water engineering preliminary field inspection", met: true },
          { text: "Full 100 pod sensor mesh completion in Sector 4", met: false },
          { text: "Hydraulic Chief Engineer milestone sign-off", met: false },
        ],
      },
      { id: 4, stage: "Evidence", milestone: "Non-Revenue Water (NRW) Reduction Benchmark", amount: 3500000, trigger: "Independent validation of 15% reduction in non-revenue water loss", status: "Locked", lockedReason: "Sector 4 telemetry ingest (Milestone #3) has not yet been approved." },
      { id: 5, stage: "Procurement", milestone: "City-wide Pipeline Monitoring Contract", amount: 4500000, trigger: "Procurement readiness score ≥80/100 & GeM custom bid clearance", status: "Locked", lockedReason: "Pilot evidence and NRW benchmarks are not yet verified." },
      { id: 6, stage: "Deployment", milestone: "SCADA Integration & Handover", amount: 2500000, trigger: "Full integration with central hydraulic control room", status: "Locked", lockedReason: "Procurement award pending." },
    ],
    readiness: {
      score: 84,
      band: "Moderate Readiness",
      dimensions: {
        "Technical Validation": 18,
        "Pilot Performance": 17,
        "Evidence Completeness": 16,
        "Compliance": 15,
        "Budget Alignment": 10,
        "Security & Data": 8,
      },
      blocker: "Hydraulic SCADA map integration pending field engineer sign-off",
      suggested_action: "Complete Sector 4 sensor installation and upload network isolation report.",
      disclaimer: "PRAMAN provides decision support. Final procurement decisions remain with authorized government officials.",
      data_class: "SIMULATED",
      handoffItems: [
        { name: "Structured Requirement", ready: true },
        { name: "Startup Evaluation & Matching", ready: true },
        { name: "Pilot Telemetry Evidence", ready: true },
        { name: "Regulatory & Legal Compliance", ready: true },
        { name: "Financial Milestone Plan", ready: true },
        { name: "Departmental Cost Benefit Analysis", ready: false },
        { name: "Security & CERT-In Certification", ready: false },
      ],
    },
    scale: {
      reason: "Successful acoustic hydrophone deployment across Mumbai trunk mains provides reusable acoustic signature models and telemetry frameworks for other municipal corporations.",
      pilotOutcome: "Pilot In Progress · 92.4% Detection Accuracy",
      keyKpiResults: "92.4% Acoustic Detection, 38m Range, 4.2s Latency",
      evidenceStatus: "8 supporting documentation proofs filed in Locker",
      targetDepartments: [
        { department: "Thane Municipal Corporation", location: "Thane", domain: "Water Works", potentialUse: "Old city underground distribution network leak localization", compatibility: 92, status: "Pending Review", actionRequired: "Evaluate hydraulic chamber compatibility" },
        { department: "Pune Municipal Corporation", location: "Pune", domain: "Water Supply", potentialUse: "24x7 Water Supply Project pressure zone telemetry", compatibility: 89, status: "Pending Review", actionRequired: "Review acoustic library calibration" },
        { department: "Navi Mumbai Municipal Corporation", location: "Navi Mumbai", domain: "Smart Utilities", potentialUse: "Industrial pipeline corridor leak surveillance", compatibility: 86, status: "Not Started", actionRequired: "Request departmental review" },
      ],
      adaptations: [
        { sourcePilot: "Mumbai Cast Iron Trunk Mains", targetDepartment: "Thane Ductile Iron Network", requiredAdaptation: "Acoustic wave speed calibration for DI pipe material", effort: "Low", status: "Ready" },
        { sourcePilot: "MCGM Hydraulic SCADA System", targetDepartment: "PMC Water Management SCADA", requiredAdaptation: "Modbus telemetry adapter configuration", effort: "Medium", status: "Required" },
      ],
      readinessDimensions: [
        { name: "Technical Compatibility", score: 18, max: 20, desc: "Acoustic hydrophones compatible with all standard fire hydrants & valves" },
        { name: "Operational Compatibility", score: 17, max: 20, desc: "Standard municipal utility chamber dimensions match" },
        { name: "Data Compatibility", score: 19, max: 20, desc: "OPC-UA and Modbus telemetry standards natively supported" },
        { name: "Evidence Reusability", score: 18, max: 20, desc: "Acoustic leak signature models reusable across similar pipe diameters" },
        { name: "Integration Effort", score: 17, max: 20, desc: "Requires minor calibration of local pipe acoustic velocity profiles" },
      ],
      replicationReadinessScore: 89,
      estimated_scale_savings: "₹5.8 Cr non-revenue water savings annually across urban local bodies",
    },
  },

  // ── SCENARIO 3: SMART WASTE COLLECTION ───────────────────────────────────
  {
    id: "1044",
    display_id: "PRB-MH-2026-1044",
    title: "Smart Waste Collection",
    department: "Municipal Corporation",
    problem: "Optimize municipal waste collection routes and identify collection inefficiencies.",
    narrative: "Dynamic route optimization using bin fill-level ultrasonic telemetry and vehicular GPS logs to reduce municipal fuel consumption and missed ward pickups.",
    technology: "AI + Route Optimization",
    location: "Nashik",
    budget: "₹40L – ₹80L",
    timeline_days: 60,
    core_kpi: "Route fuel efficiency gain ≥25% and missed pickups <2%",
    constraint: "Must integrate with legacy municipal sanitation vehicle fleet without cabin modifications",
    domain: "Urban Waste Management",
    deployment: "Nashik Central and CIDCO sanitation zones",
    security: "Role-based driver dispatch privacy, localized municipal server hosting",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-cleanroute",
      name: "CleanRoute AI",
      dpiit: "DIPP65239",
      capabilities: ["Bin Fill Telemetry", "Dynamic Dispatch Algorithms", "Sanitation Fleet Analytics"],
      data_class: "SIMULATED",
    },
    recommendations: [
      {
        id: "rec-1044-1",
        rank: 1,
        startup: {
          id: "startup-cleanroute",
          name: "CleanRoute AI",
          dpiit: "DIPP65239",
          capabilities: ["Bin Fill Telemetry", "Dynamic Dispatch", "Fleet Analytics"],
          data_class: "SIMULATED",
        },
        score: 92,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
            { code: "FLEET_INTEG", name: "Vehicle GPS Compatibility", status: "PASS", reason: "OBD-II and smartphone SDK verified", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Requirement Fit": 93, "Evidence Strength": 91, "Technical Capability": 94, "Deployment Feasibility": 93, "Cost Efficiency": 90 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1044-2",
        rank: 2,
        startup: {
          id: "startup-wastegrid",
          name: "WasteGrid Technologies",
          dpiit: "DIPP72109",
          capabilities: ["Optical Volume Sensors", "Solid Waste Analytics", "Smart City Ingestion"],
          data_class: "SIMULATED",
        },
        score: 88,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 89, "Evidence Strength": 87, "Technical Capability": 89, "Deployment Feasibility": 88, "Cost Efficiency": 87 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1044-3",
        rank: 3,
        startup: {
          id: "startup-ecofleet",
          name: "EcoFleet Systems",
          dpiit: "DIPP59104",
          capabilities: ["EV Sanitation Vehicles", "Dynamic Routing", "Telemetry Dashboards"],
          data_class: "SIMULATED",
        },
        score: 85,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 85, "Evidence Strength": 83, "Technical Capability": 87, "Deployment Feasibility": 86, "Cost Efficiency": 84 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1044-4",
        rank: 4,
        startup: {
          id: "startup-urbanbin",
          name: "UrbanBin Technologies",
          dpiit: "DIPP64019",
          capabilities: ["Solar Compacting Bins", "Cellular Status Telemetry", "Citizen Reporting"],
          data_class: "SIMULATED",
        },
        score: 81,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 81, "Evidence Strength": 80, "Technical Capability": 83, "Deployment Feasibility": 80, "Cost Efficiency": 81 },
        pipeline: {},
        data_class: "SIMULATED",
      },
    ],
    requirement: {
      id: "req-1044",
      problem_id: "1044",
      status: "Approved",
      version: "1.0",
      budget: "₹65L (Pilot Head)",
      timeline: "60 Days",
      kpis: [
        { id: "kpi-1044-1", name: "Fuel Efficiency Gain", target: "≥25%", method: "Daily diesel log reconciliation against historical baseline", actual: "27.3%", met: true, status: "On Track" },
        { id: "kpi-1044-2", name: "Pickup Adherence", target: "≥98%", method: "Automated RFID bin lift timestamps vs schedule", actual: "98.8%", met: true, status: "On Track" },
        { id: "kpi-1044-3", name: "Bin Sensor Uptime", target: "≥99%", method: "LoRaWAN sensor heartbeat telemetry", actual: "99.1%", met: true, status: "On Track" },
        { id: "kpi-1044-4", name: "Route Generation Latency", target: "<60s", method: "Morning fleet dispatch computational benchmark", actual: "18s", met: true, status: "On Track" },
      ],
      functional_specs: ["Automated dynamic route dispatch", "Ultrasonic bin volume telemetry", "Driver turn-by-turn guidance"],
      non_functional_specs: ["Low-power LoRaWAN sensor connectivity", "Offline map sync", "Daily fuel savings audit report"],
      security_constraints: [
        "Driver phone app must not track off-duty location (privacy compliant).",
        "Sanitation depot fleet data hosted on municipal dedicated server.",
      ],
      operational_constraints: [
        "Sensor batteries must last ≥24 months in outdoor high-temperature bin lids.",
        "Zero modifications to municipal diesel vehicle cabins.",
      ],
      integration_requirements: [
        "Nashik Municipal Corporation Swachh Bharat telemetry gateway sync.",
        "PRAMAN Evidence Locker automated diesel savings log notarization.",
      ],
    },
    pilot: {
      id: "PIL-MH-2026-024",
      name: "Nashik Municipal Waste Optimization Sandbox",
      problem_id: "1044",
      department: "Municipal Corporation",
      startup: "CleanRoute AI",
      location: "Nashik Central & CIDCO Zones",
      budget: "₹80.00 Lakh",
      status: "Evaluation",
      duration_days: 60,
      current_day: 52,
      current_stage_index: 3,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Fuel Efficiency Gain", target: "≥25%", current: "27.3%", status: "passed", note: "Verified across 30 municipal vehicle routes", proofFile: "Fuel_Reconciliation_May.pdf" },
        { name: "Pickup Adherence", target: "≥98%", current: "98.8%", status: "passed", note: "RFID automated bin lift logs confirmed", proofFile: "RFID_Lift_Logs.xlsx" },
        { name: "Bin Sensor Uptime", target: "≥99%", current: "99.1%", status: "passed", note: "250 ultrasonic bin pods active", proofFile: "Sensor_Heartbeat_Audit.csv" },
      ],
      evidence: [
        { id: "EVID-024-VID", name: "Ward_Route_Audit.pdf", category: "Technical", status: "Verified", uploader: "Sanitation Superintendent", date: "2026-06-10", hash: "9A4C22F1...001", verificationNote: "Route GPS tracks verified against baseline." },
        { id: "EVID-024-EVL", name: "Fuel_Savings_Benchmark.xlsx", category: "Performance", status: "Verified", uploader: "CleanRoute AI", date: "2026-06-25", hash: "5D1B88E3...002", verificationNote: "Telemetry shows 27.3% fuel reduction across CIDCO zone." },
        { id: "EVID-024-POL", name: "Supervisor_Feedback.pdf", category: "Governance", status: "Submitted", uploader: "Sanitation Chief Inspector", date: "2026-07-02", hash: "2B8E44A1...003", verificationNote: "Field observations submitted recommending city-wide rollout." },
      ],
      nextActionText: "Finalize Joint Municipal Sanitation Evaluation Dossier.",
      nextActionSubtext: "Evaluation stage is 85% complete. Convene joint review with Sanitation Committee prior to Government Review stage.",
      nextActionButtonLabel: "View Evaluation Dossier →",
      outcome: null,
    },
    financialMilestones: [
      { id: 1, stage: "Requirement", milestone: "Ward Route Assessment & Requirement Freeze", amount: 0, trigger: "Sanitation department approval of 250 waste collection points", status: "Completed" },
      { id: 2, stage: "Pilot", milestone: "Pilot Hardware Deployment (Ward 4 & 7)", amount: 1500000, trigger: "Ultrasonic sensor pods installed on 250 community bins", status: "Released", evidenceCount: 3 },
      {
        id: 3, stage: "Pilot", milestone: "30-Day Dynamic Route Fuel Optimization Review", amount: 2000000, trigger: "250 bins streaming telemetry with ≥25% verified fuel savings", status: "Pending Approval", evidenceCount: 4,
        conditions: [
          { text: "250 bin ultrasonic pods active with 99.1% uptime", met: true },
          { text: "RFID collection confirmation logs submitted (18,400 lifts)", met: true },
          { text: "Municipal diesel log reconciliation verified by sanitation auditor", met: true },
          { text: "Superintendent sign-off on driver route adherence", met: false },
          { text: "Municipal Commissioner financial milestone release approval", met: false },
        ],
      },
      { id: 4, stage: "Evidence", milestone: "City-wide Route Simulation & Audit", amount: 1500000, trigger: "Full 60-day telemetry dossier + city-wide route scalability audit", status: "Locked", lockedReason: "30-Day fuel optimization review (Milestone #3) is pending." },
      { id: 5, stage: "Procurement", milestone: "City-wide Waste Route Optimization Award", amount: 3000000, trigger: "Procurement readiness approval & Municipal Council financial sanction", status: "Locked", lockedReason: "Final evaluation not yet completed." },
    ],
    readiness: {
      score: 89,
      band: "High Readiness",
      dimensions: {
        "Technical Validation": 19,
        "Pilot Performance": 18,
        "Evidence Completeness": 18,
        "Compliance": 15,
        "Budget Alignment": 10,
        "Security & Data": 9,
      },
      blocker: "Final sanitation supervisor qualitative satisfaction report pending upload",
      suggested_action: "Convene sanitation committee review for formal procurement authorization.",
      disclaimer: "PRAMAN provides decision support. Final procurement decisions remain with authorized government officials.",
      data_class: "SIMULATED",
      handoffItems: [
        { name: "Structured Requirement", ready: true },
        { name: "Startup Evaluation & Matching", ready: true },
        { name: "Pilot Telemetry Evidence", ready: true },
        { name: "Regulatory & Legal Compliance", ready: true },
        { name: "Financial Milestone Plan", ready: true },
        { name: "Departmental Cost Benefit Analysis", ready: false },
        { name: "Security & CERT-In Certification", ready: false },
      ],
    },
    scale: {
      reason: "Successful dynamic waste routing pilot on Nashik sanitation fleet demonstrates 27.3% fuel reduction and immediate replicability across Tier-2 urban municipal bodies.",
      pilotOutcome: "Pilot Evaluation Complete · 27.3% Fuel Reduction",
      keyKpiResults: "27.3% Fuel Efficiency Gain, 98.8% Pickup Adherence, 18s Route Latency",
      evidenceStatus: "14 verified dataset uploads in Locker",
      targetDepartments: [
        { department: "Chhatrapati Sambhajinagar Municipal Corporation", location: "Sambhajinagar", domain: "Sanitation & Waste", potentialUse: "Historic city narrow lane dynamic waste dispatch", compatibility: 91, status: "Pending Review", actionRequired: "Evaluate vehicle fleet GPS compatibility" },
        { department: "Solapur Municipal Corporation", location: "Solapur", domain: "Solid Waste", potentialUse: "Textile industrial ward waste bin level monitoring", compatibility: 88, status: "Not Started", actionRequired: "Request departmental review" },
        { department: "Kolhapur Municipal Corporation", location: "Kolhapur", domain: "Smart City", potentialUse: "River basin ward sanitation route optimization", compatibility: 87, status: "Pending Review", actionRequired: "Review fuel savings benchmark logs" },
      ],
      adaptations: [
        { sourcePilot: "Standard Nashik 240L Bins", targetDepartment: "Solapur Community Dumpsters", requiredAdaptation: "Long-range ultrasonic beam sensor bracket adaptation", effort: "Low", status: "Ready" },
        { sourcePilot: "Nashik CIDCO Ward Routing", targetDepartment: "Old City Narrow Alleys", requiredAdaptation: "Auto-rickshaw mini-tipper routing algorithm tuning", effort: "Medium", status: "Required" },
      ],
      readinessDimensions: [
        { name: "Technical Compatibility", score: 19, max: 20, desc: "LoRaWAN and cellular bin pods work on any standard municipal container" },
        { name: "Operational Compatibility", score: 18, max: 20, desc: "Driver turn-by-turn mobile app requires only 15-minute training" },
        { name: "Data Compatibility", score: 19, max: 20, desc: "Standardized Swachh Bharat municipal reporting schema" },
        { name: "Evidence Reusability", score: 19, max: 20, desc: "Fuel consumption mathematical models verified against fuel receipts" },
        { name: "Integration Effort", score: 18, max: 20, desc: "Zero hardware retrofit inside vehicles; operates via driver smartphones" },
      ],
      replicationReadinessScore: 93,
      estimated_scale_savings: "₹1.8 Cr annual diesel cost reduction across Tier-2 cities",
    },
  },

  // ── SCENARIO 4: URBAN AIR QUALITY MONITORING ─────────────────────────────
  {
    id: "1045",
    display_id: "PRB-MH-2026-1045",
    title: "Urban Air Quality Monitoring",
    department: "Urban Development Department",
    problem: "Improve localized air-quality monitoring and identify pollution hotspots.",
    narrative: "Dense grid of solar-powered IoT micro-sensors measuring PM2.5, PM10, NO2, and CO telemetry with spatio-temporal AI anomaly hotspot detection.",
    technology: "IoT Sensors + Data Analytics",
    location: "Nagpur",
    budget: "₹60L – ₹1.2Cr",
    timeline_days: 90,
    core_kpi: "Hyperlocal particulate spatial resolution ≤10m and sensor calibration correlation >0.92 with CPCB stations",
    constraint: "Solar autonomy during monsoon conditions with zero mains electrical cabling",
    domain: "Environment / Smart Cities",
    deployment: "Nagpur Industrial Corridor & High-Density Traffic Junctions",
    security: "Open API feed for public transparency portal, cryptographically signed sensor logs",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-airsense",
      name: "AirSense Labs",
      dpiit: "DIPP94301",
      capabilities: ["Hyperlocal Air Quality Pods", "Atmospheric Dispersion Modelling", "CPCB Calibration"],
      data_class: "SIMULATED",
    },
    recommendations: [
      {
        id: "rec-1045-1",
        rank: 1,
        startup: {
          id: "startup-airsense",
          name: "AirSense Labs",
          dpiit: "DIPP94301",
          capabilities: ["Hyperlocal Air Quality Pods", "Atmospheric Dispersion Modelling", "CPCB Calibration"],
          data_class: "SIMULATED",
        },
        score: 94,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
            { code: "CPCB_BENCH", name: "CPCB Benchmark Correlation", status: "PASS", reason: "R2 correlation >0.94 against reference station", data_class: "SIMULATED" },
            { code: "SOLAR_AUTO", name: "72-Hour Solar Buffer", status: "PASS", reason: "NABL certified solar battery enclosure", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 95, "Evidence Strength": 94, "Technical Capability": 96, "Deployment Feasibility": 93, "Cost Efficiency": 93 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1045-2",
        rank: 2,
        startup: {
          id: "startup-at廃棄iq",
          name: "AtmosIQ Technologies",
          dpiit: "DIPP88102",
          capabilities: ["Laser Particle Counters", "AI Hotspot Anomaly Clustering", "Smart City Ingestion"],
          data_class: "SIMULATED",
        },
        score: 89,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 90, "Evidence Strength": 88, "Technical Capability": 91, "Deployment Feasibility": 87, "Cost Efficiency": 89 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1045-3",
        rank: 3,
        startup: {
          id: "startup-cleanair",
          name: "CleanAir Systems",
          dpiit: "DIPP74910",
          capabilities: ["Fixed Pole Gas Analyzers", "Industrial Stack Telemetry", "GIS Heatmap"],
          data_class: "SIMULATED",
        },
        score: 85,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 86, "Evidence Strength": 84, "Technical Capability": 87, "Deployment Feasibility": 85, "Cost Efficiency": 83 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1045-4",
        rank: 4,
        startup: {
          id: "startup-urbanatmos",
          name: "UrbanAtmos AI",
          dpiit: "DIPP69412",
          capabilities: ["Mobile Sensor Pods", "Public Health Air Index", "Citizen Push Alerts"],
          data_class: "SIMULATED",
        },
        score: 80,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Requirement Fit": 81, "Evidence Strength": 79, "Technical Capability": 83, "Deployment Feasibility": 80, "Cost Efficiency": 79 },
        pipeline: {},
        data_class: "SIMULATED",
      },
    ],
    requirement: {
      id: "req-1045",
      problem_id: "1045",
      status: "Approved",
      version: "1.1",
      budget: "₹95L (Approved Sandbox Budget)",
      timeline: "90 Days",
      kpis: [
        { id: "kpi-1045-1", name: "CPCB Calibration R2", target: "≥0.92", method: "Continuous co-location against CPCB CAAQMS reference monitor", actual: "0.948", met: true, status: "On Track" },
        { id: "kpi-1045-2", name: "Hotspot Anomaly Detection Time", target: "<15 mins", method: "Automated dispersion cluster alert generation", actual: "8.2 mins", met: true, status: "On Track" },
        { id: "kpi-1045-3", name: "Sensor Grid Uptime", target: "≥98%", method: "24/7 solar battery heartbeat telemetry", actual: "99.4%", met: true, status: "On Track" },
        { id: "kpi-1045-4", name: "Particulate Precision", target: "±5 µg/m³", method: "Gravimetric calibration chamber audit", actual: "±3.2 µg/m³", met: true, status: "On Track" },
      ],
      functional_specs: ["PM2.5, PM10, NO2, CO continuous sampling", "Automated spatial heatmap rendering", "SMS anomaly alerts to pollution control officers"],
      non_functional_specs: ["72-hour battery solar buffer", "NIST traceable calibration certificate", "Open government data standard compliant"],
      security_constraints: [
        "Cryptographically signed sensor data packets to prevent data tampering.",
        "Secure MQTT over TLS 1.3 encryption to state environmental server.",
      ],
      operational_constraints: [
        "Solar autonomy during heavy monsoon overcast without mains power.",
        "IP66 weatherproof enclosure rated for ambient temperatures up to 48°C.",
      ],
      integration_requirements: [
        "Maharashtra Pollution Control Board (MPCB) central dashboard API sync.",
        "Nagpur Smart City Integrated Command and Control Centre (ICCC) video wall sync.",
      ],
    },
    pilot: {
      id: "PIL-MH-2026-025",
      name: "Nagpur Hyperlocal Air Quality Sandbox",
      problem_id: "1045",
      department: "Urban Development Department",
      startup: "AirSense Labs",
      location: "Nagpur Industrial Corridor & Traffic Corridors",
      budget: "₹95.00 Lakh",
      status: "Government Review",
      duration_days: 90,
      current_day: 90,
      current_stage_index: 4,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "CPCB Calibration R2", target: "≥0.92", current: "0.948", status: "passed", note: "Co-located at Civil Lines CPCB reference station", proofFile: "CPCB_Calibration_Report.pdf" },
        { name: "Hotspot Detection Time", target: "<15 mins", current: "8.2 mins", status: "passed", note: "Industrial spike alerts sent to MPCB in 8.2 mins", proofFile: "Hotspot_Logs_Nagpur.xlsx" },
        { name: "Sensor Grid Uptime", target: "≥98%", current: "99.4%", status: "passed", note: "50 solar pods operating with 99.4% uptime", proofFile: "Uptime_Telemetry_90Days.csv" },
      ],
      evidence: [
        { id: "EVID-025-CAL", name: "CPCB_CoLocation_Benchmark.pdf", category: "Technical", status: "Verified", uploader: "MPCB Senior Scientist", date: "2026-06-12", hash: "7C3E11A9...001", verificationNote: "R2 correlation validated at 0.948 across 90 days." },
        { id: "EVID-025-EVL", name: "Industrial_Corridor_Air_Dossier.pdf", category: "Performance", status: "Verified", uploader: "AirSense Labs", date: "2026-06-28", hash: "4D8B22C1...002", verificationNote: "14 localized industrial emission spikes mapped and remediated." },
        { id: "EVID-025-GOV", name: "Pollution_Board_Acceptance.pdf", category: "Governance", status: "Verified", uploader: "Regional Officer Nagpur", date: "2026-07-05", hash: "1A9E33F4...003", verificationNote: "Technical acceptance sign-off recommended for state procurement." },
      ],
      nextActionText: "Review Final Government Sign-off & Authorize State Procurement Handoff.",
      nextActionSubtext: "All 90-day sandbox pilot milestones completed with 100% KPI compliance verified by MPCB.",
      nextActionButtonLabel: "View Final Sign-off Dossier →",
      outcome: {
        determination: "Procurement Recommended",
        summary: "AirSense Labs hyperlocal sensor mesh demonstrated 0.948 correlation with CPCB stations at 1/10th legacy equipment capital cost.",
        authority: "Urban Development Department & MPCB Joint Committee",
        date: "2026-07-15",
        decisionNumber: "DEC-MH-2026-088",
      },
    },
    financialMilestones: [
      { id: 1, stage: "Requirement", milestone: "Air Quality Baseline & Grid Topology Approval", amount: 0, trigger: "MPCB and Urban Development approval of 50 sensor locations", status: "Completed" },
      { id: 2, stage: "Pilot", milestone: "Hyperlocal Sensor Pod Grid Installation (50 Pods)", amount: 2500000, trigger: "50 solar IoT pods deployed in Nagpur industrial & traffic zones", status: "Released", evidenceCount: 4 },
      {
        id: 3, stage: "Pilot", milestone: "CPCB Reference Co-Location Benchmark (30 Days)", amount: 3000000, trigger: "30-day co-location data showing R2 correlation ≥0.92 with reference station", status: "Pending Approval", evidenceCount: 5,
        conditions: [
          { text: "50 solar IoT sensor pods operating continuously", met: true },
          { text: "CPCB co-location telemetry log compiled (2.1M data points)", met: true },
          { text: "R2 correlation coefficient verified at 0.948 (target ≥0.92)", met: true },
          { text: "MPCB regional scientific officer review sign-off", met: true },
          { text: "Urban Development Department financial sanction release", met: false },
        ],
      },
      { id: 4, stage: "Evidence", milestone: "90-Day Hotspot Anomaly Telemetry Dossier", amount: 1500000, trigger: "Final 90-day pilot completion & pollution hotspot algorithm audit", status: "Locked", lockedReason: "Co-location benchmark review (Milestone #3) is pending." },
      { id: 5, stage: "Procurement", milestone: "State-wide Hyperlocal Air Monitoring Rollout", amount: 2500000, trigger: "Final procurement approval & State Clean Air Action Plan funding", status: "Locked", lockedReason: "Final procurement decision gate pending." },
    ],
    readiness: {
      score: 93,
      band: "High Readiness",
      dimensions: {
        "Technical Validation": 20,
        "Pilot Performance": 19,
        "Evidence Completeness": 19,
        "Compliance": 15,
        "Budget Alignment": 10,
        "Security & Data": 10,
      },
      blocker: "None (All technical, compliance, and security gates cleared)",
      suggested_action: "Authorize Procurement Handoff and notify State Pollution Control Board.",
      disclaimer: "PRAMAN provides decision support. Final procurement decisions remain with authorized government officials.",
      data_class: "SIMULATED",
      handoffItems: [
        { name: "Structured Requirement", ready: true },
        { name: "Startup Evaluation & Matching", ready: true },
        { name: "Pilot Telemetry Evidence", ready: true },
        { name: "Regulatory & Legal Compliance", ready: true },
        { name: "Financial Milestone Plan", ready: true },
        { name: "Departmental Cost Benefit Analysis", ready: true },
        { name: "Security & CERT-In Certification", ready: true },
      ],
    },
    scale: {
      reason: "Successful hyperlocal air quality sensor grid in Nagpur provides a pre-validated, low-cost alternative to expensive CAAQMS stations for statewide urban pollution monitoring.",
      pilotOutcome: "Procurement Recommended · 100% KPI Compliance",
      keyKpiResults: "0.948 CPCB Correlation, 8.2 min Hotspot Detection, 99.4% Grid Uptime",
      evidenceStatus: "21 verified environmental telemetry records in Locker",
      targetDepartments: [
        { department: "Maharashtra Pollution Control Board", location: "Statewide", domain: "Environmental Protection", potentialUse: "Statewide industrial cluster air surveillance network", compatibility: 96, status: "Consent Recorded", actionRequired: "Draft state rate contract agreement" },
        { department: "Mumbai Air Quality Taskforce", location: "Mumbai", domain: "Urban Air Quality", potentialUse: "Construction dust and coastal corridor micro-monitoring", compatibility: 94, status: "Pending Review", actionRequired: "Evaluate marine humidity sensor calibration" },
        { department: "Pune Smart City SPV", location: "Pune", domain: "Smart Environment", potentialUse: "Smart pole integrated air telemetry sync with ICCC", compatibility: 92, status: "Pending Review", actionRequired: "Review ICCC API integration dossier" },
      ],
      adaptations: [
        { sourcePilot: "Nagpur Solar Battery Pods", targetDepartment: "Mumbai Coastal Humid Air", requiredAdaptation: "Anti-corrosive conformal coating for coastal marine salt air", effort: "Low", status: "Ready" },
        { sourcePilot: "Nagpur ICCC Telemetry Ingestion", targetDepartment: "Pune Smart City ICCC", requiredAdaptation: "Smart pole mounting bracket & power tap integration", effort: "Low", status: "Ready" },
      ],
      readinessDimensions: [
        { name: "Technical Compatibility", score: 20, max: 20, desc: "Plug-and-play solar pods mount on any standard street lighting pole" },
        { name: "Operational Compatibility", score: 19, max: 20, desc: "Autonomous solar power requires zero electrical grid maintenance" },
        { name: "Data Compatibility", score: 20, max: 20, desc: "Compliant with CPCB National Air Quality Index (NAQI) data format" },
        { name: "Evidence Reusability", score: 20, max: 20, desc: "90-day co-location calibration dataset accepted by MPCB scientists" },
        { name: "Integration Effort", score: 19, max: 20, desc: "RESTful JSON APIs connect directly to state environmental dashboards" },
      ],
      replicationReadinessScore: 97,
      estimated_scale_savings: "₹8.5 Cr capital cost savings compared to fixed legacy CAAQMS stations",
    },
  },
];
