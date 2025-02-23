import React from "react";
import Image from "next/image";
import { HeroBlock as HeroBlockType } from "@/payload-types";
import Button from "@/components/Button";
type HeroProps = {
  block: HeroBlockType;
};

export function Hero({ block }: HeroProps) {
  const { title, description, image, ctaButton } = block;

  return (
    <div className="relative mt-12 flex w-full items-center justify-center overflow-hidden rounded-2xl py-24">
      <div className="absolute inset-0">
        {typeof image === "object" && image.url && (
          <div className="relative h-full w-full">
            <Image src={image.url} alt={image.alt} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mb-8 text-lg leading-relaxed text-stone-100">{description}</p>
        <div className="flex justify-center">
          {ctaButton && <Button href={ctaButton.link}>{ctaButton.label}</Button>}
        </div>
      </div>
    </div>
  );
}
