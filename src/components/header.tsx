import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

export default function Header() {
  const t = useTranslations();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 xl:px-0">
        <Link href="/" className="text-xl font-bold">
          {t("meta.title")}
        </Link>
        <div className="flex items-center gap-8">
          <nav>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-gray-600">
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-gray-600">
                  {t("navigation.articles")}
                </Link>
              </li>
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
