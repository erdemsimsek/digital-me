import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EducationCard({
  education,
}: {
  education: Array<{ institution: string; degree: string; year: string }>;
}) {
  if (education.length === 0) return null;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <GraduationCap className="text-blue-400" size={22} />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {education.map((edu, i) => (
          <div key={i}>
            <p className="font-semibold text-gray-100">{edu.degree}</p>
            <p className="text-muted-foreground text-sm">
              {edu.institution} &middot; {edu.year}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
