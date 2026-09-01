import { useEffect } from "react";
import { useRouter } from "next/router";

export default function UserPage() {
  const router = useRouter();
  const { id: username } = router.query;

  useEffect(() => {
    router.replace(`/user/${username}/rankings`);
  }, []);
}
