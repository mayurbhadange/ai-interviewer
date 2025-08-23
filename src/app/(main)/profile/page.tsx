"use client";

import { Mail, Briefcase, Calendar, ExternalLink } from "lucide-react";
import useProfile from "@/hooks/use-profile";
import { useUser } from "@/context/user.context";

// ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { withAuth } from "@/context/auth.context";

const ProfilePage = () => {
  const { loading, profile: userData } = useProfile();
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate years of experience
  const calculateExperienceYears = () => {
    if (!userData?.experiences || userData.experiences.length === 0) return 0;

    let totalMonths = 0;
    userData.experiences.forEach((exp) => {
      const startDate = new Date(exp.start_date);
      const endDate = new Date(exp.end_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      totalMonths += diffMonths;
    });

    return (totalMonths / 12).toFixed(1);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  const currentExperience =
    userData?.experiences[userData?.experiences.length - 1];

  return (
    <main className="container p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-end pb-10">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
          <AvatarImage
            src={userData?.profile_image}
            alt={`${userData?.first_name} ${userData?.last_name}`}
          />
          <AvatarFallback className="bg-blue-100 text-blue-500 text-2xl">
            {userData?.first_name.charAt(0)}
            {userData?.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="ml-4 mb-2 md:mb-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            {userData?.first_name} {userData?.last_name}
          </h2>
          <div className="flex items-center text-blue-700">
            <Briefcase className="h-4 w-4 mr-1" />
            <span>{currentExperience?.position}</span>
            <span className="mx-1">@</span>
            <span className="font-medium">{currentExperience?.company}</span>
          </div>
          <Badge className="bg-blue-50 text-blue-700">
            <Mail className="h-3 w-3 mr-2" />
            <span>{user.email}</span>
          </Badge>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Briefcase className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="text-2xl font-bold">
                {calculateExperienceYears()} years
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Projects</p>
              <p className="text-2xl font-bold">{userData?.projects.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6 flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <div className="font-bold text-lg text-blue-500">S</div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skills</p>
              <p className="text-2xl font-bold">{userData?.skills.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Me */}
      <Card className="mb-8 bg-white border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-blue-700">About Me</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="leading-relaxed">{userData?.about_me}</p>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className="mb-8 bg-white border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-blue-700">
            Professional Experience
          </CardTitle>
          <CardDescription>My career journey</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {userData?.experiences.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-blue-200"
              >
                <div className="absolute left-0 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-blue-500"></div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.position}</h3>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">{exp.company}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="md:ml-auto whitespace-nowrap border-blue-200 text-blue-700"
                  >
                    {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                  </Badge>
                </div>
                <p className="mt-2 text-gray-600">{exp.description}</p>
                {index < userData.experiences.length - 1 && (
                  <Separator className="mt-6 bg-gray-100 hidden" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className="mb-8 bg-white border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-blue-700">Projects</CardTitle>
          <CardDescription>What I&apos;ve built</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {userData?.projects.map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-4 bg-gray-50 border-b border-gray-100">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="text-blue-700">
                      {project.project_name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    {formatDate(project.start_date)} -{" "}
                    {formatDate(project.end_date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <p className="text-gray-600">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="mb-8 bg-white border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50">
          <CardTitle className="text-blue-700">Skills & Expertise</CardTitle>
          <CardDescription>Technologies I work with</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-start items-center gap-2 ">
            {userData?.skills.map((skill, index) => (
              <div key={index} className="space-y-1.5">
                <Badge variant={"outline"} className="font-medium text-sm">
                  {skill.skill_name}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default withAuth(ProfilePage);
