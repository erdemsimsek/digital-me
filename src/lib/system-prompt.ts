import { getProfile, getTrainingQA, getSystemPromptTemplate } from "./config";
import type { Profile, QAPair } from "./types";

function formatProfileData(profile: Profile): string {
  const sections: string[] = [];

  sections.push(`Name: ${profile.name}`);
  sections.push(`Headline: ${profile.headline}`);
  if (profile.location) sections.push(`Location: ${profile.location}`);

  if (profile.experience.length > 0) {
    sections.push("\nExperience:");
    for (const exp of profile.experience) {
      let entry = `  - ${exp.role} at ${exp.company} (${exp.duration})`;
      if (exp.description) entry += `\n    ${exp.description}`;
      if (exp.achievements?.length) {
        entry += "\n    Achievements: " + exp.achievements.join("; ");
      }
      sections.push(entry);
    }
  }

  if (profile.skills.technical.length > 0) {
    sections.push(`\nTechnical Skills: ${profile.skills.technical.join(", ")}`);
  }
  if (profile.skills.soft?.length) {
    sections.push(`Soft Skills: ${profile.skills.soft.join(", ")}`);
  }

  if (profile.education.length > 0) {
    sections.push("\nEducation:");
    for (const edu of profile.education) {
      sections.push(
        `  - ${edu.degree} from ${edu.institution} (${edu.year})`
      );
    }
  }

  return sections.join("\n");
}

function formatTrainingQA(qa: QAPair[]): string {
  if (qa.length === 0) return "No specific training examples provided.";

  return qa
    .map(
      (pair) =>
        `**Q: ${pair.question}**\nA: ${pair.answer}`
    )
    .join("\n\n");
}

function buildContactRedirect(profile: Profile): string {
  const email = profile.links?.email;
  if (email) {
    const addr = email.replace("mailto:", "");
    return `feel free to reach out at ${addr}`;
  }
  return `feel free to reach out to ${profile.name} directly`;
}

export function buildSystemPrompt(): string {
  const profile = getProfile();
  const qa = getTrainingQA();
  const template = getSystemPromptTemplate();

  const profileData = formatProfileData(profile);
  const trainingQA = formatTrainingQA(qa);

  const contactRedirect = buildContactRedirect(profile);

  const prompt = template
    .replace(/\{\{name\}\}/g, profile.name)
    .replace(/\{\{headline\}\}/g, profile.headline)
    .replace(/\{\{profile_data\}\}/g, profileData)
    .replace(/\{\{training_qa\}\}/g, trainingQA)
    .replace(/\{\{contact_redirect\}\}/g, contactRedirect);

  if (prompt.length > 8000) {
    console.warn(
      `[system-prompt] Assembled prompt is ${prompt.length} characters. Consider reducing training Q&A pairs to save tokens.`
    );
  }

  return prompt;
}
