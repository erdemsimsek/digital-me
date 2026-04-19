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

          <div className="lg:col-span-3 rounded-xl bg-card/50 border border-white/10 shadow-2xl shadow-blue-900/10 flex flex-col">
            <div className="p-5 border-b border-white/10">
              <h2 className="text-xl font-semibold text-center flex items-center justify-center gap-3 text-white">
                <Bot className="text-blue-400" size={22} />
                Ask My AI Twin
              </h2>
            </div>
            <ChatInterface welcomeMessage={settings.chat.welcomeMessage} />
          </div>
        </div>
      </main>

      <footer className="py-8 mt-12 text-center text-xs border-t border-white/10">
        <p className="text-muted-foreground">
          Powered by{" "}
          <a
            href="https://github.com/erdemsimsek/digital-me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            digital-me
          </a>
        </p>
      </footer>
    </div>
  );
}
