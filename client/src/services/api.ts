import type { HealthReport, ReportRequest } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const generateHealthReport = async (data: ReportRequest): Promise<HealthReport> => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to generate report');
  }

  const result = await response.json();
  return result.data;
};
