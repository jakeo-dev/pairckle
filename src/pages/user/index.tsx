import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchCurrentProfile } from "@/db";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectToCurrentUser() {
      let username = "guest";

      const result = await fetchCurrentProfile();

      if (result?.profileData) {
        username = result?.profileData.username;
      }
      router.replace(`/user/${username}/rankings`);
    }

    redirectToCurrentUser();
  }, []);
}
