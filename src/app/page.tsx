import { Bot } from "lucide-react";
import ProfileHeader from "@/components/ProfileHeader";
import ExperienceCard from "@/components/ExperienceCard";
import SkillsCard from "@/components/SkillsCard";
import EducationCard from "@/components/EducationCard";
import ChatInterface from "@/components/ChatInterface";
import profile from "../../config/profile.json";
import settings from "../../config/settings.json";
import type { Profile } from "@/lib/types";

export default function Home() {
  const profileData = profile as Profile;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto max-w-7xl p-4 md:p-8">
        <ProfileHeader profile={profileData} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ExperienceCard experience={profileData.experience} />
            <SkillsCard skills={profileData.skills} />
            <EducationCard education={profileData.education} />
          </div>

          <div className="lg:col-span-3 lg:sticky lg:top-8 lg:self-start rounded-2xl bg-white/[0.02] border border-white/[0.08] shadow-[0_0_30px_-5px_rgba(99,102,241,0.06)] flex flex-col">
            <div className="p-5 border-b border-white/[0.08]">
              <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-3 text-white">
                <Bot className="text-indigo-400" size={22} />
                Ask My AI Twin
              </h2>
            </div>
            <ChatInterface welcomeMessage={settings.chat.welcomeMessage} />
          </div>
        </div>
      </main>

      <footer className="py-8 mt-12 text-center text-xs border-t border-white/[0.06]">
        <p className="text-gray-600">
          Powered by{" "}
          <a
            href="https://github.com/erdemsimsek/digital-me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400/70 hover:text-indigo-400 transition-colors"
          >
            digital-me
          </a>
        </p>
      </footer>
    </div>
  );
}
