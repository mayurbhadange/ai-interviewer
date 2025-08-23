import { Profile } from "@/types";
import { useEffect, useState } from "react";
import { ProfileService } from "@/services/profile.service";

const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const profileService = new ProfileService();
      const result = await profileService.getProfileByUserId();
      if (!result.status) {
        throw new Error(result.message || "Error in retrieving profile");
      }

      setProfile(result.data);
    } catch (err) {
      console.error("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { loading, profile, fetchProfile };
};

export default useProfile;
