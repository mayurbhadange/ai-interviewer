"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { createClient } from "@/utils/supabase/client";
import { User, UserContextType, UserMetadata } from "@/types";

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const session = await supabase.auth.getUser();
      const { data: userData, error } = session;

      if (error) {
        throw new Error(`Error fetching session: ${error.message}`);
      }

      if (!userData.user) {
        setUser({ id: "", name: "", email: "", avatar: null });
        setIsLoading(false);
        return;
      }

      const { id } = userData.user;
      const { name, email, avatar_url } = userData.user
        ?.user_metadata as UserMetadata;

      setUser({
        id,
        name,
        email,
        avatar: avatar_url,
      });
    } catch (err: any) {
      console.error("Error fetching user:", err);
      setError(err.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    error,
    refreshUser: fetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Create a custom hook for using the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
