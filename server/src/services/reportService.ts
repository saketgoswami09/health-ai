import type { ConversationMessage, HealthReport, HealthSymptom, ReportRequest } from "../types";
import { logger } from "../utils/logger";

const SYMPTOMS = [
  "headache", "fever", "cough", "cold", "sore throat", "fatigue", "tiredness",
  "nausea", "vomiting", "dizziness", "chest pain", "stomach pain", "abdominal pain",
  "back pain", "body ache", "rash", "diarrhea", "shortness of breath", "breathlessness",
];

const RED_FLAGS = ["chest pain", "shortness of breath", "breathlessness", "fainting", "unconscious", "severe bleeding"];

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function firstMatch(text: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[0]) return normalize(match[0]);
  }
  return undefined;
}

function extractDuration(text: string): string {
  return firstMatch(text, [
    /(?:for|since)\s+(?:the\s+)?(?:last\s+)?\d+\s+(?:minutes?|hours?|days?|weeks?|months?|years?)/i,
    /(?:for|since)\s+(?:a|an|one|two|three|four|five|few|couple of)\s+(?:minutes?|hours?|days?|weeks?|months?|years?)/i,
    /(?:since\s+)?(?:yesterday|today|last night|this morning)/i,
  ]) ?? "Not discussed";
}

function extractSeverity(text: string): HealthSymptom["severity"] {
  if (/severe|worst|unbearable|very bad|\b(?:8|9|10)\/10\b/i.test(text)) return "severe";
  if (/moderate|medium|\b(?:4|5|6|7)\/10\b/i.test(text)) return "moderate";
  if (/mild|slight|little|minor|\b(?:1|2|3)\/10\b/i.test(text)) return "mild";
  return "not discussed";
}

function extractSymptoms(text: string, severity: HealthSymptom["severity"], duration: string): HealthSymptom[] {
  const found = SYMPTOMS.filter((symptom) => new RegExp(`\\b${symptom.replace(" ", "\\s+")}\\b`, "i").test(text));
  return [...new Set(found)].map((name) => ({
    name,
    severity,
    duration,
  }));
}

function extractMainConcern(userMessages: ConversationMessage[], symptoms: HealthSymptom[]): string {
  if (symptoms[0]) return symptoms[0].name;

  const candidate = userMessages
    .map((message) => normalize(message.content))
    .find((message) => message.split(" ").length >= 3);

  return candidate ? candidate.slice(0, 180) : "Not discussed";
}

export class ReportService {
  /**
   * Builds a conservative, structured report from the completed voice transcript.
   * It never fills missing clinical information with guesses.
   */
  async createReport(request: ReportRequest): Promise<HealthReport> {
    const userMessages = request.conversationData.filter(
      (message) => message.role === "user" && normalize(message.content).length > 0,
    );
    const userText = userMessages.map((message) => normalize(message.content)).join(" ");

    logger.info("Creating health report", {
      sessionId: request.sessionId,
      userMessageCount: userMessages.length,
    });

    if (!userText) {
      return {
        mainConcern: "Not discussed",
        symptoms: [],
        duration: "Not discussed",
        severity: "Not discussed",
        additionalDetails: ["The call ended before the user provided health information."],
        followUp: "No assessment can be made from this incomplete call. Please start a new call if you need to share a concern.",
      };
    }

    const duration = extractDuration(userText);
    const extractedSeverity = extractSeverity(userText);
    const symptoms = extractSymptoms(userText, extractedSeverity, duration);
    const details = userMessages.map((message) => normalize(message.content)).slice(0, 4);
    const hasRedFlag = RED_FLAGS.some((flag) => userText.toLowerCase().includes(flag));

    return {
      mainConcern: extractMainConcern(userMessages, symptoms),
      symptoms,
      duration,
      severity: extractedSeverity === "not discussed" ? "Not discussed" : extractedSeverity,
      additionalDetails: details.length > 0 ? details : ["Not discussed"],
      followUp: hasRedFlag
        ? "The conversation mentioned a potentially urgent symptom. Seek urgent medical care or contact local emergency services now."
        : userMessages.length < 2
          ? "Limited information was collected. Consider completing another assessment or discussing the concern with a qualified healthcare professional."
          : "If symptoms persist, worsen, or concern you, discuss them with a qualified healthcare professional.",
    };
  }
}

export const reportService = new ReportService();
