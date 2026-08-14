import React from 'react';
import { HealthReportComponent } from '../components/HealthReportComponent';
import type { HealthReport } from '../types';

interface Props {
  report: HealthReport;
  onNewAssessment: () => void;
}

export const ReportPage: React.FC<Props> = ({ report, onNewAssessment }) => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
        <button
          onClick={onNewAssessment}
          className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          New Assessment
        </button>
      </div>
      
      <HealthReportComponent report={report} />
    </div>
  );
};
