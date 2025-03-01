"use server";

import OpenAI from "openai";

function getOpenAIInstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateAdminContent(
  prompt: string,
  title: string,
  description: string,
  content: string,
  appliedTo: string,
) {
  try {
    const openai = getOpenAIInstance();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates content for a content management system. Don't use markdown formatting. Use formatting that is supported by the Lexical editor. Use the same language as in data sources, use correct grammar and punctuation for the language.`,
        },
        {
          role: "user",
          content: `Apply the following prompt to generate content for the field "${appliedTo}": "${prompt}", contextual data: title: "${title}", description: "${description}", content: "${content}"`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
