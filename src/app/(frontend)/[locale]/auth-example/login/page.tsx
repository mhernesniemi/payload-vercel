"use client";

import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { GoogleIcon } from "@/components/Icons";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error(t("errors.invalidCredentials"));
        return;
      }

      const callbackUrl = searchParams.get("from") || "/en/auth-example/create-article";
      router.push(callbackUrl);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("errors.loginError"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: searchParams.get("from") || "/",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-stone-800 p-8 shadow-lg">
        <div>
          <Heading level="h2" size="lg" className="mt-6 text-center">
            {t("signIn")}
          </Heading>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-lg border px-3 py-2 sm:text-sm"
                placeholder={t("email")}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t("password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-lg border px-3 py-2 sm:text-sm"
                placeholder={t("password")}
              />
            </div>
          </div>

          <div>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? t("loading") : t("signIn")}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-stone-800 px-2">{t("continueWith")}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={handleGoogleSignIn} fullWidth>
              <GoogleIcon className="mr-2" />
              {t("continueWithGoogle")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
