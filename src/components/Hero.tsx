import React from "react";
import Image from "next/image";
import { HeroBlock as HeroBlockType } from "@/payload-types";

type HeroProps = {
  block: HeroBlockType;
};

export function Hero({ block }: HeroProps) {
  const { title, description, image, ctaButton } = block;

  return (
    <div className="relative flex h-[80vh] min-h-[600px] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {typeof image === "object" && image.url && (
          <div className="relative h-full w-full">
            <Image src={image.url} alt={image.alt} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mb-8 text-lg leading-relaxed text-stone-100">{description}</p>
        {ctaButton && (
          <a
            href={ctaButton.link}
            className="inline-block rounded-lg bg-stone-700 px-8 py-4 font-medium text-white transition-colors hover:bg-stone-600 active:bg-stone-700"
          >
            {ctaButton.label}
          </a>
        )}
      </div>
    </div>
  );
}
