import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

import { HealthReportComponent } from "../components/HealthReportComponent";
import type { HealthReport } from "../types";

interface Props {
  report: HealthReport;
  onNewAssessment: () => void;
}

export const ReportPage: React.FC<Props> = ({
  report,
  onNewAssessment,
}) => {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f8fafc]">

      {/* Top actions */}
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 pt-6 sm:px-6">

        <button
          onClick={onNewAssessment}
          className="
            group
            flex items-center gap-2
            rounded-lg
            px-3 py-2
            text-sm font-medium
            text-slate-500
            transition-all
            hover:bg-white
            hover:text-slate-900
            hover:shadow-sm
          "
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          New assessment
        </button>

        <button
          onClick={onNewAssessment}
          className="
            hidden sm:flex
            items-center gap-2
            rounded-lg
            border border-slate-200
            bg-white
            px-3 py-2
            text-sm font-medium
            text-slate-600
            shadow-sm
            transition-all
            hover:border-slate-300
            hover:text-slate-900
            hover:shadow
          "
        >
          <Plus size={16} />

          Start again
        </button>

      </div>

      <HealthReportComponent report={report} />

    </main>
  );
};

export default ReportPage;