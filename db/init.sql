-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  about_me TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Experience Table
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Project Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Skill Table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  fk_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Interview Type Enum
CREATE TYPE interview_type AS ENUM ('PERSONAL', 'CUSTOM');

-- Interview Table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type interview_type NOT NULL,
  questions TEXT[] NOT NULL,
  skills TEXT[] DEFAULT '{}',
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Details Table
CREATE TABLE interview_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_interview_id UUID UNIQUE NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  video TEXT NOT NULL
);

-- Feedback Label Enum
CREATE TYPE feedback_label AS ENUM ('GOOD', 'NEEDS_IMPROVEMENT');

-- Feedback Table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_interview_details_id UUID NOT NULL REFERENCES interview_details(id) ON DELETE CASCADE,
  label feedback_label NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  feedback TEXT NOT NULL,
  suggesstion_for_improvement TEXT NOT NULL
);

-- Summary Table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fk_interview_details_id UUID UNIQUE NOT NULL REFERENCES interview_details(id) ON DELETE CASCADE,
  relevant_responses TEXT NOT NULL,
  clarity_and_structure TEXT NOT NULL,
  professional_language TEXT NOT NULL,
  initial_ideas TEXT NOT NULL,
  additional_notable_aspects TEXT NOT NULL,
  score INTEGER NOT NULL
);