"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(prompt: string, selectedText: string, surroundingText: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `First we define the data sources and based on that data we generate the response. 1. Prompt: "${prompt}". 2. Surrounding text: "${surroundingText}". 3. Selected text: "${selectedText}". Use the same language as in data sources, use correct grammar and punctuation for the language. Give the response in that form that can be used directly to replace "${selectedText}". Give only one answer. Do not include the old text in the response. The response should work together with the surrounding text: "${surroundingText}".`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
