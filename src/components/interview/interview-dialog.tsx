"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewService } from "@/services/interview.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type InterviewType = "PERSONAL" | "CUSTOM";

export default function InterviewDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewType, setInterviewType] = useState<InterviewType>("PERSONAL");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: InterviewType) => {
    setInterviewType(value as InterviewType);
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSkill(e.target.value);
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() !== "") {
      setSkills((prev) => [...prev, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const interviewService = new InterviewService();
      const result = await interviewService.saveInterviewToSupabase({
        name: formData.name,
        type: interviewType,
        skills,
        questions: [],
        jobDescription: formData.description,
      });

      if (!result.status) {
        throw new Error("Error saving interview ", result.message as any);
      }
      // Reset form
      setFormData({ name: "", description: "" });
      setSkills([]);
      setCurrentSkill("");
      setInterviewType("PERSONAL");

      toast.success(result.message);
      router.push(`/interview/start/${result?.data?.id}`);
    } catch (err: any) {
      console.log("Error: ", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          Create a new Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Interview</DialogTitle>
            <DialogDescription>
              Set up a new interview session. Click proceed when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={interviewType} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL">PERSONAL</SelectItem>
                  <SelectItem value="CUSTOM">CUSTOM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {interviewType === "CUSTOM" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={currentSkill}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Add a skill and press Enter"
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add
                    </Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {interviewType === "CUSTOM" && skills.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      At least one skill is required for custom interviews
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required={interviewType === "CUSTOM"}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={
                isSubmitting ||
                (interviewType === "CUSTOM" && skills.length === 0)
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>Proceed</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
