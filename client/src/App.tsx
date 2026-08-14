import { useState } from "react";

import { Home } from "./pages/Home";
import { ReportPage } from "./pages/Report";
import { LoadingState } from "./components/LoadingState";
import { AppHeader } from "./components/AppHeader";

import { useVoiceAssessment } from "./hooks/useVoiceAssessment";

function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "generating" | "report"
  >("home");

  const {
    callState,
    isAiSpeaking,
    isAiThinking,
    messages,
    report,
    startCall,
    endCall,
    resetAssessment,
  } = useVoiceAssessment({
    onGeneratingReport: () => {
      setCurrentView("generating");
    },

    onReportReady: () => {
      setCurrentView("report");
    },

    onReset: () => {
      setCurrentView("home");
    },
  });

  const handleNewAssessment = () => {
    resetAssessment();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <AppHeader onHome={handleNewAssessment} />

      <main>
        {currentView === "home" && (
          <Home
            state={callState}
            isAiSpeaking={isAiSpeaking}
            isAiThinking={isAiThinking}
            messages={messages}
            onStartCall={startCall}
            onEndCall={endCall}
          />
        )}

        {currentView === "generating" && (
          <div className="flex min-h-[70vh] items-center justify-center">
            <LoadingState
              message="
                Analyzing your conversation
                and preparing your health report...
              "
            />
          </div>
        )}

        {currentView === "report" && report && (
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