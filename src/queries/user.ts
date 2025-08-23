"use server";

import { createServiceClient } from "@/utils/supabase/client";

export const getUser = async () => {
  const supabase = await createServiceClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return user;
};