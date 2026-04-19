import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SkillsCard({
  skills,
}: {
  skills: { technical: string[]; soft?: string[] };
}) {
  const hasSkills =
    skills.technical.length > 0 || (skills.soft && skills.soft.length > 0);
  if (!hasSkills) return null;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <Star className="text-blue-400" size={22} />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.technical.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-blue-900/50 text-blue-300 hover:bg-blue-900/70"
            >
              {skill}
            </Badge>
          ))}
          {skills.soft?.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="bg-gray-700/80 text-gray-300 hover:bg-gray-700"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
