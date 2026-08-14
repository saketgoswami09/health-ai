export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface HealthSymptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
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
