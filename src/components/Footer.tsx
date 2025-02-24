import Container from "./Container";
import Heading from "./Heading";
import { SITE_NAME } from "@/lib/constants";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { FacebookIcon, InstagramIcon } from "./Icons";
const payload = await getPayload({
  config: configPromise,
});

const footerMenu = await payload.findGlobal({
  slug: "footer-menu",
  depth: 2,
});

export function Footer() {
  console.log("footerMenu", footerMenu);
  return (
    <footer className="mt-[150px] bg-stone-800 py-16">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-6">
          {/* Company Info */}
          <div className="text-stone-400 md:col-span-2 md:pr-12">
            <Heading level="h3" size="sm" className="mb-4 text-white">
              {SITE_NAME}
            </Heading>
            <p className="mb-4">
              Welcome to our website! We are dedicated to providing you with the best experience
              possible.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <FacebookIcon />
              </a>
              <a href="#" className="text-stone-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <InstagramIcon />
              </a>
            </div>
          </div>

          <div className="md:col-span-4 md:pl-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {footerMenu?.items?.map((menuItem, index) => (
                <div key={index} className="text-stone-400">
                  <Heading level="h3" size="sm" className="mb-4 text-white">
                    {menuItem.label}
                  </Heading>
                  <ul className="space-y-2">
                    {menuItem.children?.map((child, index) => (
                      <li key={index}>
                        <a href={""} className="hover:text-white">
                          {child?.link?.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Info */}
              <div className="text-stone-400">
                <Heading level="h3" size="sm" className="mb-4 text-white">
                  Contact Info
                </Heading>
                <address className="not-italic">
                  <p>Street 1</p>
                  <p>Helsinki</p>
                  <p className="mt-2">Puhelin: +358 9 1234 5678</p>
                  <p>info@website.com</p>
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="textone mt-12 border-t border-stone-700 pt-8 text-center text-stone-400">
          <p>&copy; {new Date().getFullYear()} Online Store. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
