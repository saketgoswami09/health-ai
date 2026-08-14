import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-xl border border-red-100 max-w-lg mx-auto">
    <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
    <p className="text-red-600 text-center">{message}</p>
  </div>
);
