import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // redirect to create page once supabase changes auth state and user is signed in
        if (event === "SIGNED_IN" && session) router.replace("/create");
      },
    );

    // redirect to create page if the user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/create");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Signing you in...
      </p>
    </div>
  );
}
