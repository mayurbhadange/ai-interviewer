"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import PersonalInfoForm from "@/components/onboarding/personal-info-form";
import ProjectForm from "@/components/onboarding/project-form";
import ExperienceForm from "@/components/onboarding/experience-form";
import SkillsForm from "@/components/onboarding/skills-form";
import {
  Briefcase,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  UserCircle,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Profile } from "@/types";
import { ProfileService } from "@/services/profile.service";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { withAuth } from "@/context/auth.context";

const steps = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic information",
    icon: UserCircle,
    slug: "personal",
  },
  {
    id: 2,
    title: "Project",
    description: "Project details",
    icon: Briefcase,
    slug: "project",
  },
  {
    id: 3,
    title: "Experience",
    description: "Work history",
    icon: Building2,
    slug: "experience",
  },
  {
    id: 4,
    title: "Skills",
    description: "Your expertise",
    icon: Lightbulb,
    slug: "skills",
  },
];

const OnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const pageStep = steps.find((step) => step.slug === page);
    setCurrentStep(pageStep?.id || 1);
  }, [page]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Profile>({
    first_name: "",
    last_name: "",
    about_me: "",
    profile_image: "",
    projects: [
      { project_name: "", description: "", start_date: "", end_date: "" },
    ],
    experiences: [
      {
        company: "",
        position: "",
        description: "",
        start_date: "",
        end_date: "",
      },
    ],
    skills: [{ skill_name: "" }],
  });

  const [errors, setErrors] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress percentage
  const progressPercentage = (currentStep / steps.length) * 100;

  const validateFields = () => {
    let errorMsg = "";
    if (
      currentStep === 1 &&
      (!formData.first_name || !formData.last_name || !formData.about_me)
    ) {
      errorMsg = "Please fill in your personal information.";
    } else if (
      currentStep === 2 &&
      formData.projects.some(
        (project) => !project.project_name || !project.description
      )
    ) {
      errorMsg = "Please complete the project details.";
    } else if (
      currentStep === 3 &&
      formData.experiences.some((exp) => !exp.company || !exp.position)
    ) {
      errorMsg = "Please complete your work experience.";
    } else if (
      currentStep === 4 &&
      formData.skills.some((skill) => !skill.skill_name)
    ) {
      errorMsg = "Please add at least one skill.";
    }

    if (errorMsg) {
      setErrors(errorMsg);
      return false;
    }
    setErrors(null);
    return true;
  };

  const handleNext = () => {
    if (!validateFields()) return;
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const newStep = steps.find((step) => step.id === nextStep);
      router.push(`/onboarding?page=${newStep?.slug}`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const newStep = steps.find((step) => step.id === prevStep);
      router.push(`/onboarding?page=${newStep?.slug}`);
    }
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setIsSubmitting(true);
    try {
      const profileService = new ProfileService();
      const result = await profileService.createProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        about_me: formData.about_me,
        profile_image: formData.profile_image,
        experiences: formData.experiences,
        projects: formData.projects,
        skills: formData.skills,
      });

      if (result.status) {
        toast.success("Profile completed successfully!");
        router.push("/complete");
      } else {
        toast.error(result.message);
        if (result.error === "AUTH_ERROR") {
          router.push("/sign-in");
        } else if (result.error === "DUPLICATE_PROFILE") {
          router.push("/profile");
        }
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile progress bar - only visible on small screens */}
      <div className="md:hidden w-full bg-white border-b p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Image
              src="/assets/brand.png"
              alt="logo"
              height={32}
              width={32}
              className="mr-2"
            />
            <h1 className="font-bold text-lg">InterviewPrep</h1>
          </div>
          <span className="text-sm font-medium text-blue-600">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2 bg-gray-100 [&>div]:bg-blue-500"
        />
      </div>

      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:flex md:w-96 bg-white border-r shadow-sm flex-col h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <Image
              src="/assets/brand.png"
              alt="logo"
              height={40}
              width={40}
              className="mr-3"
            />
            <h1 className="font-bold text-xl">InterviewPrep</h1>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Complete Your Profile
            </h2>
            <p className="text-sm text-gray-500">
              Set up your profile to get personalized interview practice
            </p>
            <div className="mt-3 flex items-center">
              <Progress
                value={progressPercentage}
                className="h-2 flex-1 bg-gray-100 [&>div]:bg-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-blue-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          <Stepper
            value={currentStep}
            onValueChange={(value) => {
              // Only allow navigation to completed steps or the current step + 1
              if (value <= currentStep || value === currentStep + 1) {
                const targetStep = steps.find((step) => step.id === value);
                if (targetStep) {
                  router.push(`/onboarding?page=${targetStep.slug}`);
                }
              }
            }}
            orientation="vertical"
            className="mt-6"
          >
            {steps.map((step, index) => (
              <StepperItem key={step.id} step={step.id}>
                <StepperTrigger asChild>
                  <div
                    className={`flex items-start gap-4 cursor-pointer w-full p-2 rounded-md transition-colors ${
                      currentStep === step.id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <StepperIndicator
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white
                      data-[state=completed]:bg-blue-500 data-[state=completed]:text-white mt-0.5"
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </StepperIndicator>
                    <div className="flex flex-col items-start">
                      <StepperTitle className="text-gray-900 font-medium">
                        {step.title}
                      </StepperTitle>
                      <StepperDescription className="text-sm text-gray-500">
                        {step.description}
                      </StepperDescription>
                    </div>
                  </div>
                </StepperTrigger>
                {index < steps.length - 1 && (
                  <StepperSeparator className="ml-3 h-12 group-data-[state=completed]/step:bg-blue-500" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        </div>

        <div className="p-6 border-t">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full flex items-center text-sm border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </div>
      </div>

      {/* Main content */}
      <ScrollArea className="flex-1 w-full h-screen">
        <main className="flex-1 p-4 md:p-8 md:max-w-5xl md:mx-auto w-full">
          {/* Back button - mobile only */}
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="md:hidden mb-4 text-sm text-gray-500 hover:text-gray-700 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>

          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Share your project details"}
              {currentStep === 3 && "What's your work experience?"}
              {currentStep === 4 && "What skills do you have?"}
            </h1>
            <p className="text-blue-600 mt-2 text-sm md:text-base">
              {currentStep === 1 && "Complete your profile to get started"}
              {currentStep === 2 &&
                "Tell us about a significant project you've worked on"}
              {currentStep === 3 && "Share your professional background"}
              {currentStep === 4 && "Add skills to showcase your expertise"}
            </p>
          </div>

          {errors && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white rounded-xl border shadow-sm p-4 md:p-8 mb-6 md:mb-8">
            {currentStep === 1 && (
              <PersonalInfoForm
                first_name={formData.first_name}
                last_name={formData.last_name}
                about_me={formData.about_me}
                profile_image={formData.profile_image}
                setFormData={setFormData}
              />
            )}
            {currentStep === 2 && (
              <ProjectForm data={formData.projects} setFormData={setFormData} />
            )}
            {currentStep === 3 && (
              <ExperienceForm
                data={formData.experiences}
                setFormData={setFormData}
              />
            )}
            {currentStep === 4 && (
              <SkillsForm data={formData.skills} setFormData={setFormData} />
            )}
          </div>

          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 1}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSubmitting ? "Saving..." : "Complete Profile"}
                {!isSubmitting && <CheckCircle className="h-4 w-4 ml-2" />}
              </Button>
            )}
          </div>

          {/* Mobile stepper indicator */}
          <div className="flex justify-center mt-8 md:hidden">
            <div className="flex gap-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`h-2 w-2 rounded-full ${
                    step.id === currentStep
                      ? "bg-blue-500"
                      : step.id < currentStep
                      ? "bg-blue-300"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </main>
      </ScrollArea>
    </div>
  );
};

export default withAuth(OnboardingPage);
