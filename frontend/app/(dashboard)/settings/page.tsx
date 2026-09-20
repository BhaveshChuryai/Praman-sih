"use client";

import { useState } from "react";
import { GovPageHeader, Panel } from "@/components/ui";
import { Badge } from "@/components/Badge";
import {
  Building2, Cpu, Layers, ShieldCheck, MapPin, Phone, Mail,
  Award, Globe, CheckCircle2, User, Save, Settings, Info
} from "lucide-react";
import { usePraman } from "@/lib/PramanContext";

export default function SettingsPage() {
  const { user } = usePraman();
  const isStartup = user?.role === "startup";

  const [toast, setToast] = useState(false);

  function handleSaveProfile() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  if (isStartup) {
    return (
      <div className="space-y-6 min-w-0">
        <GovPageHeader
          eyebrow="Startup Portal · Entity Profile"
          title="Startup Profile & Credentials"
          subtitle="Manage your entity credentials, technology capabilities, deployments, and compliance certifications."
          recordId="DIPP-MH-2026-9021"
          actions={
            <button
              onClick={handleSaveProfile}
              className="bg-[#0B2A5B] hover:bg-[#061727] text-white text-xs font-bold py-2 px-3.5 rounded flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save size={13} />
              <span>Save Profile</span>
            </button>
          }
        />

        {toast && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#DCFCE7] border border-[#BBF7D0] text-xs font-bold text-[#16834B]">
            <CheckCircle2 size={16} />
            <span>Startup profile information saved successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Company Information */}
            <Panel title="Company Information" icon={<Building2 size={15} />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 4 }}>Entity Legal Name</p>
                  <p className="font-bold text-[#172033] text-sm">{user?.name || "EcoVision Technologies Pvt Ltd"}</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 4 }}>DPIIT / Startup India Reg No.</p>
                  <span className="font-mono font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    DIPP91823 (Verified)
                  </span>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 4 }}>Incorporation Year</p>
                  <p className="font-medium text-[#172033]">2022</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 4 }}>Headquarters</p>
                  <p className="font-medium text-[#172033]">Pune, Maharashtra, India</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="gov-section-label" style={{ marginBottom: 4 }}>Entity Overview & Solution Scope</p>
                  <p className="text-[#5E6B7E] leading-relaxed">
                    EcoVision Technologies develops ruggedized edge-AI vision telemetry devices mounted on public transit vehicles for automated municipal road asset inspection and pothole detection.
                  </p>
                </div>
              </div>
            </Panel>

            {/* 2. Capabilities & Technology */}
            <Panel title="Core Capabilities & Technology Stack" icon={<Cpu size={15} />}>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 6 }}>Key Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Edge AI Inference",
                      "Automated Pothole & Distress Tagging",
                      "GIS Coordinate Geotagging",
                      "Sub-2s Processing Latency",
                      "Night & Low-Light Defect Detection",
                    ].map((cap) => (
                      <span key={cap} className="bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-semibold px-2.5 py-1 rounded text-[11px]">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="gov-section-label" style={{ marginBottom: 6 }}>Technology Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Embedded Linux / Yocto",
                      "NVIDIA Jetson / ARM NPU",
                      "ONNX Runtime / TensorRT",
                      "RESTful APIs / OpenAPI 3.0",
                      "LTE-M / 4G Cellular Telemetry",
                      "PostGIS / PostgreSQL",
                    ].map((tech) => (
                      <span key={tech} className="bg-[#F1F5F9] text-[#172033] border border-[#E2E8F0] font-medium px-2.5 py-1 rounded text-[11px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="gov-section-label" style={{ marginBottom: 6 }}>Problem Domains</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Urban Infrastructure",
                      "Transportation & Transit Logistics",
                      "Public Works & Smart Municipalities",
                    ].map((dom) => (
                      <span key={dom} className="bg-[#DCFCE7] text-[#16834B] border border-[#BBF7D0] font-bold px-2.5 py-1 rounded text-[11px]">
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            {/* 3. Deployment Experience */}
            <Panel title="Deployment Experience & Track Record" icon={<Layers size={15} />}>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded border border-[#D9E1EA] bg-[#F8FAFC]">
                  <div className="flex justify-between font-bold text-[#172033]">
                    <span>PMPML Bus Fleet Pilot (Pune)</span>
                    <span className="text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded text-[10px]">Active Pilot (90 Days)</span>
                  </div>
                  <p className="text-[#5E6B7E] mt-1">200 transport buses equipped with dual edge cameras across 540 km road grid.</p>
                </div>

                <div className="p-3 rounded border border-[#D9E1EA] bg-[#F8FAFC]">
                  <div className="flex justify-between font-bold text-[#172033]">
                    <span>Nashik Smart City Water Pipeline Sensor Pilot</span>
                    <span className="text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded text-[10px]">Completed (2025)</span>
                  </div>
                  <p className="text-[#5E6B7E] mt-1">Pilot completed with verified telemetry and formal procurement recommendation.</p>
                </div>
              </div>
            </Panel>
          </div>

          {/* Right Col: Certifications & Contact Info */}
          <div className="space-y-6">
            {/* Certifications */}
            <Panel title="Relevant Certifications" icon={<ShieldCheck size={15} />}>
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#16834B]">DPIIT Startup India</p>
                    <p className="text-[10px] text-[#15803D]">Certificate #DIPP91823</p>
                  </div>
                  <CheckCircle2 size={16} className="text-[#16834B]" />
                </div>

                <div className="p-2.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#16834B]">ISO 27001 Security</p>
                    <p className="text-[10px] text-[#15803D]">Information Security Management</p>
                  </div>
                  <CheckCircle2 size={16} className="text-[#16834B]" />
                </div>

                <div className="p-2.5 rounded bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#B45309]">CERT-In Audit</p>
                    <p className="text-[10px] text-[#92400E]">In Progress (80% Complete)</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#B45309]">Pending</span>
                </div>
              </div>
            </Panel>

            {/* Contact Information */}
            <Panel title="Contact Information" icon={<Phone size={15} />}>
              <div className="space-y-3 text-xs">
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Primary Contact Person</p>
                  <p className="font-bold text-[#172033]">Vikram Malhotra (CTO & Co-founder)</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Official Email</p>
                  <p className="font-mono text-[#0B2A5B]">{user?.email || "startup@praman.local"}</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Phone Number</p>
                  <p className="font-mono text-[#172033]">+91 98230 45678</p>
                </div>
                <div>
                  <p className="gov-section-label" style={{ marginBottom: 2 }}>Registered Office</p>
                  <p className="text-[#5E6B7E] leading-tight">
                    Plot 42, Hinjewadi Phase 1, Pune, Maharashtra 411057
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    );
  }

  // Government Officer Profile
  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Government Administration"
        title="Officer Settings & System Information"
        subtitle="Review portal configuration, officer access credentials, and audit parameters."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Officer Profile" icon={<User size={16} />}>
          <div className="space-y-3 text-xs">
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Nodal Officer Name</p>
              <p className="font-bold text-[#172033] text-sm">{user?.name || "Ananya Deshmukh"}</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Official Email</p>
              <p className="font-mono text-[#0B2A5B]">{user?.email || "officer@praman.local"}</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Designation / Department</p>
              <p className="font-semibold text-[#172033]">{user?.department || "Public Works Department, Maharashtra"}</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Role Authority</p>
              <span className="font-bold text-[#0B2A5B] bg-[#EEF5FC] px-2 py-0.5 rounded border border-[#BFDBFE]">
                Nodal Procurement Officer
              </span>
            </div>
          </div>
        </Panel>

        <Panel title="System Information" icon={<Settings size={16} />}>
          <div className="space-y-3 text-xs">
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Platform Release</p>
              <p className="font-bold text-[#172033]">PRAMAN v2.0 (SIH 2026 · PS 26136)</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Audit Hashing Standard</p>
              <p className="font-mono text-[#172033]">SHA-256 Append-Only Merkle Tree</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Compliance Standard</p>
              <p className="text-[#16834B] font-semibold">GIGW 3.0 & DPIIT Innovation Procurement Rules</p>
            </div>
            <div>
              <p className="gov-section-label" style={{ marginBottom: 2 }}>Operational State</p>
              <span className="font-bold text-[#16834B] bg-[#DCFCE7] px-2 py-0.5 rounded border border-[#BBF7D0]">
                All Systems Operational
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
