"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  if (allowedRoles && session.user?.role) {
    if (!allowedRoles.includes(session.user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
