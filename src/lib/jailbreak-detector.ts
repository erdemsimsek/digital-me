import { JailbreakCategory, type JailbreakDetectionResult } from "./types";

const JAILBREAK_PATTERNS: Record<JailbreakCategory, RegExp[]> = {
  [JailbreakCategory.ROLE_REDEFINING]: [
    /ignore[\s\n\t]+(all[\s\n\t]+)?(previous|prior|above)?[\s\S]*?(instructions?|prompts?|constraints?)/gi,
    /disregard[\s\n\t]+(all[\s\n\t]+)?(previous|prior|above)?[\s\S]*?(instructions?|constraints?)/gi,
    /forget[\s\n\t]+(everything|all|your[\s\n\t]*instructions|your[\s\n\t]*constraints)/gi,
    /you[\s\n\t]+(are|'re)[\s\n\t]+now[\s\n\t]+(a|an)[\s\n\t]+/gi,
    /pretend[\s\n\t]+you(\s+|'re\s+|'re)/gi,
    /pretend[\s\n\t]+to[\s\n\t]+be/gi,
    /act[\s\n\t]+as[\s\S]*?(if|you)/gi,
    /roleplay[\s\n\t]+as/gi,
    /imagine[\s\n\t]+you[\s\n\t]+(are|'re)/gi,
  ],
  [JailbreakCategory.SCOPE_SHIFTING]: [
    /this\s+is\s+(actually|really)\s+about\s+the\s+candidate/gi,
    /it\s+(will|'ll)\s+help\s+(me\s+)?understand\s+the\s+candidate/gi,
    /i\s+need\s+this\s+to\s+evaluate/gi,
  ],
  [JailbreakCategory.AUTHORITY_OVERRIDE]: [
    /the\s+(system\s+)?admin(istrator)?\s+(said|told|says)/gi,
    /i\s+have\s+(special\s+)?permission/gi,
    /in\s+(test|current)\s+(mode|environment|context)/gi,
    /this\s+is\s+allowed\s+in\s+the\s+(current|test)\s+(environment|mode)/gi,
  ],
  [JailbreakCategory.TECHNICAL_EXPLOITATION]: [
    /what('s|\s+is)\s+your\s+(system\s+)?prompt/gi,
    /show\s+(me\s+)?your\s+(system\s+)?prompt/gi,
    /show\s+(me\s+)?your\s+(system\s+)?instructions/gi,
    /reveal\s+your\s+(system\s+)?instructions/gi,
    /run\s+this\s+code/gi,
    /execute\s+this/gi,
    /\[INST\]/gi,
    /<<SYS>>/gi,
    /<\|im_start\|>/gi,
  ],
};

const JAILBREAK_RESPONSES: Record<JailbreakCategory, string> = {
  [JailbreakCategory.ROLE_REDEFINING]:
    "I can only answer questions about my professional background, skills, and experience. Please ask about those instead.",
  [JailbreakCategory.SCOPE_SHIFTING]:
    "That topic doesn't appear to be within my professional experience. Please ask about my CV or background instead.",
  [JailbreakCategory.AUTHORITY_OVERRIDE]:
    "I can only answer questions about my professional background, regardless of special permissions or scenarios.",
  [JailbreakCategory.TECHNICAL_EXPLOITATION]:
    "I can't share information about my technical implementation. Please ask about my professional experience instead.",
};

export function detectJailbreakAttempt(
  userQuery: string
): JailbreakDetectionResult {
  if (!userQuery || typeof userQuery !== "string") {
    return { detected: false, confidence: 0, suggestedResponse: "" };
  }

  const severityOrder = [
    JailbreakCategory.TECHNICAL_EXPLOITATION,
    JailbreakCategory.AUTHORITY_OVERRIDE,
    JailbreakCategory.ROLE_REDEFINING,
    JailbreakCategory.SCOPE_SHIFTING,
  ];

  for (const category of severityOrder) {
    const patterns = JAILBREAK_PATTERNS[category];
    for (const pattern of patterns) {
      // Reset lastIndex for global regex
      pattern.lastIndex = 0;
      if (pattern.test(userQuery)) {
        return {
          detected: true,
          category,
          confidence: 85,
          suggestedResponse: JAILBREAK_RESPONSES[category],
        };
      }
    }
  }

  return { detected: false, confidence: 0, suggestedResponse: "" };
}
