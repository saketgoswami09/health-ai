import React from 'react';
import type { HealthReport } from '../types';
import { FileText, Activity, Clock, AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface Props {
  report: HealthReport;
}

export const HealthReportComponent: React.FC<Props> = ({ report }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-blue-600 p-6 text-white flex items-center gap-3">
        <FileText size={28} />
        <h2 className="text-2xl font-bold">AI Health Assessment Report</h2>
      </div>
      
      <div className="p-8 space-y-8">
        
        <section>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
            <Activity className="text-blue-600" size={20} />
            Main Concern
          </h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
            {report.mainConcern}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Clock className="text-blue-600" size={20} />
              Duration
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {report.duration}
            </p>
          </section>
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <AlertTriangle className="text-blue-600" size={20} />
              Severity Assessment
            </h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 capitalize">
              {report.severity}
            </p>
          </section>
        </div>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Reported Symptoms</h3>
          <div className="grid grid-cols-1 gap-3">
            {report.symptoms.map((symptom, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="font-medium text-gray-800">{symptom.name}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">{symptom.duration}</span>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    symptom.severity === 'mild' ? 'bg-green-100 text-green-700' :
                    symptom.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {symptom.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {report.additionalDetails.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Info className="text-blue-600" size={20} />
              Additional Details
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {report.additionalDetails.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2 mb-2">
            <ArrowRight className="text-blue-600" size={20} />
            Recommended Follow-up
          </h3>
          <p className="text-blue-800">
            {report.followUp}
          </p>
        </section>
        
      </div>
    </div>
  );
};
