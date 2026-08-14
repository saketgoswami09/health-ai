export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ReportRequest {
  sessionId: string;
  conversationData: ConversationMessage[];
}

export interface HealthSymptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe' | 'not discussed';
  duration: string;
}

export interface HealthReport {
  mainConcern: string;
  symptoms: HealthSymptom[];
  duration: string;
  severity: string;
  additionalDetails: string[];
  followUp: string;
}

export type VoiceCallState = 'idle' | 'connecting' | 'active' | 'completed' | 'error';
