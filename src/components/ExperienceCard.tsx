import { Briefcase, Building, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Experience } from "@/lib/types";

export default function ExperienceCard({
  experience,
}: {
  experience: Experience[];
}) {
  if (experience.length === 0) return null;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Briefcase className="text-blue-400" size={22} />
          Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {experience.map((exp, i) => (
            <li key={i}>
              <p className="font-semibold text-lg text-gray-100">{exp.role}</p>
              <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                <span className="flex items-center gap-1.5">
                  <Building size={14} /> {exp.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> {exp.duration}
                </span>
              </div>
              {exp.description && (
                <p className="text-sm text-gray-400 mt-2">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {exp.achievements.map((a, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-blue-400 mt-1">&#8226;</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
