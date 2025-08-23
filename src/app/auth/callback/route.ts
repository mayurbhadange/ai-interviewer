import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const mode = searchParams.get("mode");
  const next = searchParams.get("next") ?? "/setup";

  console.log(code);

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Code exchange error:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Successfully authenticated, redirect to the next page
    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error("Exception during code exchange:", err);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}
