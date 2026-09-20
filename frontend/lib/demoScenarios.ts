import type { Problem, Recommendation, DataClass } from "@/types/praman";

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
  requirement: Record<string, any>;
  pilot: Record<string, any>;
  readiness: {
    score: number;
    band: string;
    dimensions: Record<string, number>;
    blocker: string;
    suggested_action: string;
    disclaimer: string;
    data_class: string;
  };
  scale: Record<string, any>;
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  // ── SCENARIO 1 ────────────────────────────────────────────────────────────
  {
    id: "1042",
    display_id: "PRB-MH-2026-1042",
    title: "Road Damage Detection",
    department: "PWD Maharashtra",
    problem: "Detect road damage using public transport telemetry and computer vision.",
    narrative: "Pune municipal bus fleet equipped with low-cost edge cameras to autonomously stream localized road distress data to the state public works dashboard.",
    technology: "Computer Vision",
    location: "Pune",
    budget: "₹50L – ₹1Cr",
    timeline_days: 90,
    core_kpi: "Detection accuracy ≥85% on pothole & surface fissure telemetry",
    constraint: "Must operate on edge devices with intermittent 4G/5G mobile connectivity",
    domain: "Smart Infrastructure",
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
          capabilities: ["Edge Computer Vision", "Fleet Telemetry"],
          data_class: "SIMULATED",
        },
        score: 94,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT recognized startup entity", data_class: "OFFICIAL" },
            { code: "MIN_DEPLOY", name: "Prior Field Testing", status: "PASS", reason: "Prior pilot in PMC Zone 3 verified", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Technical Capability": 95, "Deployment Feasibility": 92, "Cost Efficiency": 94, "Security & Compliance": 90 },
        pipeline: {},
        data_class: "SIMULATED",
      },
      {
        id: "rec-1042-2",
        rank: 2,
        startup: {
          id: "startup-roadpulse",
          name: "RoadPulse Vision Labs",
          dpiit: "DIPP84102",
          capabilities: ["LiDAR Mapping", "Drone Video Ingestion"],
          data_class: "SIMULATED",
        },
        score: 86,
        band: "Moderate Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Technical Capability": 88, "Deployment Feasibility": 84, "Cost Efficiency": 85, "Security & Compliance": 86 },
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
      timeline: "90 Days",
      kpis: [
        { name: "Detection Accuracy", target: "≥85%", actual: "89.2%", met: true },
        { name: "False Positive Rate", target: "<10%", actual: "8.1%", met: true },
        { name: "Fleet Coverage", target: "≥90%", actual: "76.4%", met: false },
      ],
      functional_specs: ["Edge AI inference on vehicle dashcams", "Automated GPS distress pinpointing", "GIS map ingestion"],
      non_functional_specs: ["2.0s max telemetry latency", "Indian cloud data residency", "CERT-In cybersecurity clearance"],
    },
    pilot: {
      id: "pil-1042",
      name: "Road Distress Sandbox Telemetry",
      problem_id: "1042",
      department: "PWD Maharashtra",
      startup: "SkylineAI Solutions",
      location: "Pune Municipal & PWD Zone 4",
      budget: "₹1.00 Cr",
      status: "Data Collection",
      duration_days: 90,
      current_day: 42,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Detection Accuracy", target: "≥85%", actual: "89.2%", met: true },
        { name: "False Positive Rate", target: "<10%", actual: "8.1%", met: true },
        { name: "Fleet Coverage", target: "≥90%", actual: "76.4%", met: false },
      ],
      success: {
        score: 91,
        label: "High Readiness",
        summary: "Autonomous edge vision telemetry meets all critical core KPIs.",
      },
    },
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
    },
    scale: {
      eligible_departments: ["Mumbai Municipal Corporation", "Nagpur Smart City SPV", "Nashik Municipal Corporation"],
      estimated_scale_savings: "₹3.2 Cr over 3 years",
      status: "Ready for Multi-Department Adoption",
    },
  },

  // ── SCENARIO 2 ────────────────────────────────────────────────────────────
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
          capabilities: ["Acoustic Hydrophone Pods", "GIS Leak Overlay"],
          data_class: "SIMULATED",
        },
        score: 92,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT recognized startup", data_class: "OFFICIAL" },
            { code: "SCADA_COMPAT", name: "SCADA Compatibility", status: "PASS", reason: "Modbus/OPC-UA protocols verified", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Technical Capability": 94, "Deployment Feasibility": 90, "Cost Efficiency": 91, "Security & Compliance": 92 },
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
        { name: "Acoustic Detection", target: "≥90%", actual: "92.4%", met: true },
        { name: "Leak Range", target: "<50m", actual: "38m", met: true },
        { name: "Sensor Density", target: "100 pods", actual: "64 pods", met: false },
      ],
      functional_specs: ["Acoustic hydrophone telemetry", "Hydraulic GIS mapping", "Automated burst alarms"],
      non_functional_specs: ["Battery life ≥3 years", "SCADA isolation protocol", "IP68 submersible enclosure"],
    },
    pilot: {
      id: "pil-1043",
      name: "Ward K Distribution Network Telemetry",
      problem_id: "1043",
      department: "Mumbai Municipal Corporation",
      startup: "AquaPulse Dynamics",
      location: "Mumbai Suburban - Ward K/East",
      budget: "₹1.50 Cr",
      status: "Deployment",
      duration_days: 120,
      current_day: 24,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Acoustic Detection", target: "≥90%", actual: "92.4%", met: true },
        { name: "Leak Range", target: "<50m", actual: "38m", met: true },
        { name: "Sensor Density", target: "100 pods", actual: "64 pods", met: false },
      ],
      success: {
        score: 84,
        label: "Moderate Readiness",
        summary: "Initial deployment confirms high acoustic sensitivity on live water mains.",
      },
    },
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
    },
    scale: {
      eligible_departments: ["Thane Municipal Corporation", "Pune Municipal Corporation", "Navi Mumbai Municipal Corporation"],
      estimated_scale_savings: "₹5.8 Cr non-revenue water savings annually",
      status: "Scalable across urban municipal water utilities",
    },
  },

  // ── SCENARIO 3 ────────────────────────────────────────────────────────────
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
    domain: "Urban Sanitation",
    deployment: "Nashik Central and CIDCO sanitation zones",
    security: "Role-based driver dispatch privacy, localized municipal server hosting",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-cleanroute",
      name: "CleanRoute Systems",
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
          name: "CleanRoute Systems",
          dpiit: "DIPP65239",
          capabilities: ["Bin Fill Telemetry", "Dynamic Dispatch"],
          data_class: "SIMULATED",
        },
        score: 90,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
          ],
        },
        dimensions: { "Technical Capability": 91, "Deployment Feasibility": 93, "Cost Efficiency": 90, "Security & Compliance": 88 },
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
        { name: "Fuel Efficiency Gain", target: "≥25%", actual: "27.3%", met: true },
        { name: "Pickup Adherence", target: "≥98%", actual: "98.8%", met: true },
        { name: "Bin Sensor Uptime", target: "≥99%", actual: "99.1%", met: true },
      ],
      functional_specs: ["Automated dynamic route dispatch", "Ultrasonic bin volume telemetry", "Driver turn-by-turn guidance"],
      non_functional_specs: ["Low-power LoRaWAN sensor connectivity", "Offline map sync", "Daily fuel savings audit report"],
    },
    pilot: {
      id: "pil-1044",
      name: "Nashik Municipal Waste Optimization Sandbox",
      problem_id: "1044",
      department: "Nashik Municipal Corporation",
      startup: "CleanRoute Systems",
      location: "Nashik Central & CIDCO Zones",
      budget: "₹65.00 Lakh",
      status: "Evaluation",
      duration_days: 60,
      current_day: 52,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "Fuel Efficiency Gain", target: "≥25%", actual: "27.3%", met: true },
        { name: "Pickup Adherence", target: "≥98%", actual: "98.8%", met: true },
        { name: "Bin Sensor Uptime", target: "≥99%", actual: "99.1%", met: true },
      ],
      success: {
        score: 89,
        label: "High Readiness",
        summary: "Demonstrated 27.3% fuel reduction across 30 municipal collection routes.",
      },
    },
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
    },
    scale: {
      eligible_departments: ["Aurangabad Smart City", "Solapur Municipal Corporation", "Kolhapur Municipal Corporation"],
      estimated_scale_savings: "₹1.8 Cr diesel cost reduction across Tier-2 cities",
      status: "Replicable across all Maharashtra urban local bodies",
    },
  },

  // ── SCENARIO 4 ────────────────────────────────────────────────────────────
  {
    id: "1045",
    display_id: "PRB-MH-2026-1045",
    title: "Urban Air Quality Monitoring",
    department: "Urban Development Department",
    problem: "Improve localized air-quality monitoring and identify pollution hotspots.",
    narrative: "Dense grid of solar-powered IoT micro-sensors measuring PM2.5, PM10, NO2, and CO telemetry with spatio-temporal AI anomaly hotspot detection.",
    technology: "IoT + Data Analytics",
    location: "Nagpur",
    budget: "₹60L – ₹1.2Cr",
    timeline_days: 90,
    core_kpi: "Hyperlocal particulate spatial resolution ≤10m and sensor calibration correlation >0.92 with CPCB stations",
    constraint: "Solar autonomy during monsoon conditions with zero mains electrical cabling",
    domain: "Environment & Pollution",
    deployment: "Nagpur Industrial Corridor & High-Density Traffic Junctions",
    security: "Open API feed for public transparency portal, cryptographically signed sensor logs",
    status: "Active",
    data_class: "SIMULATED",
    startup: {
      id: "startup-aerosense",
      name: "AeroSense Technologies",
      dpiit: "DIPP94301",
      capabilities: ["Hyperlocal Air Quality Pods", "Atmospheric Dispersion Modelling", "CPCB Calibration"],
      data_class: "SIMULATED",
    },
    recommendations: [
      {
        id: "rec-1045-1",
        rank: 1,
        startup: {
          id: "startup-aerosense",
          name: "AeroSense Technologies",
          dpiit: "DIPP94301",
          capabilities: ["Hyperlocal Air Quality Pods", "Atmospheric Dispersion"],
          data_class: "SIMULATED",
        },
        score: 93,
        band: "Strong Fit",
        eligibility: {
          status: "Eligible",
          checks: [
            { code: "DPIIT_VALID", name: "DPIIT Entity Check", status: "PASS", reason: "Active DPIIT registered entity", data_class: "OFFICIAL" },
            { code: "CPCB_BENCH", name: "CPCB Benchmark Correlation", status: "PASS", reason: "R2 correlation >0.94 against reference station", data_class: "SIMULATED" },
          ],
        },
        dimensions: { "Technical Capability": 95, "Deployment Feasibility": 92, "Cost Efficiency": 93, "Security & Compliance": 92 },
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
        { name: "CPCB Calibration R2", target: "≥0.92", actual: "0.948", met: true },
        { name: "Hotspot Detection Time", target: "<15 mins", actual: "8.2 mins", met: true },
        { name: "Sensor Grid Uptime", target: "≥98%", actual: "99.4%", met: true },
      ],
      functional_specs: ["PM2.5, PM10, NO2, CO continuous sampling", "Automated spatial heatmap rendering", "SMS anomaly alerts to pollution control officers"],
      non_functional_specs: ["72-hour battery solar buffer", "NIST traceable calibration certificate", "Open government data standard compliant"],
    },
    pilot: {
      id: "pil-1045",
      name: "Nagpur Hyperlocal Air Quality Sandbox",
      problem_id: "1045",
      department: "Urban Development Department",
      startup: "AeroSense Technologies",
      location: "Nagpur Industrial Corridor",
      budget: "₹95.00 Lakh",
      status: "Government Review",
      duration_days: 90,
      current_day: 90,
      timeline: ["Pilot Setup", "Deployment", "Data Collection", "Evaluation", "Government Review"],
      kpis: [
        { name: "CPCB Calibration R2", target: "≥0.92", actual: "0.948", met: true },
        { name: "Hotspot Detection Time", target: "<15 mins", actual: "8.2 mins", met: true },
        { name: "Sensor Grid Uptime", target: "≥98%", actual: "99.4%", met: true },
      ],
      success: {
        score: 93,
        label: "Procurement Recommended",
        summary: "100% adherence to CPCB environmental monitoring protocols.",
      },
    },
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
    },
    scale: {
      eligible_departments: ["Maharashtra Pollution Control Board", "Mumbai Air Quality Taskforce", "Pune Smart City"],
      estimated_scale_savings: "₹8.5 Cr compared to fixed legacy CAAQMS stations",
      status: "Approved for statewide deployment framework",
    },
  },
];
