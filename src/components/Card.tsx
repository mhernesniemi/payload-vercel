import { Link } from "@/i18n/routing";
import { Media } from "@/payload-types";
import Image from "next/image";
import Heading from "./Heading";

export type CardProps = {
  image?: Media;
  title: string | null | undefined;
  text?: string | null;
  href: string | null;
};

export default function Card({ image, title, text, href }: CardProps) {
  if (!href || !title) return null;

  return (
    <li className="relative overflow-hidden rounded-lg bg-stone-800 transition-all duration-300 hover:ring-1 hover:ring-amber-500">
      {image?.url && (
        <div className="relative h-64 w-full">
          <Image src={image.url} alt={image.alt || title || ""} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <Link href={href} className="block">
          <span className="absolute inset-x-0 inset-y-0 z-10"></span>
          <Heading level="h2" size="sm" className="mb-2">
            {title}
          </Heading>
        </Link>
        {text && <p className="mb-4 line-clamp-2 text-stone-300">{text}</p>}
      </div>
    </li>
  );
}
