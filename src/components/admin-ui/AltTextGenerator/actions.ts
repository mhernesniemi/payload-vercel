"use server";

import { readFileSync } from "fs";
import { join } from "path";

export async function generateImageAltText(imageId: string | undefined) {
  if (!imageId) {
    throw new Error("No image ID provided");
  }

  try {
    // Dynamically import dependencies to avoid initialization issues
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");

    const payload = await getPayload({ config });

    // Fetch the image document from the Media collection
    const image = await payload.findByID({
      collection: "media",
      id: imageId,
    });

    if (!image || !image.filename) {
      throw new Error("Image not found");
    }

    // Construct path to the uploaded file
    const mediaDir = process.env.PAYLOAD_PUBLIC_MEDIA_PATH || "media";
    const filePath = join(process.cwd(), mediaDir, image.filename);

    // Read the image file as a buffer
    const fileBuffer = readFileSync(filePath);

    // Convert to base64
    const base64Image = fileBuffer.toString("base64");
    const dataURI = `data:${image.mimeType};base64,${base64Image}`;

    // Handle OpenAI in a separate async function to avoid initialization issues
    const altText = await generateAltTextWithOpenAI(dataURI);
    return altText;
  } catch (error) {
    console.error("Error generating alt text:", error);
    throw new Error("Failed to generate alt text");
  }
}

async function generateAltTextWithOpenAI(imageDataURI: string) {
  try {
    // Dynamically import OpenAI to avoid initialization issues
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that generates high-quality, descriptive alt text for images. Be concise but comprehensive.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please generate descriptive alt text for this image:" },
            { type: "image_url", image_url: { url: imageDataURI } },
          ],
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI processing:", error);
    throw new Error("OpenAI processing failed");
  }
}

export async function translateAltText(imageId: string | undefined, targetLocale: string) {
  if (!imageId) {
    throw new Error("No image ID provided");
  }

  try {
    // Dynamically import dependencies to avoid initialization issues
    const { getPayload } = await import("payload");
    const { default: config } = await import("@payload-config");

    const payload = await getPayload({ config });

    const image = await payload.findByID({
      collection: "media",
      id: imageId,
    });

    if (!image) {
      throw new Error("Image not found");
    }

    if (!image.alt) {
      throw new Error("Image does not have alt text to translate");
    }

    const translatedText = await translateAltTextWithOpenAI(image.alt, targetLocale);
    return translatedText;
  } catch (error) {
    console.error("Error translating alt text:", error);
    throw new Error("Failed to translate alt text");
  }
}

async function translateAltTextWithOpenAI(originalText: string, targetLocale: string) {
  try {
    // Dynamically import OpenAI to avoid initialization issues
    const { default: OpenAI } = await import("openai");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an assistant that translates image alt text from one language to another. Translate to ${targetLocale} language. Be concise but maintain all important details.`,
        },
        {
          role: "user",
          content: `Please translate this alt text to ${targetLocale}: "${originalText}"`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI translation:", error);
    throw new Error("OpenAI translation failed");
  }
}
