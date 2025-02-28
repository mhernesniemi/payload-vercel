"use client";

import { useState } from "react";
import OpenAI from "openai";
import { useField } from "@payloadcms/ui";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function TestComponent() {
  const [aiResponse, setAiResponse] = useState("");
  const { value: title } = useField<string>({ path: "title" });
  const [prompt, setPrompt] = useState("");

  const handleGenerateContent = async () => {
    if (!title) return;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nTitle: ${title}`,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      if (response) {
        setAiResponse(response);
        console.log("AI Response:", response);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Syötä AI-promptisi tähän..."
          style={{ width: "100%", minHeight: "100px" }}
        />
      </div>
      <button
        onClick={handleGenerateContent}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Generoi sisältöä
      </button>
      {aiResponse && (
        <div style={{ marginTop: "20px" }}>
          <h3>AI:n vastaus:</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{aiResponse}</pre>
        </div>
      )}
    </div>
  );
}
