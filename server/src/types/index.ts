export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ConversationSession {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  messages: ConversationMessage[];
  status: 'active' | 'completed' | 'error';
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

export interface ReportRequest {
  sessionId: string;
  conversationData: ConversationMessage[];
}

export interface ReportResponse {
  success: boolean;
  data?: HealthReport;
  message?: string;
}
