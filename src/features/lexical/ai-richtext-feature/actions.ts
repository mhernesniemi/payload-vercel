"use server";

import OpenAI from "openai";

function getOpenAIInstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateAdminContent(
  prompt: string,
  title: string = "",
  description: string = "",
  content: string = "",
  appliedTo: string = "",
) {
  try {
    const openai = getOpenAIInstance();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `First we define the data sources and based on their data we generate the response. 1. Prompt: "${prompt}". 2. Title: "${title}". 3. Description: "${description}". 4. Content: "${content}". Use the same language as in data sources, use correct grammar and punctuation for the language. The response is used to fill the field "${appliedTo}" in a content management system.`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
