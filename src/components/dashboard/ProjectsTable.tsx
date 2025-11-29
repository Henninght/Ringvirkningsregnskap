"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { projectsData } from "@/data/mockData";
import { Project } from "@/types";
import { ChevronRight } from "lucide-react";

export function ProjectsTable() {
  return (
    <Card
      className="animate-slide-up overflow-hidden"
      style={{ animationDelay: "0.25s" }}
      padding="none"
    >
      <CardHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Storste bidragsytere</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Prosjekter rangert etter verdiskaping</p>
          </div>
          <button className="text-xs text-petrol-600 hover:text-petrol-700 font-medium flex items-center gap-1 transition-colors">
            Se alle
            <ChevronRight size={14} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50">
                <th className="text-left text-2xs font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-5">
                  Prosjektnavn
                </th>
                <th className="text-left text-2xs font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-5">
                  Verdi
                </th>
                <th className="text-left text-2xs font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-5">
                  Status
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {projectsData.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isLast={index === projectsData.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectRowProps {
  project: Project;
  isLast: boolean;
}

function ProjectRow({ project, isLast }: ProjectRowProps) {
  return (
    <tr
      className={`
        table-row-hover transition-colors duration-150 cursor-pointer group
        ${!isLast ? "border-b border-slate-100" : ""}
      `}
    >
      <td className="py-3.5 px-5">
        <span
          className="text-sm font-medium text-slate-800 group-hover:text-petrol-700 transition-colors"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          {project.name}
        </span>
      </td>
      <td className="py-3.5 px-5">
        <span className="text-sm text-slate-600 font-medium tabular-nums">{project.value}</span>
      </td>
      <td className="py-3.5 px-5">
        <StatusBadge status={project.status} size="sm" />
      </td>
      <td className="py-3.5 pr-5">
        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
      </td>
    </tr>
  );
}
