"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";

const locales = {
  fi: "FI",
  en: "EN",
} as const;

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const { locale } = useParams();

  return (
    <div className="flex items-center gap-4">
      {Object.entries(locales).map(([key, label]) => {
        const isActive = locale === key;
        return (
          <Link
            key={key}
            href={pathname}
            locale={key}
            className={`text-sm ${
              isActive ? "font-medium text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
