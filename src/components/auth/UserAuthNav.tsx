import { Link } from "@/i18n/routing";
import { UserIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";

export default async function UserAuthNav() {
  const t = await getTranslations("auth");
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth-example/create-article"
        className="group flex items-center gap-2 text-xs font-medium uppercase"
      >
        <UserIcon className="h-5 w-5 group-hover:text-amber-500" />
        <span className="hidden xl:block">{t("user")}</span>
      </Link>
    </div>
  );
}
