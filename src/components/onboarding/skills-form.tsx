"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lightbulb, PlusCircle, X } from "lucide-react";
import { Profile } from "@/types";
import { Card, CardContent } from "../ui/card";

interface SkillsFormProps {
  data: {
    skill_name: string;
  }[];
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function SkillsForm({ data, setFormData }: SkillsFormProps) {
  const [skills, setSkills] = useState(
    data.length ? data : [{ skill_name: "" }]
  );

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index].skill_name = value;
    setSkills(updatedSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { skill_name: "" }]);
  };

  const removeSkill = (index: number) => {
    if (skills.length > 1) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      setSkills(updatedSkills);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      skills: skills,
    }));
  }, [skills, setFormData]);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-blue-50 p-4 flex items-center gap-2 border-b">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-blue-900">Your Skills</h3>
          </div>
          <div className="space-y-4 px-4 py-6">
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor={`skill-${index}`} className="sr-only">
                    Skill {index + 1}
                  </Label>
                  <Input
                    id={`skill-${index}`}
                    value={skill.skill_name}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkill(index)}
                  disabled={skills.length === 1}
                  className="text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addSkill}
            className="mt-2 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Skill
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
