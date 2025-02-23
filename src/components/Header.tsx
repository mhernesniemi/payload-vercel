import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { MainMenu, MenuItem, MobileMenu } from "./MainMenu";
import SearchSidePanel from "./SearchPanel";
import UserAuthNav from "./auth/UserAuthNav";
import { SITE_NAME } from "@/lib/constants";

export default async function Header() {
  const payload = await getPayload({
    config: configPromise,
  });

  const mainMenu = await payload.findGlobal({
    slug: "main-menu",
    depth: 2,
  });

  return (
    <header className="sticky top-0 z-40 bg-stone-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 xl:px-0">
        <div className="lg:hidden">
          <MobileMenu items={mainMenu.items as MenuItem[]} />
        </div>
        <div className="lg:w-[300px]">
          <Link href="/" className="text-xl font-bold">
            {SITE_NAME}
          </Link>
        </div>
        <div className="hidden lg:block lg:flex-1">
          <MainMenu items={mainMenu.items as MenuItem[]} />
        </div>
        <div className="flex items-center justify-end gap-8 lg:w-[300px]">
          <UserAuthNav />
          <SearchSidePanel />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
