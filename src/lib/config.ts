import fs from "fs";
import path from "path";
import type { Profile, QAPair, Settings } from "./types";

const configDir = path.join(process.cwd(), "config");

let cachedProfile: Profile | null = null;
let cachedSettings: Settings | null = null;
let cachedTrainingQA: QAPair[] | null = null;
let cachedSystemPrompt: string | null = null;

export function getProfile(): Profile {
  if (cachedProfile) return cachedProfile;
  const raw = fs.readFileSync(path.join(configDir, "profile.json"), "utf-8");
  cachedProfile = JSON.parse(raw) as Profile;
  return cachedProfile;
}

export function getSettings(): Settings {
  if (cachedSettings) return cachedSettings;
  const raw = fs.readFileSync(path.join(configDir, "settings.json"), "utf-8");
  cachedSettings = JSON.parse(raw) as Settings;
  return cachedSettings;
}

export function getTrainingQA(): QAPair[] {
  if (cachedTrainingQA) return cachedTrainingQA;
  const raw = fs.readFileSync(
    path.join(configDir, "training-qa.json"),
    "utf-8"
  );
  cachedTrainingQA = JSON.parse(raw) as QAPair[];
  return cachedTrainingQA;
}

export function getSystemPromptTemplate(): string {
  if (cachedSystemPrompt) return cachedSystemPrompt;
  cachedSystemPrompt = fs.readFileSync(
    path.join(configDir, "system-prompt.md"),
    "utf-8"
  );
  return cachedSystemPrompt;
}
