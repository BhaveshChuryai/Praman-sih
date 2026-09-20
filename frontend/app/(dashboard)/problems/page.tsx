"use client";

import { usePraman } from "@/lib/PramanContext";
import { GovPageHeader, Panel, Empty, ProcurementCaseCard, FilterToolbar, Pagination } from "@/components/ui";
import { Badge } from "@/components/Badge";
import { FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProblemsPage() {
  const router = useRouter();
  const { demoScenarios, selectedCaseId, loadScenario, currentStage } = usePraman();
  const [search, setSearch] = useState("");
  const [selectedStage, setSelectedStage] = useState("All Stages");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

  const problems = demoScenarios.map((sc, idx) => ({
    index: idx,
    id: sc.id,
    display_id: sc.display_id,
    title: sc.title,
    department: sc.department,
    location: sc.location,
    narrative: sc.narrative,
    budget: sc.budget,
    timeline: `${sc.timeline_days} Days Pilot`,
    domain: sc.domain,
    technology: sc.technology,
    status: selectedCaseId === sc.display_id ? "ACTIVE CASE" : sc.status,
    statusTone: (selectedCaseId === sc.display_id ? "green" : "blue") as "green" | "blue" | "amber",
  }));

  const filtered = problems.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.department.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase())) &&
    (selectedDepartment === "All Departments" || p.department.includes(selectedDepartment))
  );

  return (
    <div className="space-y-6 min-w-0">
      <GovPageHeader
        eyebrow="Government Problem to Pilot"
        title="Active Government Challenges & Directory"
        subtitle="Official government problem statements open for startup innovation, structured requirement review, and pilot validation."
        actions={
          <Link
            href="/problems/intake"
            className="bg-[#00008B] hover:bg-[#000070] text-white text-xs font-bold py-2 px-3.5 rounded flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus size={14} />
            <span>Submit New Problem</span>
          </Link>
        }
      />

      {/* Filter and View Switcher */}
      <FilterToolbar
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={setSelectedDepartment}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filtered.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-w-0">
            {filtered.map((p) => {
              const isActive = selectedCaseId === p.display_id;
              return (
                <div key={p.id} className={isActive ? "ring-2 ring-[#0B2A5B] rounded-lg" : ""}>
                  <ProcurementCaseCard
                    status={isActive ? "ACTIVE WORKFLOW" : p.status}
                    statusTone={p.statusTone}
                    valueMetric={p.budget}
                    title={p.title}
                    description={p.narrative}
                    department={p.department}
                    referenceId={p.display_id}
                    location={`${p.location} (${p.technology})`}
                    deadline={p.timeline}
                    stage={isActive ? "Stage 1 · Requirements Review" : "Stage 0 · Problem Intake"}
                    category={p.domain}
                    estimatedBudget={p.budget}
                    primaryActionLabel={isActive ? "Open Active Workflow →" : "Select Case →"}
                    onPrimaryAction={async () => {
                      if (!isActive) await loadScenario(p.index);
                      router.push("/requirements");
                    }}
                    secondaryActionLabel="Evidence Locker"
                    onSecondaryAction={() => router.push("/evidence")}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gov-card overflow-hidden">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Reference ID</th>
                  <th>Challenge Title</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Budget Range</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isActive = selectedCaseId === p.display_id;
                  return (
                    <tr key={p.id} className={isActive ? "bg-blue-50/50 font-medium" : ""}>
                      <td className="record-id font-bold">{p.display_id}</td>
                      <td>
                        <p className="font-bold text-[#00008B] text-xs">{p.title}</p>
                        <p className="text-[10px] text-[#475569]">{p.domain} · {p.technology}</p>
                      </td>
                      <td className="text-xs">{p.department}</td>
                      <td className="text-xs">{p.location}</td>
                      <td className="text-xs font-semibold">{p.budget}</td>
                      <td>
                        <Badge tone={isActive ? "success" : "neutral"}>{isActive ? "ACTIVE CASE" : p.status}</Badge>
                      </td>
                      <td>
                        <button
                          onClick={async () => {
                            if (!isActive) await loadScenario(p.index);
                            router.push("/requirements");
                          }}
                          className="text-xs font-bold text-[#00008B] hover:underline cursor-pointer"
                        >
                          {isActive ? "Open Case →" : "Select Case →"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <Panel title="No Government Challenges Found" icon={<FileText size={14} />}>
          <Empty
            text={search ? `No problems matching "${search}".` : "No problems found."}
            action={search ? "Clear search" : undefined}
          />
        </Panel>
      )}

      {filtered.length > 0 && (
        <Pagination totalItems={filtered.length} pageSize={10} currentPage={1} />
      )}
    </div>
  );
}
