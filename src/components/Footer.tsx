import Container from "./Container";
import Heading from "./Heading";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { FacebookIcon, InstagramIcon, LinkedInIcon, YoutubeIcon } from "./Icons";
import { parseLink } from "@/lib/parseLink";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const payload = await getPayload({
    config: configPromise,
  });

  const [footerMenu, footer] = await Promise.all([
    payload.findGlobal({
      slug: "footer-menu",
      depth: 0,
    }),
    payload.findGlobal({
      slug: "footer",
    }),
  ]);

  const t = await getTranslations();

  return (
    <footer className="mt-[150px] bg-stone-800 py-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-6 xl:gap-24">
          {/* Company Info */}
          <div className="text-stone-400 md:col-span-2">
            {footer.general?.title && (
              <Heading level="h2" size="sm" className="mb-4 text-white">
                {footer.general.title}
              </Heading>
            )}
            {footer.general?.description && <p className="mb-4">{footer.general?.description}</p>}
            <ul className="flex gap-4">
              {footer.general?.social?.facebook && (
                <li>
                  <a
                    href={footer.general.social.facebook}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">Facebook</span>
                    <FacebookIcon />
                  </a>
                </li>
              )}
              {footer.general?.social?.instagram && (
                <li>
                  <a
                    href={footer.general.social.instagram}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">Instagram</span>
                    <InstagramIcon />
                  </a>
                </li>
              )}
              {footer.general?.social?.linkedin && (
                <li>
                  <a
                    href={footer.general.social.linkedin}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <LinkedInIcon />
                  </a>
                </li>
              )}
              {footer.general?.social?.youtube && (
                <li>
                  <a
                    href={footer.general.social.youtube}
                    className="block text-stone-400 hover:text-white"
                  >
                    <span className="sr-only">YouTube</span>
                    <YoutubeIcon />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Footer Menu */}
          <div className="md:col-span-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {footerMenu.items.map((menuItem, index) => (
                <nav
                  key={index}
                  className="text-stone-400"
                  aria-label={`${t("footer.menuLabel")} ${menuItem.label}`}
                >
                  <Heading level="h2" size="sm" className="mb-4 text-white">
                    {menuItem.label}
                  </Heading>
                  <ul className="space-y-2">
                    {menuItem.children?.map((child, index) => {
                      const { linkUrl, linkLabel } = parseLink(child.link);
                      if (linkUrl) {
                        return (
                          <li key={index}>
                            <a href={linkUrl} className="hover:text-white">
                              {linkLabel}
                            </a>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </nav>
              ))}

              {/* Contact Info */}
              <div className="text-stone-400">
                {footer.contact?.title && (
                  <Heading level="h2" size="sm" className="mb-4 text-white">
                    {footer.contact.title}
                  </Heading>
                )}
                {footer.contact && (
                  <address className="not-italic">
                    <div className="mb-2">
                      {footer.contact.address && <p>{footer.contact.address}</p>}
                      {footer.contact.city && (
                        <p>
                          {footer.contact.postalCode} {footer.contact.city}
                        </p>
                      )}
                    </div>
                    {footer.contact.phone && (
                      <p>
                        {t("footer.phone")}: {footer.contact.phone}
                      </p>
                    )}
                    {footer.contact.email && <p>{footer.contact.email}</p>}
                  </address>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="textone mt-12 border-t border-stone-700 pt-8 text-center text-stone-400">
          {footer.copyright && (
            <p>
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
          )}
        </div>
      </Container>
    </footer>
  );
}
