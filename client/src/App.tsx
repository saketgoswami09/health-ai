import React, { useState } from 'react';
import { Home } from './pages/Home';
import { VoiceCall } from './pages/VoiceCall';
import { ReportPage } from './pages/Report';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import type { VoiceCallState, ConversationMessage, HealthReport } from './types';

// Mock API Call (To be replaced with actual fetch to backend)
const generateMockReport = async (): Promise<HealthReport> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        mainConcern: "General Checkup",
        symptoms: [
          { name: "Headache", severity: "mild", duration: "2 days" }
        ],
        duration: "10 minutes",
        severity: "low",
        additionalDetails: ["Patient reported feeling tired."],
        followUp: "Rest and drink fluids."
      });
    }, 2000);
  });
};

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'call' | 'generating' | 'report'>('home');
  const [callState, setCallState] = useState<VoiceCallState>('idle');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [report, setReport] = useState<HealthReport | null>(null);

  const handleStartCall = () => {
    setCurrentView('call');
    setCallState('connecting');

    // Simulate connection delay
    setTimeout(() => {
      setCallState('active');
      setIsAiThinking(true);

      // Simulate thinking delay
      setTimeout(() => {
        setIsAiThinking(false);
        setIsAiSpeaking(true);

        // Simulate AI speaking
        setTimeout(() => {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: 'Hello, I am your AI Health Assistant. What brings you here today?',
            timestamp: new Date()
          }]);
          setIsAiSpeaking(false);
        }, 3000);
      }, 2000); // 2 second think time

    }, 1500);
  };

  const handleEndCall = async () => {
    setCallState('completed');
    setCurrentView('generating');

    try {
      // TODO: Replace with actual backend call
      const generatedReport = await generateMockReport();
      setReport(generatedReport);
      setCurrentView('report');
    } catch (error) {
      console.error(error);
      setCurrentView('home'); // Reset on error for now
    }
  };

  const handleNewAssessment = () => {
    setCallState('idle');
    setMessages([]);
    setReport(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleNewAssessment}
          >
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Health AI</span>
          </div>
        </div>
      </header>

      <main className="py-8">
        {currentView === 'home' && <Home onStartCall={handleStartCall} />}

        {currentView === 'call' && (
          <VoiceCall
            state={callState}
            isAiSpeaking={isAiSpeaking}
            isAiThinking={isAiThinking}
            messages={messages}
            onEndCall={handleEndCall}
          />
        )}

        {currentView === 'generating' && (
          <div className="min-h-[50vh] flex items-center justify-center">
            <LoadingState message="Analyzing conversation and generating health report..." />
          </div>
        )}

        {currentView === 'report' && report && (
          <ReportPage
            report={report}
            onNewAssessment={handleNewAssessment}
          />
        )}
      </main>
    </div>
  );
}

export default App;
