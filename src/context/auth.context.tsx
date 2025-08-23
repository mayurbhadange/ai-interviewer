// src/context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathName = usePathname();

  // Paths that don't require authentication
  const publicPaths = ["/sign-in", "/sign-up"];

  useEffect(() => {
    const supabase = createClient();

    // Set the initial session and user
    const initializeAuth = async () => {
      setLoading(true);

      // Get current session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error);
      }

      if (session) {
        setSession(session);
        setUser(session.user);
      }

      const currentPath = pathName;

      // Redirect logic
      if (!session && !publicPaths.includes(currentPath)) {
        // Not authenticated and on protected route, redirect to sign-in
        router.push("/sign-in");
      } else if (session && publicPaths.includes(currentPath)) {
        // Authenticated but on a public route, redirect to dashboard
        router.push("/dashboard");
      }

      setLoading(false);
    };

    initializeAuth();

    // Set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === "SIGNED_OUT") {
        router.push("/sign-in");
      } else if (
        event === "SIGNED_IN" &&
        publicPaths.includes(pathName)
      ) {
        router.push("/dashboard");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC to protect routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const WithAuth: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/sign-in");
      }
    }, [user, loading, router]);

    if (loading) {
      return;
    }

    if (!user) {
      return null; // Don't render anything while redirecting
    }

    return <Component {...props} />;
  };

  return WithAuth;
}
