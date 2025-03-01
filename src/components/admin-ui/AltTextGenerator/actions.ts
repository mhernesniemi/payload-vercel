"use server";

import OpenAI from "openai";
import { readFileSync } from "fs";
import { join } from "path";

function getOpenAIInstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateImageAltText(imageId: string | undefined) {
  try {
    if (!imageId) {
      return "No image provided";
    }

    // Constants for media path
    const MEDIA_DIRECTORY = "media";

    // Create a full path to the image
    const workDir = process.cwd();
    const mediaPath = join(workDir, MEDIA_DIRECTORY, imageId);

    try {
      // Read the image as base64
      const fileBuffer = readFileSync(mediaPath);
      const base64Image = fileBuffer.toString("base64");

      // Send the image to OpenAI for analysis
      const openai = getOpenAIInstance();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Generate a brief, accurate alt text for this image. Describe the main visual elements. Keep it concise and under 125 characters.",
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error reading image file:", error);
      return "Error processing image";
    }
  } catch (error) {
    console.error("Error in generateImageAltText:", error);
    return "Error generating alt text";
  }
}
