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
  fieldType: string = "content",
  contextualContent: {
    otherParagraphs?: string[];
    pageTitle?: string;
    pageDescription?: string;
  } = {},
) {
  try {
    const openai = getOpenAIInstance();

    // Prepare contextual content
    const otherParagraphsText = contextualContent.otherParagraphs?.length
      ? `Other paragraphs in the same field:\n${contextualContent.otherParagraphs.join("\n\n")}`
      : "";

    console.log("otherParagraphs count:", contextualContent.otherParagraphs?.length || 0);

    const pageTitleText =
      contextualContent.pageTitle || title ? `Page title: "${contextualContent.pageTitle || title}"` : "";

    const pageDescriptionText =
      contextualContent.pageDescription || description
        ? `Page description: "${contextualContent.pageDescription || description}"`
        : "";

    const contentText = content ? `Current content: "${content}"` : "";

    // Build the full context
    const fullContext = [prompt, contentText, otherParagraphsText, pageTitleText, pageDescriptionText]
      .filter(Boolean)
      .join("\n\n");

    console.log("Full context length:", fullContext.length);
    console.log("Context parts:", {
      promptLength: prompt.length,
      contentTextLength: contentText.length,
      otherParagraphsTextLength: otherParagraphsText.length,
      pageTitleTextLength: pageTitleText.length,
      pageDescriptionTextLength: pageDescriptionText.length,
    });

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
          content: `Apply the following prompt to generate content for the field "${fieldType}": ${fullContext}`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
}
