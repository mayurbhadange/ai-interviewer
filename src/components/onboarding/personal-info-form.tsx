"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Upload, User, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonalInfoFormProps {
  first_name: string;
  last_name: string;
  about_me: string;
  profile_image?: string;
  setFormData: React.Dispatch<React.SetStateAction<Profile>>;
}

export default function PersonalInfoForm({
  first_name,
  last_name,
  about_me,
  profile_image,
  setFormData,
}: PersonalInfoFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    profile_image || null
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setUploadError(null);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `public/${fileName}`; // Use a public folder

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error details:", error);
        setUploadError(`${error.message}`);
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);

      // Update form data with the image URL
      const imageUrl = urlData.publicUrl;
      setImagePreview(imageUrl);
      setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(
        error?.message || "Error uploading image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, profile_image: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700 font-medium">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            name="first_name"
            value={first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700 font-medium">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            name="last_name"
            value={last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-blue-50 p-4 flex items-center gap-2 border-b">
            <User className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-blue-900">Profile Image</h3>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {imagePreview ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-300">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <User className="h-10 w-10" />
                </div>
              )}

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="profileImage"
                    className="text-gray-700 font-medium"
                  >
                    Upload Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        disabled={uploading}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Upload className="h-4 w-4" />
                      </div>
                    </div>
                    {uploading && (
                      <div className="flex items-center text-blue-600 text-sm animate-pulse">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mr-1"></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-bounce delay-100"></div>
                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                        <span className="ml-2">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a professional photo. JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>

                {uploadError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="aboutMe" className="text-gray-700 font-medium">
          About Me <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="aboutMe"
          name="about_me"
          value={about_me}
          onChange={handleChange}
          placeholder="Tell us about yourself, your background, interests, and career goals..."
          className="min-h-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500">
          This information will help us personalize your interview practice
          experience.
        </p>
      </div>
    </div>
  );
}
