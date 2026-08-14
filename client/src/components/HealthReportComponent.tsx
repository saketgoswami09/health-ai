import React from "react";
import type { HealthReport } from "../types";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  ShieldAlert,
} from "lucide-react";

interface Props {
  report: HealthReport;
}

const severityConfig = {
  mild: {
    label: "Mild",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
  },
  moderate: {
    label: "Moderate",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: "bg-amber-100 text-amber-600",
  },
  severe: {
    label: "Severe",
    className: "bg-rose-50 text-rose-700 border-rose-100",
    icon: "bg-rose-100 text-rose-600",
  },
} as const;

export const HealthReportComponent: React.FC<Props> = ({
  report,
}) => {
  const severity =
    severityConfig[
      report.severity as keyof typeof severityConfig
    ] ?? severityConfig.moderate;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-blue-600">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <FileText size={17} />
          </span>

          Assessment Report
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Your health assessment
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              A structured summary based on your conversation with Radha.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <CheckCircle2 size={15} />
            Assessment complete
          </div>
        </div>
      </div>

      {/* Main concern */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity size={20} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Main concern
              </p>

              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
                What you told us
              </h2>
            </div>
          </div>

          <p className="text-lg leading-8 text-slate-700">
            {report.mainConcern}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="mt-5 grid gap-5 sm:grid-cols-2">

        {/* Duration */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Clock size={19} />
            </div>

            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Duration
            </span>
          </div>

          <p className="mt-5 text-xl font-semibold text-slate-900">
            {report.duration}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            How long you've experienced this
          </p>
        </div>

        {/* Severity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${severity.icon}`}
            >
              <AlertTriangle size={19} />
            </div>

            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Severity
            </span>
          </div>

          <div className="mt-5">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${severity.className}`}
            >
              {severity.label}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Based on the information provided
          </p>
        </div>
      </section>

      {/* Symptoms */}
      <section className="mt-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Symptoms
          </p>

          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Reported symptoms
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {report.symptoms.map((symptom, index) => {
            const config =
              severityConfig[
                symptom.severity as keyof typeof severityConfig
              ] ?? severityConfig.moderate;

            return (
              <div
                key={index}
                className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${
                  index !== report.symptoms.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />

                  <div>
                    <p className="font-medium text-slate-900">
                      {symptom.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {symptom.duration}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}
                >
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional details */}
      {report.additionalDetails.length > 0 && (
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Context
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Additional details
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {report.additionalDetails.map(
                (detail, index) => (
                  <div
                    key={index}
                    className="flex gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Info size={14} />
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {detail}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Follow up */}
      <section className="mt-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ArrowRight size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
              Recommended next step
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Follow-up
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-700">
              {report.followUp}
            </p>
          </div>
        </div>
      </section>

      {/* Safety notice */}
      <div className="mt-6 flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
        <ShieldAlert
          size={18}
          className="mt-0.5 shrink-0 text-amber-600"
        />

        <p className="text-xs leading-5 text-amber-800">
          This assessment is generated from your conversation
          and is intended for informational purposes only. It
          does not replace professional medical advice,
          diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
};

export default HealthReportComponent;