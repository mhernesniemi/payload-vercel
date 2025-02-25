"use client";

import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import Button from "../Button";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleLogout} size="sm" disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
