export interface Profile {
  id?: string;
  first_name: string;
  last_name: string;
  about_me: string;
  profile_image: string;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
}

export interface Experience {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Project {
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
}

export interface Skill {
  skill_name: string;
}

// Define the User type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

// Define the UserMetadata type
export interface UserMetadata {
  name: string;
  email: string;
  avatar_url: string | null;
}

// Define the UserContext type
export interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}
