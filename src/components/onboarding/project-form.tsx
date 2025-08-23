"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, FolderKanban, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Projects {
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface ProjectFormProps {
  data: Projects[];
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function ProjectForm({ data, setFormData }: ProjectFormProps) {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) =>
        i === index ? { ...project, [name]: value } : project
      ),
    }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { project_name: "", description: "", start_date: "", end_date: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    if (data.length > 1) {
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <div className="space-y-6">
      {data.map((project, index) => (
        <Card
          key={index}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardContent className="p-0">
            <div className="bg-blue-50 p-4 flex justify-between items-center border-b">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-blue-900">
                  {project.project_name
                    ? project.project_name
                    : `Project ${index + 1}`}
                </h3>
                {project.start_date && project.end_date && (
                  <Badge variant="outline" className="ml-2 bg-white">
                    {new Date(project.start_date).getFullYear()} -{" "}
                    {new Date(project.end_date).getFullYear()}
                  </Badge>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                disabled={data.length === 1}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor={`name-${index}`}
                  className="text-gray-700 font-medium"
                >
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`name-${index}`}
                  name="project_name"
                  value={project.project_name}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Enter project name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`description-${index}`}
                  className="text-gray-700 font-medium"
                >
                  Project Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id={`description-${index}`}
                  name="description"
                  value={project.description}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="Describe your project, its goals, technologies used, and your role..."
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
                    value={project.start_date}
                    onChange={(e) => handleChange(index, e)}
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
                    value={project.end_date}
                    onChange={(e) => handleChange(index, e)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    Leave empty if this is an ongoing project
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
        onClick={addProject}
        className="w-full border-blue-500 text-blue-500 hover:bg-blue-50 mt-4"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Another Project
      </Button>
    </div>
  );
}
