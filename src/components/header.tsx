import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "./LanguageSwitcher";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { MainMenu, MenuItem, MobileMenu } from "./MainMenu";

export default async function Header() {
  const t = await getTranslations();
  const payload = await getPayload({
    config: configPromise,
  });

  const mainMenu = await payload.findGlobal({
    slug: "main-menu",
  });

  return (
    <header>
      <div className="container mx-auto grid grid-cols-3 items-center justify-between px-4 py-4 xl:px-0">
        <MobileMenu items={mainMenu.items as MenuItem[]} />
        <Link href="/" className="text-xl font-bold">
          {t("meta.title")}
        </Link>
        <MainMenu items={mainMenu.items as MenuItem[]} />
        <div className="col-span-1 flex items-center justify-end">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
