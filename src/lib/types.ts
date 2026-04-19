export interface Profile {
  name: string;
  headline: string;
  avatar?: string;
  location?: string;
  experience: Experience[];
  skills: {
    technical: string[];
    soft?: string[];
  };
  education: Education[];
  links?: Record<string, string>;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description?: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface QAPair {
  question: string;
  answer: string;
}

export interface Settings {
  site: {
    title: string;
    description: string;
  };
  ai: {
    model: string;
    temperature: number;
    maxTokens: number;
    maxRetries: number;
  };
  rateLimit: {
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
  };
  chat: {
    maxMessageLength: number;
    maxHistoryMessages: number;
    welcomeMessage: string;
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history: Message[];
}

export interface ChatResponse {
  answer: string;
  tokensUsed?: {
    input: number;
    output: number;
  };
}

export enum JailbreakCategory {
  ROLE_REDEFINING = "ROLE_REDEFINING",
  SCOPE_SHIFTING = "SCOPE_SHIFTING",
  AUTHORITY_OVERRIDE = "AUTHORITY_OVERRIDE",
  TECHNICAL_EXPLOITATION = "TECHNICAL_EXPLOITATION",
}

export interface JailbreakDetectionResult {
  detected: boolean;
  category?: JailbreakCategory;
  confidence: number;
  suggestedResponse: string;
  details?: string;
}
