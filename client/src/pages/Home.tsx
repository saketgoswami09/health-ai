import React from 'react';

export const Home: React.FC<{ onStartCall: () => void }> = ({ onStartCall }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 border border-blue-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
        AI Health Assistant
      </h1>
      <p className="text-xl text-gray-600 mb-12 max-w-2xl">
        Have a natural conversation with our advanced AI to assess your symptoms and get an immediate structured health report.
      </p>
      
      <button
        onClick={onStartCall}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center gap-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        Start Assessment Call
      </button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">1. Talk Naturally</h3>
          <p className="text-gray-600 text-sm">Speak just like you would to a human doctor. Our AI listens and asks relevant follow-up questions.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">2. Real-time Analysis</h3>
          <p className="text-gray-600 text-sm">Your symptoms are analyzed in real-time against a comprehensive medical database.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">3. Instant Report</h3>
          <p className="text-gray-600 text-sm">Get a structured, easy-to-read health report immediately after your call ends.</p>
        </div>
      </div>
    </div>
  );
};
