"use server";

import OpenAI from "openai";
import { getPayload } from "payload";
import config from "@payload-config";
import { readFileSync } from "fs";
import { join } from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImageAltText(imageId: string | undefined) {
  if (!imageId) {
    throw new Error("No image ID provided");
  }

  try {
    // Get Payload client
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

    // Send the image to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an assistant that generates high-quality, descriptive alt text for images. Be concise but comprehensive.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please generate descriptive alt text for this image:" },
            { type: "image_url", image_url: { url: dataURI } },
          ],
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating alt text:", error);
    throw new Error("Failed to generate alt text");
  }
}
