"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Briefcase, Calendar } from "lucide-react";
import { Profile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Experience {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ExperienceFormProps {
  data: Experience[];
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function ExperienceForm({
  data,
  setFormData,
}: ExperienceFormProps) {
  const [experienceList, setExperienceList] = useState<Experience[]>(
    data.length
      ? data
      : [
          {
            company: "",
            position: "",
            description: "",
            start_date: "",
            end_date: "",
          },
        ]
  );

  const handleExperienceChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedExperience = [...experienceList];
    updatedExperience[index][name as keyof Experience] = value;
    setExperienceList(updatedExperience);
  };

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    if (experienceList.length > 1) {
      const updatedExperience = [...experienceList];
      updatedExperience.splice(index, 1);
      setExperienceList(updatedExperience);
    }
  };

  // Update formData when experienceList changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      experiences: experienceList, // Fixed: changed from experience to experiences
    }));
  }, [experienceList, setFormData]);

  return (
    <div className="space-y-6">
      {experienceList.map((experience, index) => (
        <Card
          key={index}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardContent className="p-0">
            <div className="bg-blue-50 p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-blue-900">
                  {experience.company
                    ? experience.company
                    : `Experience ${index + 1}`}
                </h3>
                {experience.position && (
                  <Badge variant="outline" className="ml-2 bg-white">
                    {experience.position}
                  </Badge>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                disabled={experienceList.length === 1}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor={`company-${index}`}
                    className="text-gray-700 font-medium"
                  >
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`company-${index}`}
                    name="company"
                    value={experience.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Enter company name"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`position-${index}`}
                    className="text-gray-700 font-medium"
                  >
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`position-${index}`}
                    name="position"
                    value={experience.position}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Enter your job title"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`description-${index}`}
                  className="text-gray-700 font-medium"
                >
                  Job Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`description-${index}`}
                  name="description"
                  value={experience.description}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Describe your responsibilities and achievements..."
                  className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor={`startDate-${index}`}
                    className="text-gray-700 font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`startDate-${index}`}
                    name="start_date"
                    type="date"
                    value={experience.start_date}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`endDate-${index}`}
                    className="text-gray-700 font-medium flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-blue-500" />
                    End Date
                  </Label>
                  <Input
                    id={`endDate-${index}`}
                    name="end_date"
                    type="date"
                    value={experience.end_date}
                    onChange={(e) => handleExperienceChange(index, e)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Leave empty if you currently work here
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Experience
      </Button>
    </div>
  );
}
