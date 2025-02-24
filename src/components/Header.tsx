import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { MainMenu, MenuItem, MobileMenu } from "./MainMenu";
import SearchSidePanel from "./SearchPanel";
import UserAuthNav from "./auth/UserAuthNav";
import { SITE_NAME } from "@/lib/constants";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations("header");
  const payload = await getPayload({
    config: configPromise,
  });

  const mainMenu = await payload.findGlobal({
    slug: "main-menu",
    depth: 2,
  });

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        {t("skipToContent")}
      </a>
      <div className="flex w-full justify-center pt-4 xl:hidden">
        <Link href="/" className="text-xl font-bold">
          {SITE_NAME}
        </Link>
      </div>
      <header className="sticky top-0 z-40 bg-stone-900">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 xl:px-0">
          <div className="xl:hidden">
            <MobileMenu items={mainMenu.items as MenuItem[]} />
          </div>
          <div className="lg:w-[300px]">
            <Link href="/" className="hidden text-xl font-bold xl:block">
              {SITE_NAME}
            </Link>
          </div>
          <div className="hidden lg:flex-1 xl:block">
            <MainMenu items={mainMenu.items as MenuItem[]} />
          </div>
          <div className="flex items-center justify-end gap-8 lg:w-[300px]">
            <UserAuthNav />
            <SearchSidePanel />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
}
