import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values using clsx and tailwind-merge
 * @param inputs - The class values to merge
 * @returns The merged class values
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a long format
 * @param date - The date to format
 * @param locale - The locale to use
 * @returns The formatted date
 */
export function formatDateLong(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date to a short format
 * @param date - The date to format
 * @param locale - The locale to use
 * @returns The formatted date
 */
export function formatDateShort(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Prepares Open Graph images for SEO
 * @param image - The image object to prepare
 * @returns Array of image URLs or undefined if no image is provided
 */
export function prepareOpenGraphImages(image: unknown): { url: string }[] | undefined {
  if (image && typeof image === "object" && "url" in image && image.url) {
    return [{ url: image.url as string }];
  }
  return undefined;
}

/**
 * Converts an image URL to base64 format
 * Used with Next.js Image component's blurDataURL property
 * @param imageUrl - The image URL to convert
 * @returns The base64 encoded image
 */
export async function getBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}${imageUrl}`,
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/webp";
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  }
}
