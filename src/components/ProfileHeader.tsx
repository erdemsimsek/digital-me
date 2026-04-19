import { MapPin } from "lucide-react";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
        {profile.name}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-3xl mx-auto">
        {profile.headline}
      </p>
      {profile.location && (
        <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1.5">
          <MapPin size={14} />
          {profile.location}
        </p>
      )}
      {profile.links && Object.keys(profile.links).length > 0 && (
        <div className="flex justify-center gap-4 mt-4">
          {Object.entries(profile.links).map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors capitalize"
            >
              {name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
