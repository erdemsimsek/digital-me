"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-lg hover:border-indigo-500/20 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Briefcase className="text-indigo-400" size={22} />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-5">
            {experience.map((exp, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              >
                <p className="font-semibold text-lg text-gray-100">
                  {exp.role}
                </p>
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1.5">
                    <Building size={14} /> {exp.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {exp.duration}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-400 mt-2">
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((a, j) => (
                      <li
                        key={j}
                        className="text-sm text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-indigo-400 mt-1">&#8226;</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
