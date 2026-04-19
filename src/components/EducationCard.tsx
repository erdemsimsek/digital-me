"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EducationCard({
  education,
}: {
  education: Array<{ institution: string; degree: string; year: string }>;
}) {
  if (education.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-lg hover:border-indigo-500/20 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <GraduationCap className="text-indigo-400" size={22} />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            >
              <p className="font-semibold text-gray-100">{edu.degree}</p>
              <p className="text-gray-500 text-sm">
                {edu.institution} &middot; {edu.year}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
