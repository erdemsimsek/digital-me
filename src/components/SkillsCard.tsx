"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-lg hover:border-indigo-500/20 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Star className="text-indigo-400" size={22} />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.technical.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.03 }}
                whileHover={{ scale: 1.08 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
            {skills.soft?.map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + (skills.technical.length + i) * 0.03,
                }}
                whileHover={{ scale: 1.08 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
