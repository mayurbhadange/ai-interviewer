import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { UserService } from "./user.service";

/**
 * Service for handling profile-related database operations
 */
export class ProfileService {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new profile for the current user
   * @param data Profile data to create
   * @returns The created profile or error information
   */
  public async createProfile(data: Profile) {
    try {
      const {
        first_name,
        last_name,
        about_me,
        profile_image,
        experiences,
        projects,
        skills,
      } = data;

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return {
          status: false,
          message: "No active session found. Please sign in again.",
          error: "AUTH_ERROR",
        };
      }

      // Get the current auth user ID
      const authUserId = session.user.id;

      // Get the user data from authID
      const userData = await this.userService.getAuthUserWithServiceRole(
        authUserId
      );

      if (!userData.status) {
        throw new Error("Error from authenticated user " + userData.error);
      }

      const userId = userData.data.id;

      // Now use the correct user ID from the users table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          fk_user_id: userId,
          first_name,
          last_name,
          about_me,
          profile_image,
        })
        .select("*")
        .single();

      if (profileError) {
        // Handle specific error types
        if (profileError.code === "23505") {
          return {
            status: false,
            message: "You already have a profile. Try updating instead.",
            error: "DUPLICATE_PROFILE",
          };
        } else if (
          profileError.message.includes("violates row-level security policy")
        ) {
          return {
            status: false,
            message:
              "You don't have permission to create this profile. Please contact support.",
            error: "PERMISSION_DENIED",
          };
        } else {
          return {
            status: false,
            message: `Error creating profile: ${profileError.message}`,
            error: "PROFILE_ERROR",
          };
        }
      }

      const profileId = profile.id;

      try {
        const insertExperiences = experiences.map((exp) => ({
          ...exp,
          fk_profile_id: profileId,
        }));

        if (insertExperiences.length > 0) {
          const { error: experienceError } = await supabase
            .from("experiences")
            .insert(insertExperiences);

          if (experienceError) {
            throw new Error(
              `Error adding experiences: ${experienceError.message}`
            );
          }
        }

        const insertProjects = projects.map((proj) => ({
          ...proj,
          fk_profile_id: profileId,
        }));

        if (insertProjects.length > 0) {
          const { error: projectError } = await supabase
            .from("projects")
            .insert(insertProjects);

          if (projectError) {
            throw new Error(`Error adding projects: ${projectError.message}`);
          }
        }

        const insertSkills = skills.map((skill) => ({
          ...skill,
          fk_profile_id: profileId,
        }));

        if (insertSkills.length > 0) {
          const { error: skillError } = await supabase
            .from("skills")
            .insert(insertSkills);

          if (skillError) {
            throw new Error(`Error adding skills: ${skillError.message}`);
          }
        }

        return {
          status: true,
          message: "Profile saved successfully!",
          data: profile,
        };
      } catch (error: any) {
        // Delete the profile if associated data failed to insert
        await supabase.from("profiles").delete().eq("id", profileId);

        return {
          status: false,
          message: error.message || "Error saving profile details",
          error: "RELATED_DATA_ERROR",
        };
      }
    } catch (error: any) {
      // Catch any unexpected errors
      console.error("Profile creation error:", error);
      return {
        status: false,
        message:
          error.message ||
          "An unexpected error occurred while creating your profile",
        error: "UNKNOWN_ERROR",
      };
    }
  }

  /**
   * Get the profile for the current user
   * @returns The profile with related data
   */
  public async getProfileByUserId() {
    try {
      const supabase = createClient();

      // Get the current user
      const {
        data: { user: current_user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !current_user) {
        throw new Error("Unauthorized");
      }

      // Get user data
      const userData = await this.userService.getAuthUserWithServiceRole(
        current_user.id
      );

      if (!userData.status) {
        throw new Error("Error from authenticated user " + userData.error);
      }

      // Get profile with related data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select(
          `
          *,
          experiences (*),
          projects (*),
          skills (*)
        `
        )
        .eq("fk_user_id", userData.data.id)
        .single();

      if (profileError) {
        throw new Error(`Error fetching profile: ${profileError.message}`);
      }

      return {
        status: true,
        message: "Profile retrieved successfully!",
        data: profile,
      };
    } catch (error: any) {
      console.error("Error in getProfileByUserId:", error);
      return {
        status: false,
        message: `Failed to retrieve profile data: ${error.message}`,
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Update an existing profile and all related data
   * @param data Updated profile data
   * @returns The updated profile with related data
   */
  public async updateProfile(data: Profile) {
    const {
      id,
      first_name,
      last_name,
      about_me,
      experiences,
      projects,
      skills,
    } = data;

    const supabase = createClient();

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name,
          last_name,
          about_me,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (profileError) {
        throw new Error(`Error updating profile: ${profileError.message}`);
      }

      // Delete existing related data
      const { error: deleteExpError } = await supabase
        .from("experiences")
        .delete()
        .eq("fk_profile_id", id);

      const { error: deleteProjError } = await supabase
        .from("projects")
        .delete()
        .eq("fk_profile_id", id);

      const { error: deleteSkillError } = await supabase
        .from("skills")
        .delete()
        .eq("fk_profile_id", id);

      if (deleteExpError || deleteProjError || deleteSkillError) {
        throw new Error("Error deleting existing data");
      }

      // Insert new experiences
      if (experiences && experiences.length > 0) {
        const { error: expError } = await supabase.from("experiences").insert(
          experiences.map((exp) => ({
            ...exp,
            fk_profile_id: id,
          }))
        );

        if (expError) {
          throw new Error(`Error updating experiences: ${expError.message}`);
        }
      }

      // Insert new projects
      if (projects && projects.length > 0) {
        const { error: projError } = await supabase.from("projects").insert(
          projects.map((proj) => ({
            ...proj,
            fk_profile_id: id,
          }))
        );

        if (projError) {
          throw new Error(`Error updating projects: ${projError.message}`);
        }
      }

      // Insert new skills
      if (skills && skills.length > 0) {
        const { error: skillError } = await supabase.from("skills").insert(
          skills.map((skill) => ({
            ...skill,
            fk_profile_id: id,
          }))
        );

        if (skillError) {
          throw new Error(`Error updating skills: ${skillError.message}`);
        }
      }

      // Fetch and return updated profile with all related data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from("profiles")
        .select(
          `
          *,
          experiences (*),
          projects (*),
          skills (*)
        `
        )
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(
          `Error fetching updated profile: ${fetchError.message}`
        );
      }

      return updatedProfile;
    } catch (error: any) {
      console.error("Error in updateProfile:", error);
      return {
        status: false,
        message: `Failed to updating profile data: ${error.message}`,
        error: error.message || "Unknown error",
      };
    }
  }
}
