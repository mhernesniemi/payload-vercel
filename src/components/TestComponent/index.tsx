"use client";

import { useState } from "react";
import OpenAI from "openai";
import { useField } from "@payloadcms/ui";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const Field: React.FC = () => {
  const [aiResponse, setAiResponse] = useState("");
  const { value, setValue } = useField<string>({ path: "title" });
  const [prompt, setPrompt] = useState("");

  const handleGenerateContent = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!value) return;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `This is the prompt: "${prompt}"\n\n Apply it to the following text, give response so it can be used directly in the text field where it came from: "${value}"`,
          },
        ],
      });

      const response = completion.choices[0].message.content;
      if (response) {
        const cleanedResponse = response.replace(/^"|"$/g, "");
        setAiResponse(cleanedResponse);
        setValue(cleanedResponse);
        console.log("AI Response:", cleanedResponse);
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
};

export default Field;
