"use server";

import OpenAI from "openai";

function getOpenAIInstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function generateSeoDescription(title: string, description: string) {
  try {
    const openai = getOpenAIInstance();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates content for a content management system. Don't use markdown formatting. Use formatting that is supported by the Lexical editor.`,
        },
        {
          role: "user",
          content: `Write a concise and compelling meta description (between 150–160 characters) that accurately summarizes the page content and encourages clicks by highlighting unique value. Avoid keyword stuffing and duplicate descriptions; instead, use natural, engaging language relevant to the user's intent. The following is the content of the page: Title: "${title}". Description: "${description}".`,
        },
      ],
    });

    return completion.choices[0].message.content?.replace(/^"|"$/g, "") ?? "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}

export async function generateSeoTitle(title: string) {
  try {
    const openai = getOpenAIInstance();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that generates content for a content management system. Don't use markdown formatting. Use formatting that is supported by the Lexical editor.`,
        },
        {
          role: "user",
          content: `Write a meta title that is as close as possible to the original title of the page: "${title}". Keep the meta title between 50–60 characters.`,
        },
      ],
    });

    return completion.choices[0].message.content?.replace(/^"|"$/g, "") ?? "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
